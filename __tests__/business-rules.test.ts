// Setup Mocks FIRST
jest.mock('next-auth', () => ({
  AuthError: class extends Error {
    constructor(type: string) {
      super(type);
      this.type = type;
    }
    type: string;
  },
}));

jest.mock('@/auth', () => ({
  auth: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

// Import implementations AFTER mocks
import { assignTechnician, updateWorkProgress, submitAttendance } from '@/app/lib/actions';
import { prismaMock } from '@/prisma/singleton';
import { auth } from '@/auth';

describe('Business Rules Validation', () => {
  const mockSession = {
    user: {
      id: 'user-123',
      name: 'Test User',
      role: 'ADMIN',
    },
  };

  beforeEach(() => {
    (auth as jest.Mock).mockResolvedValue(mockSession);
  });

  // --- 1. PROGRESS RULES ---
  describe('Business Rule: Progress', () => {
    it('should NOT allow progress to decrease (allow_decrease: false)', async () => {
      // Mock existing state: Progress is 50%
      prismaMock.workUnit.findUnique.mockResolvedValue({
        id: 'unit-1',
        progress: 50,
        status: 'IN_PROGRESS',
      } as any);

      // Attempt to update to 40%
      const result = await updateWorkProgress('unit-1', 40, 'Wrong update');

      expect(result.message).toBe('Progress cannot decrease.');
      expect(prismaMock.workUnit.update).not.toHaveBeenCalled();
    });

    it('should derive status "DONE" when progress becomes 100', async () => {
      prismaMock.workUnit.findUnique.mockResolvedValue({
        id: 'unit-1',
        progress: 50,
        status: 'IN_PROGRESS',
      } as any);

      prismaMock.$transaction.mockResolvedValue([
          { id: 'unit-1', progress: 100, status: 'DONE' },
          { id: 'log-1' }
      ]);

      await updateWorkProgress('unit-1', 100, 'Finishing job');

      expect(prismaMock.$transaction).toHaveBeenCalled();
    });
  });

  // --- 2. ASSIGNMENT RULES ---
  describe('Business Rule: Assignment', () => {
    it('should ensure single active assignment (unassign others)', async () => {
      await assignTechnician('unit-1', 'tech-2', 'po-1');

      expect(prismaMock.workUnitAssignment.updateMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { work_unit_id: 'unit-1', unassigned_at: null },
        data: expect.objectContaining({ unassigned_at: expect.any(Date) }),
      }));

      expect(prismaMock.workUnitAssignment.create).toHaveBeenCalled();
    });
  });

  // --- 3. ATTENDANCE RULES ---
  describe('Business Rule: Attendance', () => {
    it('should TAP IN if no attendance exists for today', async () => {
      prismaMock.attendance.findFirst.mockResolvedValue(null);

      const result = await submitAttendance();

      expect(result.message).toBe('Tapped In Successfully');
      expect(prismaMock.attendance.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
           status: 'ON_TIME',
        })
      }));
    });

    it('should TAP OUT if tapped in but not tapped out', async () => {
      prismaMock.attendance.findFirst.mockResolvedValue({
        id: 'att-1',
        tap_in: new Date(new Date().setHours(8, 0, 0)),
        tap_out: null,
      } as any);

      const result = await submitAttendance();

      expect(result.message).toBe('Tapped Out Successfully');
      expect(prismaMock.attendance.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 'att-1' },
        data: expect.objectContaining({
          tap_out: expect.any(Date),
        }),
      }));
    });

    it('should block if already completed today (one_tap_in_per_day)', async () => {
       prismaMock.attendance.findFirst.mockResolvedValue({
        id: 'att-1',
        tap_in: new Date(),
        tap_out: new Date(),
      } as any);

      const result = await submitAttendance();

      expect(result.message).toBe('Already completed attendance for today.');
      expect(prismaMock.attendance.create).not.toHaveBeenCalled();
      expect(prismaMock.attendance.update).not.toHaveBeenCalled();
    });
  });
});
