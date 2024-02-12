"use client";

import classnames from "classnames";
import React from "react";
import styles from "./AddButton.module.scss";
import { cn } from "@/lib/utils";

type AddButtonTypes = {
  buttonText?: string;
  onClick?: () => void;
  Icon?: React.ReactNode;
  classNames?: string;
};

const AddButton = ({
  buttonText,
  onClick,
  Icon,
  classNames,
}: AddButtonTypes) => {
  const [slideIn, setSlideIn] = React.useState(false);

  const handleMouseIn = () => {
    setSlideIn(true);
  };
  const handleMouseOut = () => {
    setSlideIn(false);
  };

  return (
    <button
      onClick={onClick}
      className={cn(styles.add_btn, classNames)}
      onMouseEnter={handleMouseIn}
      onMouseLeave={handleMouseOut}
      title={buttonText}
    >
      {Icon}
    </button>
  );
};

export default AddButton;
