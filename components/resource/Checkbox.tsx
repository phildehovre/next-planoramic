import React from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import styles from "./Checkbox.module.scss";

const CheckboxWrapper = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <form>
    <div style={{ display: "flex", alignItems: "center" }}>
      <Checkbox.Root
        className={styles.CheckboxRoot}
        checked={checked}
        onCheckedChange={onChange}
        id="c1"
      >
        <Checkbox.Indicator className={styles.CheckboxIndicator}>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
    </div>
  </form>
);

export default CheckboxWrapper;
