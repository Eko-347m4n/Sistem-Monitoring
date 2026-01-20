import { prisma } from '@/lib/prisma';

export async function fetchPreOrderById(id: string) {
  try {
    const preOrder = await prisma.preOrder.findUnique({
      where: { id },
      include: {
        work_units: {
          include: {
            assignments: {
              where: { unassigned_at: null },
              include: { technician: { select: { name: true } } }
            }
          }
        },
        created_by: { select: { name: true } }
      }
    });
    return preOrder;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch pre-order detail.');
  }
}

export async function fetchTechnicians() {
  try {
    return await prisma.user.findMany({
      where: { role: 'TECHNICIAN', is_active: true },
      select: { id: true, name: true }
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch technicians.');
  }
}

export async function fetchTechnicianTasks(technicianId: string) {
  try {
    return await prisma.workUnitAssignment.findMany({
      where: {
        technician_id: technicianId,
        unassigned_at: null, // Only active assignments
        work_unit: {
           status: { not: 'DONE' } // Only unfinished tasks (optional, maybe they want to see done ones too)
        }
      },
      include: {
        work_unit: {
          include: {
            pre_order: { select: { order_code: true, customer_name: true } }
          }
        }
      }
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tasks.');
  }
}

export async function fetchTodayAttendance(technicianId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  try {
    return await prisma.attendance.findFirst({
      where: {
        technician_id: technicianId,
        created_at: { gte: today }
      }
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch attendance.');
  }
}

export async function fetchPreOrders() {
  try {
    const preOrders = await prisma.preOrder.findMany({
      include: {
        created_by: {
          select: { name: true, email: true },
        },
        work_units: true,
      },
      orderBy: { created_at: 'desc' },
    });
    return preOrders;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch pre-orders data.');
  }
}
