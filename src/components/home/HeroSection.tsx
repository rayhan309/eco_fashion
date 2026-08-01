import { HeroSideCard } from "@/components/home/HeroSideCard";
import { HeroSlider } from "@/components/home/HeroSlider";
import type { HeroSideBanner, HeroSlide } from "@/types/hero";

type HeroSectionProps = {
  slides: HeroSlide[];
  sideBanners: HeroSideBanner[];
};

export function HeroSection({ slides, sideBanners }: HeroSectionProps) {
  const hasSlider = slides.length > 0;
  const hasSides = sideBanners.length > 0;

  if (!hasSlider && !hasSides) return null;

  if (hasSlider && !hasSides) {
    return (
      <section className="h-[280px] sm:h-[360px] lg:h-[420px]">
        <HeroSlider slides={slides} />
      </section>
    );
  }

  if (!hasSlider && hasSides) {
    return (
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:h-[420px]">
        {sideBanners.map((banner) => (
          <HeroSideCard key={banner.id} banner={banner} />
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-4 lg:h-[420px] lg:grid-cols-3 lg:grid-rows-1">
      <div className="h-[280px] sm:h-[360px] lg:col-span-2 lg:h-full">
        <HeroSlider slides={slides} />
      </div>
      <div className="flex flex-col gap-4 lg:h-full">
        {sideBanners.map((banner) => (
          <HeroSideCard key={banner.id} banner={banner} />
        ))}
      </div>
    </section>
  );
}
