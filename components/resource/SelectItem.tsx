"use client";

import React, { forwardRef } from "react";
import * as Select from "@radix-ui/react-select";
import { CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

type SelectItemProps = React.ComponentProps<typeof Select.Item>;

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className={cn("SelectItem", className)}
        style={{ backgroundColor: props.color }}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="SelectItemIndicator">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);

SelectItem.displayName = "SelectItem";
export default SelectItem;
