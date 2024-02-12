import React, { useEffect, useRef } from "react";
import * as Select from "@radix-ui/react-select";
import classnames from "classnames";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import styles from "./Select.module.scss";
import SelectItem from "./SelectItem";
import { ClimbingBoxLoader } from "react-spinners";

const useOnClickOutside = (
  ref: React.RefObject<any>,
  handler: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

const CustomSelect = (props: {
  label: string;
  options: { label: string; value: string; color: string }[];
  register?: any;
  onOptionClick: (value: string) => void;
  setIsEditing: (bool: boolean) => void;
  value: string;
  handleCellClick: () => void;
  isOpen: boolean;
}) => {
  const {
    label,
    isOpen,
    options,
    register,
    onOptionClick,
    setIsEditing,
    value,
    handleCellClick,
  } = props;

  const [selectedValue, setSelectedValue] = React.useState(value);
  const selectRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(selectRef, () => {
    setIsEditing(false);
  });

  return (
    <Select.Root
      value={value}
      open={isOpen}
      onValueChange={(e: any) => {
        console.log(e);
        setSelectedValue(e);
        onOptionClick(e);
        setIsEditing(false);
      }}
      onOpenChange={(open) => {
        handleCellClick();
        setIsEditing(open);
      }}
    >
      <Select.Trigger
        className={classnames("SelectTrigger", styles.select_trigger)}
        aria-label={label}
      >
        <Select.Value asChild={true}>
          <span>{value}</span>
        </Select.Value>
        {/* <Select.Icon className="SelectIcon">
          <ChevronDownIcon />
        </Select.Icon> */}
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          className={classnames("SelectContent", styles.select_content)}
        >
          <Select.ScrollUpButton className="SelectScrollButton">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="SelectViewport">
            <Select.Group>
              {/* <Select.Label
                className={classnames("SelectLabel", styles.select_)}
              >
                {label}
              </Select.Label> */}
              {options.map(
                (
                  option: { value: string; label: string; color: string },
                  index
                ) => {
                  return (
                    <SelectItem
                      key={index}
                      value={option.value}
                      className={classnames(
                        "SelectItem",
                        styles.select_item,
                        option.value === selectedValue && "SelectItem--selected"
                      )}
                      color={option.color}
                    >
                      {option.label}
                    </SelectItem>
                  );
                }
              )}
            </Select.Group>
            <Select.Separator className="SelectSeparator" />
          </Select.Viewport>
          <Select.ScrollDownButton className="SelectScrollButton">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default CustomSelect;
