import type { ElementType, ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  size?: "default" | "narrow";
};

const sizeClassName = {
  default: "container mx-auto w-full px-4 sm:px-6 lg:px-8",
  narrow: "mx-auto w-full max-w-md px-4 sm:px-6",
} as const;

export function Container({
  children,
  className = "",
  as: Tag = "div",
  size = "default",
}: ContainerProps) {
  return (
    <Tag className={`${sizeClassName[size]} ${className}`.trim()}>{children}</Tag>
  );
}
