import React from "react";
import Drawer from "rc-drawer";

type DrawerProps = {
  children: React.ReactNode;
  placement: "left" | "right" | "top" | "bottom";
  open: boolean;
  onClose: () => void;
  width?: string | number;
  height?: string | number;
};

const DrawerWrapper = (props: DrawerProps) => {
  const { children, placement, open, onClose, width, height } = props;

  return (
    <Drawer
      placement={placement}
      open={open}
      onClose={onClose}
      width={width}
      height={height}
    >
      {children}
    </Drawer>
  );
};

export default DrawerWrapper;
