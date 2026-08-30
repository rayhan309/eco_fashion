type StarIconProps = {
  filled?: boolean;
  size?: number;
  className?: string;
  color?: string;
};

export function StarIcon({
  filled = true,
  size = 18,
  className,
  color = "currentColor",
}: StarIconProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill={filled ? color : "none"}
      stroke={filled ? "none" : color}
      strokeWidth={filled ? 0 : 1.5}
    >
      <path
        d="M12 17.27 15.15 19.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type StarRatingProps = {
  rating: number;
  max?: number;
  size?: number;
  filledColor?: string;
  emptyColor?: string;
  className?: string;
};

export function StarRating({
  rating,
  max = 5,
  size = 18,
  filledColor = "#e6a34a",
  emptyColor = "rgba(32,49,45,0.18)",
  className,
}: StarRatingProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className ?? ""}`} aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, index) => (
        <StarIcon
          key={index}
          filled={index < rating}
          size={size}
          color={index < rating ? filledColor : emptyColor}
        />
      ))}
    </div>
  );
}
