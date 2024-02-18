"use client";

import React from "react";
import Cell from "./Cell";
import styles from "./Row.module.scss";
import CheckboxDemo from "./Checkbox";

type RowType = {
  data: any | any[];
  isHeader: boolean;
  isSelected: boolean;
  onSelectAll?: () => void;
  onRowSelect?: () => void;
};

const Row = ({
  data,
  isHeader,
  isSelected,
  onSelectAll,
  onRowSelect,
}: RowType) => {
  const classnames = isHeader
    ? [styles.row_ctn, styles.headers]
    : [styles.row_ctn];

  const handleRowSelect = () => {
    if (isHeader) {
      onSelectAll ? onSelectAll() : null;
    } else {
      onRowSelect ? onRowSelect() : null;
    }
  };

  const renderCells = () => {
    if (!data) return;
    const keys = Object.keys(data);
    return keys.map((key) => {
      return (
        <Cell
          type={data.type}
          label={key}
          value={isHeader ? key : data[key]}
          key={crypto.randomUUID()}
          id={data.id}
          isHeader={isHeader}
        />
      );
    });
  };

  return (
    <div className={classnames.join(" ")}>
      <CheckboxDemo checked={isSelected} onChange={handleRowSelect} />
      {renderCells()}
    </div>
  );
};

export default Row;
