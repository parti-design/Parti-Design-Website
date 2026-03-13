import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "ventures" ALTER COLUMN "theme_color" DROP DEFAULT;
    ALTER TABLE "_ventures_v" ALTER COLUMN "version_theme_color" DROP DEFAULT;

    ALTER TABLE "ventures"
      ALTER COLUMN "theme_color"
      TYPE varchar
      USING (
        CASE
          WHEN "theme_color"::text = 'lime' THEN '#bbd644'
          WHEN "theme_color"::text = 'lavender' THEN '#ccc2de'
          WHEN "theme_color"::text = 'ink' THEN '#231f20'
          ELSE "theme_color"::text
        END
      );

    ALTER TABLE "_ventures_v"
      ALTER COLUMN "version_theme_color"
      TYPE varchar
      USING (
        CASE
          WHEN "version_theme_color"::text = 'lime' THEN '#bbd644'
          WHEN "version_theme_color"::text = 'lavender' THEN '#ccc2de'
          WHEN "version_theme_color"::text = 'ink' THEN '#231f20'
          ELSE "version_theme_color"::text
        END
      );

    DROP TYPE IF EXISTS "public"."enum_ventures_theme_color";
    DROP TYPE IF EXISTS "public"."enum__ventures_v_version_theme_color";

    ALTER TABLE "ventures" ALTER COLUMN "theme_color" SET DEFAULT '#ccc2de';
    ALTER TABLE "_ventures_v" ALTER COLUMN "version_theme_color" SET DEFAULT '#ccc2de';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_ventures_theme_color_old" AS ENUM('lime', 'lavender', 'ink');
    CREATE TYPE "public"."enum__ventures_v_version_theme_color_old" AS ENUM('lime', 'lavender', 'ink');

    ALTER TABLE "ventures" ALTER COLUMN "theme_color" DROP DEFAULT;
    ALTER TABLE "_ventures_v" ALTER COLUMN "version_theme_color" DROP DEFAULT;

    ALTER TABLE "ventures"
      ALTER COLUMN "theme_color"
      TYPE "public"."enum_ventures_theme_color_old"
      USING (
        CASE
          WHEN "theme_color"::text = '#bbd644' THEN 'lime'
          WHEN "theme_color"::text = '#ccc2de' THEN 'lavender'
          WHEN "theme_color"::text = '#231f20' THEN 'ink'
          ELSE 'lavender'
        END
      )::"public"."enum_ventures_theme_color_old";

    ALTER TABLE "_ventures_v"
      ALTER COLUMN "version_theme_color"
      TYPE "public"."enum__ventures_v_version_theme_color_old"
      USING (
        CASE
          WHEN "version_theme_color"::text = '#bbd644' THEN 'lime'
          WHEN "version_theme_color"::text = '#ccc2de' THEN 'lavender'
          WHEN "version_theme_color"::text = '#231f20' THEN 'ink'
          ELSE 'lavender'
        END
      )::"public"."enum__ventures_v_version_theme_color_old";

    ALTER TYPE "public"."enum_ventures_theme_color_old" RENAME TO "enum_ventures_theme_color";
    ALTER TYPE "public"."enum__ventures_v_version_theme_color_old" RENAME TO "enum__ventures_v_version_theme_color";

    ALTER TABLE "ventures" ALTER COLUMN "theme_color" SET DEFAULT 'lavender';
    ALTER TABLE "_ventures_v" ALTER COLUMN "version_theme_color" SET DEFAULT 'lavender';
  `)
}
