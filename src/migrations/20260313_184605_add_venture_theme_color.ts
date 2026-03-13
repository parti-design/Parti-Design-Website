import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "ventures" ADD COLUMN "theme_color" varchar DEFAULT '#ccc2de';
  ALTER TABLE "_ventures_v" ADD COLUMN "version_theme_color" varchar DEFAULT '#ccc2de';
  UPDATE "ventures"
  SET "theme_color" = CASE
    WHEN "slug" = 'massvis' THEN '#ccc2de'
    WHEN "slug" = 'umea-kallbad' THEN '#bbd644'
    WHEN "slug" = 'dit-egnahem' THEN '#231f20'
    ELSE "theme_color"
  END;
  UPDATE "_ventures_v"
  SET "version_theme_color" = CASE
    WHEN "version_slug" = 'massvis' THEN '#ccc2de'
    WHEN "version_slug" = 'umea-kallbad' THEN '#bbd644'
    WHEN "version_slug" = 'dit-egnahem' THEN '#231f20'
    ELSE "version_theme_color"
  END;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "ventures" DROP COLUMN "theme_color";
  ALTER TABLE "_ventures_v" DROP COLUMN "version_theme_color";`)
}
