import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/types/collection";

type CollectionCardProps = {
  collection: Collection;
  productCount: number;
};

export function CollectionCard({ collection, productCount }: CollectionCardProps) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group relative block overflow-hidden rounded-md"
    >
      <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[16/10]">
        <Image
          src={collection.image}
          alt={collection.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-white/75 uppercase">
            {productCount} products
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
            {collection.title}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm text-white/85">{collection.description}</p>
        </div>
      </div>
    </Link>
  );
}
