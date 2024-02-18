import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import styles from "./Dropdown.module.scss";
import { capitalize } from "@/utils/helpers";
import { DropdownMenuSeparator } from "@radix-ui/themes";
import { cn } from "@/lib/utils";

const DropdownMenuDemo = ({
  options,
  onOptionClick,
  Icon,
  label,
}: {
  options: OptionType[];
  onOptionClick: (type: string, phase?: number) => void;
  Icon: any;
  label?: string;
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className={styles.IconButton} aria-label="Customize options">
          <Icon />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={styles.DropdownMenuContent}
          sideOffset={5}
        >
          <DropdownMenu.Label>{label}</DropdownMenu.Label>
          <DropdownMenuSeparator />
          {options.map((option: any, i: number) => {
            if (!option.submenu) {
              return (
                <DropdownMenu.Item
                  className={cn(
                    styles.DropdownMenuItem,
                    `${i == 0 ? "mt-2 border-t-slate-500" : ""}`
                  )}
                  key={crypto.randomUUID()}
                  onSelect={() => onOptionClick(option.type)}
                >
                  {capitalize(option.label)}
                  {/* <div className={styles.RightSlot}>⌘+T</div> */}
                </DropdownMenu.Item>
              );
            }
            return (
              <DropdownMenu.Sub key={crypto.randomUUID()}>
                <DropdownMenu.SubTrigger
                  className={styles.DropdownMenuSubTrigger}
                >
                  {option.label}
                  <div className={styles.RightSlot}>
                    <ChevronRightIcon />
                  </div>
                </DropdownMenu.SubTrigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.SubContent
                    className={styles.DropdownMenuSubContent}
                    sideOffset={2}
                    alignOffset={-5}
                  >
                    {option.submenu.values.map((value: any) => {
                      return (
                        <DropdownMenu.Item
                          className={styles.DropdownMenuItem}
                          key={crypto.randomUUID()}
                          onSelect={() => onOptionClick(option.type, value)}
                        >
                          Phase {value}
                          {/* <div className={styles.RightSlot}>⌘+S</div> */}
                        </DropdownMenu.Item>
                      );
                    })}
                    <DropdownMenu.Separator
                      className={styles.DropdownMenuSeparator}
                    />
                    <DropdownMenu.Item
                      className={styles.DropdownMenuItem}
                      key={crypto.randomUUID()}
                      onSelect={() => onOptionClick(option.type)}
                    >
                      New phase...
                      {/* <div className={styles.RightSlot}>⌘+S</div> */}
                    </DropdownMenu.Item>
                  </DropdownMenu.SubContent>
                </DropdownMenu.Portal>
              </DropdownMenu.Sub>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default DropdownMenuDemo;
