import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        neutral: "bg-muted text-muted-foreground",
        brand: "bg-lavender-purple-100 text-lavender-purple-700",
        sale: "bg-deep-pink-100 text-deep-pink-700",
        success: "bg-aquamarine-100 text-aquamarine-800",
        info: "bg-deep-sky-blue-100 text-deep-sky-blue-800",
        sold: "bg-foreground text-background",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
