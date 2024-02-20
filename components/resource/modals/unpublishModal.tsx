"use client";

import Modal from "@/components/shared/Modal";
import React from "react";

type ModalTypes = {
  onCancel: () => void;
  onSave: () => void;

  isLoading: boolean;
  displayModal: boolean;
  modalProps: {
    events: EventType[] | undefined;
    errors: any[];
    loading: boolean;
    successfulPosts: string[];
  };
};

const UnpublishModal: React.FC<ModalTypes> = ({
  modalProps: { events, errors, loading, successfulPosts },
  onCancel,
  onSave: onSave,
  displayModal,
}) => {
  return (
    <Modal
      onCancel={onCancel}
      onSave={onSave}
      display={displayModal}
      isLoading={loading}
      heading="Remove campaign from Google Calendar"
      description="The following events will be removed from Google calendar:"
    >
      <div className="">
        {events?.map((event) => {
          let isError = errors.find((error) => error.event.id === event.id);
          let isPublished =
            successfulPosts.includes(event.id) || event.published;
          return (
            <div
              key={event.id}
              className={`
          flex justify-between flex-row w-full p-2 text-sm my-1 bg-gray-100 rounded-md
          ${isError ? "bg-red-100" : ""}
          ${isPublished ? "bg-green-100" : ""}
          "
          `}
            >
              <div className="flex flex-col w-full">
                <h4 className="">{event.name}</h4>
                <p>{event.description}</p>
                <p>{event.date}</p>
              </div>
              <p className="flex w-full my-auto justify-end text-red-600">
                {isError && !loading ? isError.code : null}
              </p>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default UnpublishModal;
