"use client";

import { useRef } from "react";
import { ReactNode } from "react";

interface FormProps {
  children: ReactNode;
  action: (data: any) => void;
  className?: string;
  onSubmit?: () => void;
}

const Form = ({ children, action, className, onSubmit }: FormProps) => {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form
      className={className}
      onSubmit={onSubmit}
      ref={ref}
      action={async (formData: any) => {
        await action(formData);
        ref.current?.reset();
      }}
    >
      {children}
    </form>
  );
};

export default Form;
