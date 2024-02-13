import React from "react";
import styles from "./Sidebar.module.scss";
import Link from "next/link";
// import { create } from "@app/actions/templateActions";
import { Icon } from "@iconify/react";

interface SidebarSectionProps {
  heading: string;
  items?: ResourceType[] | SidebarSettingsMenuItems[];
  type?: string;
}

const navIcons: {
  type: string;
  icon: React.ReactElement;
  items?: any[];
}[] = [
  {
    type: "template",
    icon: <Icon icon="lucide:book-dashed" />,
  },
  {
    type: "campaign",
    icon: <Icon icon="lucide:calendar-days" />,
  },
  {
    type: "settings",
    icon: <Icon icon="lucide:settings" />,
    items: [
      {
        name: "Settings",
        icon: <Icon icon="lucide:user-cog" />,
      },
      {
        name: "Profile",
        icon: <Icon icon="lucide:user" />,
      },
      {
        name: "Logout",
        icon: <Icon icon="lucide:logout" />,
      },
    ],
  },
];

console.log(navIcons[2].items);

const SidebarSection: React.FC<SidebarSectionProps> = ({
  heading,
  items,
  type,
}) => {
  if (!items) return;
  return (
    <div className="">
      <h1 className="flex items-center justify-start gap-2 text-xl">
        {navIcons.find((icon) => icon.type === type)?.icon}
        {heading}
      </h1>
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
          {items.map((item) => {
            console.log(
              navIcons[2]?.items?.find((icon) => icon.name === item.name)?.icon
            );
            return (
              <Link
                href={item.pathname}
                className={styles.sidebar_section_item}
                key={crypto.randomUUID()}
              >
                {
                  navIcons[2]?.items?.find((icon) => icon.name === item.name)
                    ?.icon
                }
                {item.name}
              </Link>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SidebarSection;
