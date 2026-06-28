DROP INDEX "workspace_members_user_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_members_user_unique" ON "workspace_members" USING btree ("user_id");