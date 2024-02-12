"use client";

import React, { useEffect, useRef } from "react";
import styles from "./Ellipsis.module.scss";
import { capitalize } from "@/utils/helpers";
import classnames from "classnames";
import { TriangleRightIcon } from "@radix-ui/react-icons";

const Ellipsis = ({
  options,
  Icon,
  active,
  disabled = true,
  onOptionClick,
}: DropdownOptionType) => {
  const [open, setOpen] = React.useState(false);
  const [submenuOpen, setSubmenuOpen] = React.useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };
  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div>
      <Icon
        onClick={() => setOpen(!open)}
        className={classnames(
          styles.ellipsis_btn,
          active ? styles.active : styles.inactive
        )}
        disabled={disabled}
      />
      {open && (
        <div ref={inputRef} className={styles.ellipsis_dropdown}>
          {options.map((option, index) => {
            return (
              <React.Fragment key={option.label}>
                <div
                  className={styles.ellipsis_dropdown_item}
                  onClick={() => onOptionClick(option.type)}
                  onMouseEnter={() => {
                    setSubmenuOpen(option.type);
                  }}
                  onMouseLeave={() => {
                    setSubmenuOpen("");
                  }}
                >
                  {capitalize(option.label)}
                </div>
                {option.submenu &&
                  submenuOpen === option.type &&
                  option.submenu?.values?.map((value: any) => {
                    return (
                      <div className={styles.submenu} key={value}>
                        <div className={styles.submenu_item}>{value}</div>
                      </div>
                    );
                  })}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Ellipsis;
