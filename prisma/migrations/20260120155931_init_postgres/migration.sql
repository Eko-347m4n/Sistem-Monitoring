-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pre_orders" (
    "id" TEXT NOT NULL,
    "order_code" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pre_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_units" (
    "id" TEXT NOT NULL,
    "pre_order_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "last_updated_by_id" TEXT,
    "last_updated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_unit_assignments" (
    "id" TEXT NOT NULL,
    "work_unit_id" TEXT NOT NULL,
    "technician_id" TEXT NOT NULL,
    "assigned_by_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unassigned_at" TIMESTAMP(3),
    "handover_note" TEXT,

    CONSTRAINT "work_unit_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_unit_progress_logs" (
    "id" TEXT NOT NULL,
    "work_unit_id" TEXT NOT NULL,
    "progress_before" INTEGER NOT NULL,
    "progress_after" INTEGER NOT NULL,
    "updated_by_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "work_unit_progress_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendances" (
    "id" TEXT NOT NULL,
    "technician_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "tap_in" TIMESTAMP(3) NOT NULL,
    "tap_out" TIMESTAMP(3),
    "work_duration_minutes" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pre_orders_order_code_key" ON "pre_orders"("order_code");

-- AddForeignKey
ALTER TABLE "pre_orders" ADD CONSTRAINT "pre_orders_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_units" ADD CONSTRAINT "work_units_pre_order_id_fkey" FOREIGN KEY ("pre_order_id") REFERENCES "pre_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_units" ADD CONSTRAINT "work_units_last_updated_by_id_fkey" FOREIGN KEY ("last_updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_unit_assignments" ADD CONSTRAINT "work_unit_assignments_work_unit_id_fkey" FOREIGN KEY ("work_unit_id") REFERENCES "work_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_unit_assignments" ADD CONSTRAINT "work_unit_assignments_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_unit_assignments" ADD CONSTRAINT "work_unit_assignments_assigned_by_id_fkey" FOREIGN KEY ("assigned_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_unit_progress_logs" ADD CONSTRAINT "work_unit_progress_logs_work_unit_id_fkey" FOREIGN KEY ("work_unit_id") REFERENCES "work_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_unit_progress_logs" ADD CONSTRAINT "work_unit_progress_logs_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
