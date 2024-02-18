"use client";

import classnames from "classnames";
import React from "react";
import styles from "./AddButton.module.scss";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

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
    <Button
      onClick={onClick}
      className={cn("w-[150px] mx-auto")}
      variant="outline"
      onMouseEnter={handleMouseIn}
      onMouseLeave={handleMouseOut}
      title={buttonText}
    >
      {Icon}
    </Button>
  );
};

export default AddButton;
