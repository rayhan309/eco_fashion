import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const { seedDummyData } = await import("../src/lib/seed/seed-dummy-data");

  console.log("Seeding dummy data to MongoDB…\n");
  const results = await seedDummyData();

  for (const row of results) {
    console.log(`  ${row.collection}: ${row.upserted} upsert(s)`);
  }

  const total = results.reduce((sum, row) => sum + row.upserted, 0);
  console.log(`\nDone. ${total} upsert(s) across ${results.length} collections.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
