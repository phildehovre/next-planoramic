import React from "react";
import styles from "./Sidebar.module.scss";
import Link from "next/link";
// import { create } from "@app/actions/templateActions";

interface SidebarSectionProps {
  heading: string;
  items?: ResourceType[] | SidebarSettingsMenuItems[];
  type?: string;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  heading,
  items,
  type,
}) => {
  if (!items) return;
  return (
    <div className="">
      <h1 className="">{heading}</h1>
      {heading !== "settings" ? (
        <ul className={styles.sidebar_section_list}>
          {items.map((item) => (
            <Link
              href={`/dashboard/${type}/${item.id}`}
              className={styles.sidebar_section_item}
              // key={item.id}
              key={item.id || crypto.randomUUID()}
            >
              {item.name}
            </Link>
          ))}
        </ul>
      ) : (
        <ul className={styles.sidebar_section_list}>
          {items.map((item) => (
            <Link
              href={`/settings`}
              className={styles.sidebar_section_item}
              key={crypto.randomUUID()}
            >
              {item.name}
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SidebarSection;
