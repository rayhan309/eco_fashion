import { HeroSideCard } from "@/components/home/HeroSideCard";
import { HeroSlider } from "@/components/home/HeroSlider";
import { heroSideBanners, heroSlides } from "@/data/hero";

export function HeroSection() {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-1 lg:h-[420px]">
      <div className="lg:col-span-2 h-[280px] sm:h-[360px] lg:h-full">
        <HeroSlider slides={heroSlides} />
      </div>

      <div className="flex flex-col gap-4 lg:h-full">
        {heroSideBanners.map((banner) => (
          <HeroSideCard key={banner.id} banner={banner} />
        ))}
      </div>
    </section>
  );
}
