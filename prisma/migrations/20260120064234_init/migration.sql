-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "pre_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order_code" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "created_by_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "pre_orders_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "work_units" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pre_order_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "last_updated_by_id" TEXT,
    "last_updated_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "work_units_pre_order_id_fkey" FOREIGN KEY ("pre_order_id") REFERENCES "pre_orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "work_units_last_updated_by_id_fkey" FOREIGN KEY ("last_updated_by_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "work_unit_assignments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "work_unit_id" TEXT NOT NULL,
    "technician_id" TEXT NOT NULL,
    "assigned_by_id" TEXT NOT NULL,
    "assigned_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unassigned_at" DATETIME,
    "handover_note" TEXT,
    CONSTRAINT "work_unit_assignments_work_unit_id_fkey" FOREIGN KEY ("work_unit_id") REFERENCES "work_units" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "work_unit_assignments_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "work_unit_assignments_assigned_by_id_fkey" FOREIGN KEY ("assigned_by_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "work_unit_progress_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "work_unit_id" TEXT NOT NULL,
    "progress_before" INTEGER NOT NULL,
    "progress_after" INTEGER NOT NULL,
    "updated_by_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    CONSTRAINT "work_unit_progress_logs_work_unit_id_fkey" FOREIGN KEY ("work_unit_id") REFERENCES "work_units" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "work_unit_progress_logs_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "attendances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "technician_id" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "tap_in" DATETIME NOT NULL,
    "tap_out" DATETIME,
    "work_duration_minutes" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "attendances_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pre_orders_order_code_key" ON "pre_orders"("order_code");
