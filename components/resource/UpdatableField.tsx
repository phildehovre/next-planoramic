"use client";

import React, { startTransition, useEffect, useRef } from "react";
import "./UpdatableField.scss";
import { updateField } from "@/app/actions/actions";
import Form from "./Form";
import { useOptimistic } from "react";
import Select from "./Select";
import { entityOptions, unitOptions } from "@/constants/SelectOptions";
import { capitalize } from "@/utils/helpers";
import { ArrowDownIcon, TriangleDownIcon } from "@radix-ui/react-icons";
import classnames from "classnames";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";

function Field(props: {
  label: string;
  value: any;
  resourceType: "template_event" | "campaign_event" | "campaign" | "template";
  weight?: string;
  resourceId: string;
  type?: string;
  inputType?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  placeholder?: string;
  classNames?: string;
  isHeader?: boolean;
}) {
  const {
    label,
    value,
    type,
    resourceId,
    inputType,
    placeholder,
    classNames,
    resourceType,
    isHeader,
  } = props;

  const [isEditing, setIsEditing] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);
  const [initialValue, setInitialtValue] = React.useState(value);

  const [optimisticValue, setOptimisticValue] = useOptimistic(
    value,
    (state, newValue) => {
      return [newValue];
    }
  );

  const conditionalClassnames =
    isEditing && classNames
      ? [classNames, "active"]
      : classNames
      ? [classNames, "passive"]
      : ["passive"];

  useEffect(() => {
    setInitialtValue((prev: any) => (value !== prev ? value : prev));
  }, [value]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      handleOptimisticUpdate();
      setIsEditing(false);
      setInputValue(initialValue);
    }
  };
  const handleCellClick = () => {
    if (!isHeader) {
      setIsEditing(true);
    }
  };

  const handleOptimisticUpdate = async () => {
    if (inputValue !== value) {
      startTransition(() => {
        setOptimisticValue(inputValue);
      });

      await updateField(resourceType, resourceId, label, inputValue);
    }
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, inputValue]);

  // This ensure only Select fields
  // are updated when the input changes
  useEffect(() => {
    if (type === "select" && inputValue !== value) {
      handleOptimisticUpdate();
    }
  }, [inputValue, type]);

  const renderInput = () => {
    if (type === "checkbox") {
      return (
        <Checkbox
          onChange={() => {}}
          value={inputValue}
          autoFocus
          className={cn("cell", inputType)}
        />
      );
    }
    if (isEditing) {
      return (
        <Form
          action={() => {
            handleOptimisticUpdate();
          }}
          className={classnames(conditionalClassnames)}
        >
          {type === "select" && (
            <Select
              label={label}
              isOpen={isEditing}
              options={label === "entity" ? entityOptions : unitOptions}
              value={optimisticValue || value}
              onOptionClick={(e: any) => {
                setInputValue(e);
                handleOptimisticUpdate();
              }}
              setIsEditing={setIsEditing}
              handleCellClick={() => {
                setIsEditing(true);
              }}
            />
          )}
          {type !== "select" && (
            <input
              type={type}
              onChange={(e) =>
                setInputValue(
                  type === "number"
                    ? parseFloat(e.target.value)
                    : e.target.value
                )
              }
              value={inputValue}
              ref={inputRef}
              placeholder={value}
              autoFocus
            />
          )}
        </Form>
      );
    }
    return (
      <div
        onClick={handleCellClick}
        className={conditionalClassnames?.join(" ")}
        aria-placeholder={placeholder}
      >
        {label === "phase_number" && `Phase `}

        {capitalize(optimisticValue)}
        {!optimisticValue && !value && placeholder && type !== "number" && (
          <span className="placeholder italic">{placeholder}...</span>
        )}
        {type === "select" && !isHeader && <TriangleDownIcon />}
      </div>
    );
  };
  return <>{renderInput()}</>;
}

export default Field;
