-- CreateEnum
CREATE TYPE "UploadType" AS ENUM ('UPLOADED_FILES', 'WORKING_FILES', 'RENDERED_IMAGES');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('PRIORITY', 'CLIENT_FEEDBACK', 'ELEMENT', 'ITEM_TO_KEEP', 'ITEM_TO_REMOVE', 'INSPIRATION');

-- CreateTable
CREATE TABLE "uploads" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "phase_number" INTEGER NOT NULL,
    "type" "UploadType" NOT NULL,

    CONSTRAINT "uploads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_images" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,

    CONSTRAINT "task_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "type" "TaskType" NOT NULL,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "design_notes" TEXT NOT NULL,
    "assigned_to_id" TEXT NOT NULL,
    "assigned_by_id" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phases" (
    "project_id" TEXT NOT NULL,
    "phase_number" INTEGER NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "phases_pkey" PRIMARY KEY ("project_id","phase_number")
);

-- AddForeignKey
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_project_id_phase_number_fkey" FOREIGN KEY ("project_id", "phase_number") REFERENCES "phases"("project_id", "phase_number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_images" ADD CONSTRAINT "task_images_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_assigned_by_id_fkey" FOREIGN KEY ("assigned_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phases" ADD CONSTRAINT "phases_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
