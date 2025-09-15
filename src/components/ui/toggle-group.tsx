import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleGroupVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 dark:data-[state=on]:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground",
        ghost:
          "hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground dark:hover:bg-accent/50 dark:data-[state=on]:bg-accent/50",
        blackWhite:
          "border bg-background shadow-xs hover:bg-gray-100 hover:text-gray-900 data-[state=on]:bg-black data-[state=on]:text-white data-[state=on]:border-black dark:bg-input/30 dark:border-input dark:hover:bg-input/50 dark:data-[state=on]:bg-white dark:data-[state=on]:text-black dark:data-[state=on]:border-white",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleGroupVariants>
>(({ className, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    {children}
  </ToggleGroupPrimitive.Root>
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleGroupVariants>
>(({ className, children, variant, size, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(toggleGroupVariants({ variant, size }), className)}
    {...props}
  >
    {children}
  </ToggleGroupPrimitive.Item>
));

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

// eslint-disable-next-line react-refresh/only-export-components
export { ToggleGroup, ToggleGroupItem, toggleGroupVariants };
