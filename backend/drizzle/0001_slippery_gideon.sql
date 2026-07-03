CREATE TYPE "public"."task_priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('todo', 'in_progress', 'done');--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "description" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "status" "task_status" DEFAULT 'todo' NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "priority" "task_priority" DEFAULT 'medium' NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "due_date" timestamp;--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "completed";