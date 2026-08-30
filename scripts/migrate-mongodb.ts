import { MongoClient } from "mongodb";
import { config } from "dotenv";

config();

const SOURCE_URI = process.env.SOURCE_MONGODB_URI ?? process.env.MONGODB_URI;
const TARGET_URI = process.env.TARGET_MONGODB_URI;
const DB_NAME = process.env.DBNAME || process.env.BDNAME || "eco_fashion";

async function migrate() {
  if (!SOURCE_URI) {
    throw new Error("SOURCE_MONGODB_URI or MONGODB_URI is required");
  }
  if (!TARGET_URI) {
    throw new Error("TARGET_MONGODB_URI is required");
  }

  const sourceClient = new MongoClient(SOURCE_URI);
  const targetClient = new MongoClient(TARGET_URI);

  await sourceClient.connect();
  await targetClient.connect();

  const sourceDb = sourceClient.db(DB_NAME);
  const targetDb = targetClient.db(DB_NAME);

  const collections = await sourceDb.listCollections().toArray();
  const summary: Array<{ collection: string; count: number }> = [];

  for (const { name } of collections) {
    if (name.startsWith("system.")) continue;

    const docs = await sourceDb.collection(name).find({}).toArray();
    const targetCollection = targetDb.collection(name);

    await targetCollection.deleteMany({});
    if (docs.length > 0) {
      await targetCollection.insertMany(docs, { ordered: false });
    }

    summary.push({ collection: name, count: docs.length });
    console.log(`[migrate] ${name}: ${docs.length} document(s)`);
  }

  await sourceClient.close();
  await targetClient.close();

  const total = summary.reduce((sum, item) => sum + item.count, 0);
  console.log(`\n[migrate] Done. ${summary.length} collection(s), ${total} document(s) copied to "${DB_NAME}".`);
}

migrate().catch((error) => {
  console.error("[migrate] Failed:", error);
  process.exit(1);
});
