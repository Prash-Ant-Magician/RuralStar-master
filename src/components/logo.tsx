import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Logo({ className, ...props }: HTMLAttributes<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 200 220"
      className={cn("h-8 w-8 text-primary", className)}
      {...props}
    >
      <defs>
        <clipPath id="hexagon-clip">
          <path d="M100 0L200 55V165L100 220L0 165V55Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#hexagon-clip)">
        <polygon
          points="100,0 200,55 200,165 100,220 0,165 0,55"
          className="fill-current"
        />
      </g>
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="fill-primary-foreground font-bold text-[80px]"
        dy=".1em"
      >
        RS
      </text>
    </svg>
  );
}
