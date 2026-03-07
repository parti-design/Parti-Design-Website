import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_services" AS ENUM('architecture-spatial', 'graphic-design-branding', 'ux-ui-digital', 'co-design-workshops', 'facilitation-project-management', 'placemaking-consulting', 'research-development');
  CREATE TYPE "public"."enum_projects_project_status" AS ENUM('completed', 'in-progress', 'study-concept');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_services" AS ENUM('architecture-spatial', 'graphic-design-branding', 'ux-ui-digital', 'co-design-workshops', 'facilitation-project-management', 'placemaking-consulting', 'research-development');
  CREATE TYPE "public"."enum__projects_v_version_project_status" AS ENUM('completed', 'in-progress', 'study-concept');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_ventures_services" AS ENUM('architecture-spatial', 'graphic-design-branding', 'ux-ui-digital', 'co-design-workshops', 'facilitation-project-management', 'placemaking-consulting', 'research-development');
  CREATE TYPE "public"."enum_ventures_venture_status" AS ENUM('active', 'in-development', 'completed');
  CREATE TYPE "public"."enum_ventures_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__ventures_v_version_services" AS ENUM('architecture-spatial', 'graphic-design-branding', 'ux-ui-digital', 'co-design-workshops', 'facilitation-project-management', 'placemaking-consulting', 'research-development');
  CREATE TYPE "public"."enum__ventures_v_version_venture_status" AS ENUM('active', 'in-development', 'completed');
  CREATE TYPE "public"."enum__ventures_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "projects_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "projects_services" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_projects_services",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "projects_collaborators" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"cover_image_id" integer,
  	"tagline" varchar,
  	"description" jsonb,
  	"content" jsonb,
  	"client" varchar,
  	"location" varchar,
  	"year" numeric,
  	"project_status" "enum_projects_project_status" DEFAULT 'completed',
  	"featured" boolean DEFAULT false,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer
  );
  
  CREATE TABLE "_projects_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_services" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__projects_v_version_services",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_collaborators" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_cover_image_id" integer,
  	"version_tagline" varchar,
  	"version_description" jsonb,
  	"version_content" jsonb,
  	"version_client" varchar,
  	"version_location" varchar,
  	"version_year" numeric,
  	"version_project_status" "enum__projects_v_version_project_status" DEFAULT 'completed',
  	"version_featured" boolean DEFAULT false,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer
  );
  
  CREATE TABLE "ventures_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "ventures_services" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_ventures_services",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "ventures" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"cover_image_id" integer,
  	"tagline" varchar,
  	"description" jsonb,
  	"external_url" varchar,
  	"venture_status" "enum_ventures_venture_status" DEFAULT 'active',
  	"location" varchar,
  	"featured" boolean DEFAULT false,
  	"order" numeric,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_ventures_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_ventures_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_ventures_v_version_services" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__ventures_v_version_services",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_ventures_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_cover_image_id" integer,
  	"version_tagline" varchar,
  	"version_description" jsonb,
  	"version_external_url" varchar,
  	"version_venture_status" "enum__ventures_v_version_venture_status" DEFAULT 'active',
  	"version_location" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_order" numeric,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__ventures_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "ventures_id" integer;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_services" ADD CONSTRAINT "projects_services_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_collaborators" ADD CONSTRAINT "projects_collaborators_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_gallery" ADD CONSTRAINT "_projects_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_gallery" ADD CONSTRAINT "_projects_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_services" ADD CONSTRAINT "_projects_v_version_services_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_collaborators" ADD CONSTRAINT "_projects_v_version_collaborators_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ventures_gallery" ADD CONSTRAINT "ventures_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ventures_gallery" ADD CONSTRAINT "ventures_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ventures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ventures_services" ADD CONSTRAINT "ventures_services_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."ventures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ventures" ADD CONSTRAINT "ventures_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ventures" ADD CONSTRAINT "ventures_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ventures_v_version_gallery" ADD CONSTRAINT "_ventures_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ventures_v_version_gallery" ADD CONSTRAINT "_ventures_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_ventures_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_ventures_v_version_services" ADD CONSTRAINT "_ventures_v_version_services_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_ventures_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_ventures_v" ADD CONSTRAINT "_ventures_v_parent_id_ventures_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."ventures"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ventures_v" ADD CONSTRAINT "_ventures_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ventures_v" ADD CONSTRAINT "_ventures_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_gallery_order_idx" ON "projects_gallery" USING btree ("_order");
  CREATE INDEX "projects_gallery_parent_id_idx" ON "projects_gallery" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_image_idx" ON "projects_gallery" USING btree ("image_id");
  CREATE INDEX "projects_services_order_idx" ON "projects_services" USING btree ("order");
  CREATE INDEX "projects_services_parent_idx" ON "projects_services" USING btree ("parent_id");
  CREATE INDEX "projects_collaborators_order_idx" ON "projects_collaborators" USING btree ("_order");
  CREATE INDEX "projects_collaborators_parent_id_idx" ON "projects_collaborators" USING btree ("_parent_id");
  CREATE INDEX "projects_cover_image_idx" ON "projects" USING btree ("cover_image_id");
  CREATE INDEX "projects_meta_meta_image_idx" ON "projects" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_projects_id_idx" ON "projects_rels" USING btree ("projects_id");
  CREATE INDEX "_projects_v_version_gallery_order_idx" ON "_projects_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_projects_v_version_gallery_parent_id_idx" ON "_projects_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_gallery_image_idx" ON "_projects_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_projects_v_version_services_order_idx" ON "_projects_v_version_services" USING btree ("order");
  CREATE INDEX "_projects_v_version_services_parent_idx" ON "_projects_v_version_services" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_collaborators_order_idx" ON "_projects_v_version_collaborators" USING btree ("_order");
  CREATE INDEX "_projects_v_version_collaborators_parent_id_idx" ON "_projects_v_version_collaborators" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_cover_image_idx" ON "_projects_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_projects_v_version_meta_version_meta_image_idx" ON "_projects_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_autosave_idx" ON "_projects_v" USING btree ("autosave");
  CREATE INDEX "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_projects_id_idx" ON "_projects_v_rels" USING btree ("projects_id");
  CREATE INDEX "ventures_gallery_order_idx" ON "ventures_gallery" USING btree ("_order");
  CREATE INDEX "ventures_gallery_parent_id_idx" ON "ventures_gallery" USING btree ("_parent_id");
  CREATE INDEX "ventures_gallery_image_idx" ON "ventures_gallery" USING btree ("image_id");
  CREATE INDEX "ventures_services_order_idx" ON "ventures_services" USING btree ("order");
  CREATE INDEX "ventures_services_parent_idx" ON "ventures_services" USING btree ("parent_id");
  CREATE INDEX "ventures_cover_image_idx" ON "ventures" USING btree ("cover_image_id");
  CREATE INDEX "ventures_meta_meta_image_idx" ON "ventures" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "ventures_slug_idx" ON "ventures" USING btree ("slug");
  CREATE INDEX "ventures_updated_at_idx" ON "ventures" USING btree ("updated_at");
  CREATE INDEX "ventures_created_at_idx" ON "ventures" USING btree ("created_at");
  CREATE INDEX "ventures__status_idx" ON "ventures" USING btree ("_status");
  CREATE INDEX "_ventures_v_version_gallery_order_idx" ON "_ventures_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_ventures_v_version_gallery_parent_id_idx" ON "_ventures_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_ventures_v_version_gallery_image_idx" ON "_ventures_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_ventures_v_version_services_order_idx" ON "_ventures_v_version_services" USING btree ("order");
  CREATE INDEX "_ventures_v_version_services_parent_idx" ON "_ventures_v_version_services" USING btree ("parent_id");
  CREATE INDEX "_ventures_v_parent_idx" ON "_ventures_v" USING btree ("parent_id");
  CREATE INDEX "_ventures_v_version_version_cover_image_idx" ON "_ventures_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_ventures_v_version_meta_version_meta_image_idx" ON "_ventures_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_ventures_v_version_version_slug_idx" ON "_ventures_v" USING btree ("version_slug");
  CREATE INDEX "_ventures_v_version_version_updated_at_idx" ON "_ventures_v" USING btree ("version_updated_at");
  CREATE INDEX "_ventures_v_version_version_created_at_idx" ON "_ventures_v" USING btree ("version_created_at");
  CREATE INDEX "_ventures_v_version_version__status_idx" ON "_ventures_v" USING btree ("version__status");
  CREATE INDEX "_ventures_v_created_at_idx" ON "_ventures_v" USING btree ("created_at");
  CREATE INDEX "_ventures_v_updated_at_idx" ON "_ventures_v" USING btree ("updated_at");
  CREATE INDEX "_ventures_v_latest_idx" ON "_ventures_v" USING btree ("latest");
  CREATE INDEX "_ventures_v_autosave_idx" ON "_ventures_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ventures_fk" FOREIGN KEY ("ventures_id") REFERENCES "public"."ventures"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_ventures_id_idx" ON "payload_locked_documents_rels" USING btree ("ventures_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_collaborators" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_collaborators" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ventures_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ventures_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ventures" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_ventures_v_version_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_ventures_v_version_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_ventures_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "projects_gallery" CASCADE;
  DROP TABLE "projects_services" CASCADE;
  DROP TABLE "projects_collaborators" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "_projects_v_version_gallery" CASCADE;
  DROP TABLE "_projects_v_version_services" CASCADE;
  DROP TABLE "_projects_v_version_collaborators" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_rels" CASCADE;
  DROP TABLE "ventures_gallery" CASCADE;
  DROP TABLE "ventures_services" CASCADE;
  DROP TABLE "ventures" CASCADE;
  DROP TABLE "_ventures_v_version_gallery" CASCADE;
  DROP TABLE "_ventures_v_version_services" CASCADE;
  DROP TABLE "_ventures_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_ventures_fk";
  
  DROP INDEX "payload_locked_documents_rels_projects_id_idx";
  DROP INDEX "payload_locked_documents_rels_ventures_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "ventures_id";
  DROP TYPE "public"."enum_projects_services";
  DROP TYPE "public"."enum_projects_project_status";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_services";
  DROP TYPE "public"."enum__projects_v_version_project_status";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum_ventures_services";
  DROP TYPE "public"."enum_ventures_venture_status";
  DROP TYPE "public"."enum_ventures_status";
  DROP TYPE "public"."enum__ventures_v_version_services";
  DROP TYPE "public"."enum__ventures_v_version_venture_status";
  DROP TYPE "public"."enum__ventures_v_version_status";`)
}
