"use client";
import React, { useEffect, useState } from "react";
import Row from "./Row";
import styles from "./ResourceTable.module.scss";
import {
  DotsHorizontalIcon,
  DotsVerticalIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import {
  copyManyEventsToPhase,
  createEvent,
  deleteManyEvents,
} from "@/app/actions/eventActions";
import classnames from "classnames";
import DropdownMenuDemo from "./Dropdown";
import AddButton from "./AddButton";
import { CalendarDaysIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ResourceTableTypes = {
  events: EventType[];
  resource: ResourceType;
  user: User;
  type: string;
};

type PhaseType = {
  phaseNumber: number | undefined;
  rows: EventType[];
  onSelectAll: () => void;
  onRowSelect: (id: string) => void;
  selectedRows: string[];
  selectedEventsOptions: OptionType[];
  phaseOptions: OptionType[];
};

const ResourceTable = ({
  events,
  resource,
  user,
  type,
}: ResourceTableTypes) => {
  const [phases, setPhases] = useState<(number | undefined)[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  useEffect(() => {
    const uniquePhases = Array.from(
      new Set(events.map((event) => event.phase_number).sort())
    );
    setPhases(uniquePhases);
  }, [events]);

  const handleSelectAllPhaseRows = (phaseNumber: number) => {
    const phaseRows = events.filter(
      (event) => event.phase_number === phaseNumber
    );
    const phaseIds = phaseRows.map((row) => row.id);

    const allSelected = phaseIds.every((id) => selectedRows.includes(id));

    if (allSelected) {
      setSelectedRows(selectedRows.filter((id) => !phaseIds.includes(id)));
    } else {
      setSelectedRows((prev) => [...prev, ...phaseIds]);
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelectedRows = new Set(selectedRows);

    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id);
    } else {
      newSelectedRows.add(id);
    }

    setSelectedRows(Array.from(newSelectedRows));
  };

  const selectedEventsOptions = [
    {
      label: "move to",
      type: "move",
      submenu: {
        label: "phase(s)",
        type: "phase",
        values: [...phases],
      },
    },
    {
      label: "copy to",
      type: "copy",
      submenu: {
        label: "phase(s)",
        type: "phase",
        values: [...phases],
      },
    },
    {
      label: "delete",
      type: "delete",
    },
  ];

  const phaseOptions = [
    {
      label: "duplicate",
      type: "duplicate",
    },
    {
      label: "delete",
      type: "delete",
    },
    {
      label: "Push to Calendar",
      type: "publish",
    },
  ];

  return (
    <div className={cn(styles.table_ctn, "gap-2")}>
      {phases.map((phaseNumber: number | undefined) => {
        return (
          <React.Fragment key={crypto.randomUUID()}>
            <Phase
              phaseNumber={phaseNumber}
              rows={events.filter(
                (event) => event.phase_number === phaseNumber
              )}
              onSelectAll={() =>
                handleSelectAllPhaseRows(phaseNumber as number)
              }
              onRowSelect={handleSelectRow}
              selectedRows={selectedRows}
              selectedEventsOptions={selectedEventsOptions}
              phaseOptions={phaseOptions}
            />
            <AddButton
              buttonText="Add Event"
              onClick={() =>
                createEvent(type, resource, user.id, Number(phaseNumber))
              }
              Icon={<CalendarDaysIcon />}
              classNames={cn("w-[125px] bg-gray-100")}
            />
          </React.Fragment>
        );
      })}
      <AddButton
        buttonText="Add Phase"
        onClick={() => createEvent(type, resource, user.id, phases.length + 1)}
        Icon={<PlusIcon />}
        classNames={classnames("phase")}
      />
    </div>
  );
};

export default ResourceTable;

const Phase = ({
  phaseNumber,
  rows,
  onSelectAll,
  onRowSelect,
  selectedRows,
  selectedEventsOptions,
  phaseOptions,
}: PhaseType) => {
  const path = window.location.pathname;
  const handlePhaseOptionClick = (type: string) => {
    if (type === "duplicate") {
      console.log("duplicate");
    }
  };

  const handleSelectedOptionClick = (type: any, phase: any) => {
    if (type === "delete") {
      deleteManyEvents(selectedRows);
    }
    if (type === "copy") {
      copyManyEventsToPhase(selectedRows, phase);
    }
    if (type === "move") {
      copyManyEventsToPhase(selectedRows, phase).then(() => {
        deleteManyEvents(selectedRows);
      });
    }
  };

  return (
    <div>
      <span
        style={{ display: "flex", gap: "1em", alignItems: "center" }}
        className="flex gap-2 items-center w-full justify-start rounded px-4 py-2 bg-gray-100 border-b-2 border-gray-200"
      >
        <h1>Phase {phaseNumber}</h1>
        <DropdownMenuDemo
          Icon={DotsHorizontalIcon}
          options={phaseOptions}
          onOptionClick={handlePhaseOptionClick}
          label="Phase options"
          title="Phase manipulation options"
        />
        <DropdownMenuDemo
          Icon={DotsVerticalIcon}
          options={selectedEventsOptions}
          onOptionClick={handleSelectedOptionClick}
          label="Events options"
          disabled={selectedRows.length === 0}
          title={
            selectedRows.length === 0
              ? "No events selected for manipulation"
              : "Selected events manipulation options"
          }
        />
      </span>
      <Row
        data={rows[0]}
        isHeader={true}
        onSelectAll={() => onSelectAll()}
        isSelected={rows
          .map((row) => row.id)
          .every((id) => selectedRows.includes(id))}
      />
      {rows?.map((row: EventType) => {
        return (
          <Row
            key={row.id}
            data={row}
            isHeader={false}
            isSelected={selectedRows.includes(row.id)}
            onRowSelect={() => onRowSelect(row.id)}
          />
        );
      })}
    </div>
  );
};
