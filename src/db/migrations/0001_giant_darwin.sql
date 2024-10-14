PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`done` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT '"2024-10-13T13:05:36.446Z"',
	`updated_at` integer DEFAULT '"2024-10-13T13:05:36.446Z"'
);
--> statement-breakpoint
INSERT INTO `__new_tasks`("id", "name", "done", "created_at", "updated_at") SELECT "id", "name", "done", "created_at", "updated_at" FROM `tasks`;--> statement-breakpoint
DROP TABLE `tasks`;--> statement-breakpoint
ALTER TABLE `__new_tasks` RENAME TO `tasks`;--> statement-breakpoint
PRAGMA foreign_keys=ON;