import React, { MouseEventHandler } from "react";
import styles from "./Modal.module.scss";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckIcon, XIcon } from "lucide-react";

type ModalProps = {
  heading: string;
  description?: string;
  children: React.ReactNode;
  onSave?: () => void;
  submit?: React.ReactElement;
  onCancel: () => void;
  display: boolean;
  isLoading?: boolean;
};

const Modal = ({
  children,
  onSave,
  onCancel,
  display,
  submit,
  isLoading,
  heading,
  description,
}: ModalProps) => {
  if (!display) {
    return null;
  }

  return (
    <>
      <div className={styles.modal_overlay}>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>{heading}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={styles.modal_content}>{children}</div>
          </CardContent>
          <CardFooter className="flex w-full gap-2 my-5">
            {onSave && (
              <Button
                variant="default"
                className="w-full"
                onClick={onSave}
                disabled={isLoading}
              >
                <CheckIcon size={20} />
                Confirm
              </Button>
            )}
            {submit && submit}
            <Button variant="destructive" className="w-full" onClick={onCancel}>
              <XIcon size={20} />
              Close
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Modal;
