"use client";

import React, { useEffect } from "react";
import UpdatableField from "./UpdatableField";
import styles from "./Cell.module.scss";
import { CampaignHeaders, TemplateHeaders } from "@/lib/TableHeaders";
import { capitalize } from "@/utils/helpers";
import classnames from "classnames";

type CellType = {
  value: any;
  type: "template_event" | "campaign_event";
  id: string;
  label: string;
  isHeader: boolean;
};
const Cell = ({ value, type, id, label, isHeader }: CellType) => {
  const headers = type === "template_event" ? TemplateHeaders : CampaignHeaders;
  // Check if label is in TableHeaders
  let headerArray: string[] = [];
  headers.forEach((header: { value: string; label: string }) => {
    headerArray.push(header.value);
  });
  if (!headerArray.includes(label)) {
    return;
  }
  // ===================================

  const inputType = (() => {
    switch (label) {
      case "range":
        return "number";
      case "entity":
        return "select";
      case "unit":
        return "select";
      case "date":
        return "date";
      default:
        return "text";
    }
  })();

  const formattedValue = (() => {
    switch (label) {
      case "unit":
        return value ? capitalize(value.split("_").join(" ")) : "";
      default:
        return value;
    }
  })();

  return (
    <UpdatableField
      label={label}
      value={formattedValue}
      resourceType={type}
      resourceId={id}
      classNames={classnames(styles.cell_ctn, styles[label])}
      placeholder={label}
      type={inputType}
      isHeader={isHeader}
    />
  );
};

export default Cell;
