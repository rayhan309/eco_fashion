import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageHeaderProps = {
  title: string;
  description?: string;
  countLabel?: string;
  breadcrumbs?: BreadcrumbItem[];
};

export function PageHeader({
  title,
  description,
  countLabel,
  breadcrumbs = [],
}: PageHeaderProps) {
  return (
    <div className="space-y-3">
      {breadcrumbs.length > 0 ? (
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                {index > 0 ? <span className="text-[#61716a]">/</span> : null}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-[#61716a] transition-colors hover:text-[#1f6f5b]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "font-medium text-[#20312d]" : "text-[#61716a]"}>
                    {item.label}
                  </span>
                )}
              </span>
            );
          })}
        </nav>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.03em] text-[#20312d] sm:text-3xl md:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#61716a] sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {countLabel ? (
          <p className="shrink-0 text-sm font-medium text-[#61716a]">{countLabel}</p>
        ) : null}
      </div>
    </div>
  );
}
