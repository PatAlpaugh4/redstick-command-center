"use client";

import { cn, getInitials } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, size = "md", ...props }, ref) => {
    const sizes = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base",
      xl: "w-16 h-16 text-lg",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full overflow-hidden bg-surface-elevated border border-border",
          sizes[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-medium text-text-secondary">
            {getInitials(alt)}
          </span>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar };
