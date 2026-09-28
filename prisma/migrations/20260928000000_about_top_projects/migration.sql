-- About's section 06. Its own list rather than a pick from `projects`: see AboutTopProject.
CREATE TABLE "about_top_projects" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "sort_order" INTEGER NOT NULL,
  "name" VARCHAR(80) NOT NULL,
  "description" TEXT NOT NULL,
  "url" VARCHAR(500),
  CONSTRAINT "about_top_projects_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "about_top_projects_sort_order_idx" ON "about_top_projects"("sort_order");

-- Same deny-all as every other public table: Prisma bypasses it, the browser-held keys do not.
ALTER TABLE "about_top_projects" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "about_top_projects" FROM anon, authenticated;
