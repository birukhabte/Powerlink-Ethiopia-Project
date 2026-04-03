-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "role" VARCHAR(50) NOT NULL DEFAULT 'customer',
    "phone" VARCHAR(20),
    "address" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcement1" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL DEFAULT 'info',
    "priority" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "announcement1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outage_reports" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "outage_type" VARCHAR(100) NOT NULL,
    "urgency" VARCHAR(50) NOT NULL DEFAULT 'medium',
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "address" TEXT,
    "estimated_affected" VARCHAR(100),
    "reason" TEXT,
    "technician_notes" TEXT,
    "reported_by" INTEGER,
    "assigned_to" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outage_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_requests" (
    "id" SERIAL NOT NULL,
    "ticket_id" VARCHAR(50) NOT NULL,
    "service_type" VARCHAR(100) NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "city" VARCHAR(100),
    "woreda" VARCHAR(100),
    "kebele" VARCHAR(100),
    "house_plot_number" VARCHAR(100),
    "nearby_landmark" VARCHAR(255),
    "full_address" TEXT NOT NULL,
    "documents" JSONB,
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "priority" VARCHAR(50) NOT NULL DEFAULT 'medium',
    "assigned_to" INTEGER,
    "supervisor_notes" TEXT,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "service_requests_ticket_id_key" ON "service_requests"("ticket_id");

-- AddForeignKey
ALTER TABLE "announcement1" ADD CONSTRAINT "announcement1_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outage_reports" ADD CONSTRAINT "outage_reports_reported_by_fkey" FOREIGN KEY ("reported_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outage_reports" ADD CONSTRAINT "outage_reports_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
