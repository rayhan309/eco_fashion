import mongoose, { Schema, type Model } from "mongoose";

type SeedModel = Model<mongoose.Document & { legacyId?: string }>;

const cache = new Map<string, SeedModel>();

export function getSeedModel(collection: string): SeedModel {
  const key = `Seed_${collection}`;
  if (cache.has(key)) {
    return cache.get(key)!;
  }

  const schema = new Schema(
    {},
    {
      strict: false,
      collection,
      timestamps: true,
    },
  );
  schema.index({ legacyId: 1 }, { unique: true, sparse: true });

  const model =
    (mongoose.models[key] as SeedModel | undefined) ??
    mongoose.model<mongoose.Document & { legacyId?: string }>(key, schema, collection);

  cache.set(key, model);
  return model;
}
