import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_ventures_venture_status_new" AS ENUM('seed', 'root', 'sprout', 'grow', 'flourish');
    CREATE TYPE "public"."enum__ventures_v_version_venture_status_new" AS ENUM('seed', 'root', 'sprout', 'grow', 'flourish');

    ALTER TABLE "ventures" ALTER COLUMN "venture_status" DROP DEFAULT;
    ALTER TABLE "_ventures_v" ALTER COLUMN "version_venture_status" DROP DEFAULT;

    ALTER TABLE "ventures"
      ALTER COLUMN "venture_status"
      TYPE "public"."enum_ventures_venture_status_new"
      USING (
        CASE
          WHEN "venture_status"::text = 'active' THEN 'grow'
          WHEN "venture_status"::text = 'in-development' THEN 'root'
          WHEN "venture_status"::text = 'completed' THEN 'sprout'
          ELSE COALESCE("venture_status"::text, 'seed')
        END
      )::"public"."enum_ventures_venture_status_new";

    ALTER TABLE "_ventures_v"
      ALTER COLUMN "version_venture_status"
      TYPE "public"."enum__ventures_v_version_venture_status_new"
      USING (
        CASE
          WHEN "version_venture_status"::text = 'active' THEN 'grow'
          WHEN "version_venture_status"::text = 'in-development' THEN 'root'
          WHEN "version_venture_status"::text = 'completed' THEN 'sprout'
          ELSE COALESCE("version_venture_status"::text, 'seed')
        END
      )::"public"."enum__ventures_v_version_venture_status_new";

    DROP TYPE "public"."enum_ventures_venture_status";
    DROP TYPE "public"."enum__ventures_v_version_venture_status";

    ALTER TYPE "public"."enum_ventures_venture_status_new" RENAME TO "enum_ventures_venture_status";
    ALTER TYPE "public"."enum__ventures_v_version_venture_status_new" RENAME TO "enum__ventures_v_version_venture_status";

    ALTER TABLE "ventures" ALTER COLUMN "venture_status" SET DEFAULT 'seed';
    ALTER TABLE "_ventures_v" ALTER COLUMN "version_venture_status" SET DEFAULT 'seed';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_ventures_venture_status_old" AS ENUM('active', 'in-development', 'completed');
    CREATE TYPE "public"."enum__ventures_v_version_venture_status_old" AS ENUM('active', 'in-development', 'completed');

    ALTER TABLE "ventures" ALTER COLUMN "venture_status" DROP DEFAULT;
    ALTER TABLE "_ventures_v" ALTER COLUMN "version_venture_status" DROP DEFAULT;

    ALTER TABLE "ventures"
      ALTER COLUMN "venture_status"
      TYPE "public"."enum_ventures_venture_status_old"
      USING (
        CASE
          WHEN "venture_status"::text = 'seed' THEN 'active'
          WHEN "venture_status"::text = 'root' THEN 'in-development'
          WHEN "venture_status"::text = 'sprout' THEN 'completed'
          WHEN "venture_status"::text = 'grow' THEN 'active'
          WHEN "venture_status"::text = 'flourish' THEN 'completed'
          ELSE COALESCE("venture_status"::text, 'active')
        END
      )::"public"."enum_ventures_venture_status_old";

    ALTER TABLE "_ventures_v"
      ALTER COLUMN "version_venture_status"
      TYPE "public"."enum__ventures_v_version_venture_status_old"
      USING (
        CASE
          WHEN "version_venture_status"::text = 'seed' THEN 'active'
          WHEN "version_venture_status"::text = 'root' THEN 'in-development'
          WHEN "version_venture_status"::text = 'sprout' THEN 'completed'
          WHEN "version_venture_status"::text = 'grow' THEN 'active'
          WHEN "version_venture_status"::text = 'flourish' THEN 'completed'
          ELSE COALESCE("version_venture_status"::text, 'active')
        END
      )::"public"."enum__ventures_v_version_venture_status_old";

    DROP TYPE "public"."enum_ventures_venture_status";
    DROP TYPE "public"."enum__ventures_v_version_venture_status";

    ALTER TYPE "public"."enum_ventures_venture_status_old" RENAME TO "enum_ventures_venture_status";
    ALTER TYPE "public"."enum__ventures_v_version_venture_status_old" RENAME TO "enum__ventures_v_version_venture_status";

    ALTER TABLE "ventures" ALTER COLUMN "venture_status" SET DEFAULT 'active';
    ALTER TABLE "_ventures_v" ALTER COLUMN "version_venture_status" SET DEFAULT 'active';
  `)
}
