'use server';
 
import { signIn, signOut, auth } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.string(),
  customer_name: z.string().min(1, {
    message: 'Please enter a customer name.',
  }),
  description: z.string(),
  status: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED']),
  date: z.string(),
});

const CreatePreOrder = FormSchema.pick({ customer_name: true, description: true });

export async function createWorkUnit(preOrderId: string, type: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { message: 'Unauthorized' };
  }

  try {
    await prisma.workUnit.create({
      data: {
        pre_order_id: preOrderId,
        type: type,
        status: 'PENDING',
        progress: 0,
      },
    });
    revalidatePath(`/dashboard/pre-orders/${preOrderId}`);
    revalidatePath('/dashboard/work-units');
    return { message: 'Success' };
  } catch (error) {
    return { message: 'Failed to create work unit.' };
  }
}

export async function assignTechnician(workUnitId: string, technicianId: string, preOrderId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { message: 'Unauthorized' };
  }

  try {
    // 1. Unassign active assignments if any (single active assignment rule)
    await prisma.workUnitAssignment.updateMany({
      where: { work_unit_id: workUnitId, unassigned_at: null },
      data: { unassigned_at: new Date() }
    });

    // 2. Create new assignment
    await prisma.workUnitAssignment.create({
      data: {
        work_unit_id: workUnitId,
        technician_id: technicianId,
        assigned_by_id: session.user.id,
      }
    });

    revalidatePath(`/dashboard/pre-orders/${preOrderId}`);
    revalidatePath('/dashboard/work-units');
    revalidatePath('/dashboard'); // Update technician dashboard tasks
    return { message: 'Success' };
  } catch (error) {
    return { message: 'Failed to assign technician.' };
  }
}

export async function updateWorkProgress(workUnitId: string, newProgress: number, note: string) {
  const session = await auth();
  if (!session?.user?.id) return { message: 'Unauthorized' };

  try {
    // 1. Get current state
    const currentUnit = await prisma.workUnit.findUnique({
      where: { id: workUnitId },
      select: { progress: true, status: true, pre_order_id: true }
    });

    if (!currentUnit) return { message: 'Work unit not found.' };

    // Business Rule: Progress cannot decrease
    if (newProgress < currentUnit.progress) {
      return { message: 'Progress cannot decrease.' };
    }

    // Determine new status for Work Unit
    let newUnitStatus = currentUnit.status;
    if (newProgress === 100) newUnitStatus = 'DONE';
    else if (newProgress > 0) newUnitStatus = 'IN_PROGRESS';

    // 2. Transaction: Update Unit + Create Log + Update PO Status
    await prisma.$transaction(async (tx) => {
      // A. Update Work Unit
      await tx.workUnit.update({
        where: { id: workUnitId },
        data: {
          progress: newProgress,
          status: newUnitStatus,
          last_updated_by_id: session.user.id,
          last_updated_at: new Date(),
        }
      });

      // B. Create Progress Log
      await tx.workUnitProgressLog.create({
        data: {
          work_unit_id: workUnitId,
          progress_before: currentUnit.progress,
          progress_after: newProgress,
          updated_by_id: session.user.id,
          note: note
        }
      });

      // C. Update Pre-Order Status Logic
      const allUnits = await tx.workUnit.findMany({
        where: { pre_order_id: currentUnit.pre_order_id },
        select: { status: true, progress: true }
      });

      const allDone = allUnits.every(u => u.status === 'DONE');
      const anyProgress = allUnits.some(u => u.progress > 0);
      
      // Get current PO status
      const currentPO = await tx.preOrder.findUnique({
          where: { id: currentUnit.pre_order_id },
          select: { status: true }
      });

      if (currentPO) {
          let newPOStatus = currentPO.status;

          if (allDone && allUnits.length > 0) {
              newPOStatus = 'COMPLETED';
          } else if (anyProgress && newPOStatus !== 'ACTIVE') {
               // If started but not finished, ensure ACTIVE (unless cancelled, but logic here assumes flow DRAFT->ACTIVE->COMPLETED)
               if (newPOStatus === 'DRAFT' || newPOStatus === 'COMPLETED') {
                   newPOStatus = 'ACTIVE';
               }
          }

          if (newPOStatus !== currentPO.status) {
              await tx.preOrder.update({
                  where: { id: currentUnit.pre_order_id },
                  data: { status: newPOStatus }
              });
          }
      }
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/work-units');
    revalidatePath(`/dashboard/pre-orders/${currentUnit.pre_order_id}`);
    revalidatePath('/dashboard/pre-orders'); // Also revalidate PO list
    return { message: 'Success' };
  } catch (error) {
    console.error(error);
    return { message: 'Failed to update progress.' };
  }
}

export async function submitAttendance() {
  const session = await auth();
  if (!session?.user?.id) return { message: 'Unauthorized' };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    // Check existing attendance for today
    const existing = await prisma.attendance.findFirst({
      where: {
        technician_id: session.user.id,
        created_at: {
          gte: today 
        }
      }
    });

    if (!existing) {
      // TAP IN
      await prisma.attendance.create({
        data: {
          technician_id: session.user.id,
          date: today,
          tap_in: new Date(),
          status: 'ON_TIME' // Simplified logic
        }
      });
      revalidatePath('/dashboard');
      return { message: 'Tapped In Successfully' };
    } else if (!existing.tap_out) {
      // TAP OUT
      const now = new Date();
      const duration = Math.round((now.getTime() - existing.tap_in.getTime()) / 60000);
      
      await prisma.attendance.update({
        where: { id: existing.id },
        data: {
          tap_out: now,
          work_duration_minutes: duration
        }
      });
      revalidatePath('/dashboard');
      return { message: 'Tapped Out Successfully' };
    } else {
      return { message: 'Already completed attendance for today.' };
    }
  } catch (error) {
    console.error(error);
    return { message: 'Failed to submit attendance.' };
  }
}

export async function createPreOrder(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
     return { message: 'Unauthorized' };
  }

  const validatedFields = CreatePreOrder.safeParse({
    customer_name: formData.get('customer_name'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Pre-Order.',
    };
  }

  const { customer_name, description } = validatedFields.data;
  const workTypes = formData.getAll('work_types');
  
  // Generate Order Code: PO-YYYYMM-XXXX
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const prefix = `PO-${year}${month}-`;
  
  // Simple counter (in real prod, use atomic counter or sequence)
  const count = await prisma.preOrder.count({
    where: {
      order_code: {
        startsWith: prefix
      }
    }
  });
  
  const order_code = `${prefix}${String(count + 1).padStart(4, '0')}`;

  try {
    await prisma.$transaction(async (tx) => {
      const newPO = await tx.preOrder.create({
        data: {
          order_code,
          customer_name,
          description,
          status: 'DRAFT',
          created_by_id: session.user.id,
        },
      });

      if (workTypes.length > 0) {
        await tx.workUnit.createMany({
          data: workTypes.map((type) => ({
            pre_order_id: newPO.id,
            type: String(type),
            status: 'PENDING',
            progress: 0,
          })),
        });
      }
    });
  } catch (error) {
    console.error(error);
    return {
      message: 'Database Error: Failed to Create Pre-Order.',
    };
  }

  revalidatePath('/dashboard/pre-orders');
  revalidatePath('/dashboard/work-units');
  redirect('/dashboard/pre-orders');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function logOut() {
  await signOut();
}
