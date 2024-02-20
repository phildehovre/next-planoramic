"use client";

import React, { useEffect } from "react";
import UpdatableField from "./UpdatableField";
import { handleDeleteResource } from "@/app/actions/actions";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import Dropdown from "./Dropdown";
import styles from "./ResourceHeader.module.scss";
import { publishTemplate } from "@/app/actions/templateActions";
import Form from "./Form";
import Modal from "@/components/shared/Modal";
import { redirect } from "next/navigation";
import { dayjsFormat } from "@/utils/helpers";
import TargetDate from "./TargetDate";
import classNames from "classnames";
import { useUser } from "@clerk/nextjs";
import usePostManyEventsToGoogle from "@/hooks/calendar";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import UnpublishModal from "./modals/unpublishModal";
import { deleteManyCalendarEvents } from "@/app/actions/calendar";
import { Campaign } from "@prisma/client";

type ResourceHeaderTypes = {
  resourceId: string;
  type: "template" | "campaign";
  resource: CampaignType | TemplateType | EventType;
  events?: EventType[];
  token: string;
};

const ResourceHeader = ({
  resourceId,
  type,
  resource,
  events,
  token,
}: ResourceHeaderTypes) => {
  const [displayModal, setDisplayModal] = React.useState("");

  const { user } = useUser();
  const {
    postManyEventsToGoogle,
    loading,
    errors,
    successfulPosts,
    updateManyEventsToGoogle,
  } = usePostManyEventsToGoogle(
    type === "campaign" ? (resource as CampaignType) : null
  );

  const campaignOptions = [
    {
      label: "Publish to Calendar",
      type: "publish_campaign",
    },
    {
      label: "Unpublish [DEV FEATURE]",
      type: "unpublish_campaign",
    },
    {
      label: "Delete campaign",
      type: "delete",
    },
  ];
  const templateOptions = [
    {
      label: "Publish as campaign",
      type: "publish_template",
    },
    {
      label: "Delete template",
      type: "delete",
    },
  ];
  const options = type === "campaign" ? campaignOptions : templateOptions;

  const handleResourceOptionsClick = (operation: string) => {
    if (operation === "delete")
      handleDeleteResource(type, resourceId).then((res) => {});
    if (operation === "publish_template") {
      setDisplayModal("publish_template");
    }
    if (operation === "publish_campaign") {
      setDisplayModal("publish_campaign");
    }
    if (operation === "unpublish_campaign") {
      setDisplayModal("unpublish_campaign");
    }
  };

  const handlePublishTemplate = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const targetDate = formData.get("targetDate");
    const res = await publishTemplate(
      resource.clerk_id,
      name,
      targetDate,
      events as EventType[]
    ).then((res: any) => {
      redirect(`/dashboard/campaign/${res.id}`);
    });
    setDisplayModal("");
  };

  const handlePublishCampaign = async () => {
    if (!!events && !!user?.id) {
      if ((resource as CampaignType).published) {
        updateManyEventsToGoogle(events, user?.id, ["status", "confirmed"]);
      } else {
        postManyEventsToGoogle(events, user?.id).then((res) => {});
      }
    }
  };
  return (
    <>
      <div className={styles.resource_header_ctn}>
        <div className={styles.header_column}>
          <span className={styles.row}>
            <UpdatableField
              label="name"
              value={resource?.name as string}
              resourceType={type}
              resourceId={resourceId}
              classNames={classNames(styles.heading)}
            />
            <Dropdown
              options={options}
              Icon={DotsHorizontalIcon}
              onOptionClick={handleResourceOptionsClick}
            />
          </span>
        </div>
        <div className={styles.header_column}>
          <TargetDate
            campaignId={resourceId}
            display={type === "campaign"}
            value={dayjsFormat((resource as CampaignType)?.target_date)}
            classNames={classNames()}
          />
        </div>
      </div>
      <UpdatableField
        label="description"
        value={resource?.description as string}
        resourceType={type}
        resourceId={resourceId}
        weight="regular"
        classNames={styles.resource_description}
        placeholder={`${type} description`}
      />
      <Form action={handlePublishTemplate}>
        <Modal
          submit={
            <Button
              variant="outline"
              className="w-full bg-slate-600  text-white"
              type="submit"
            >
              Create
            </Button>
          }
          onCancel={() => setDisplayModal("")}
          display={displayModal === "publish_template"}
          heading="Publish template as campaign"
          description="Create a new campaign from this template."
        >
          <Label htmlFor="name">Name</Label>
          <Input type="text" name="name" id="name" />
          <Label htmlFor="targetDate">Campaign Deadline: </Label>
          <Input type="date" name="targetDate" id="targetDate" />
        </Modal>
      </Form>
      <Modal
        onCancel={() => setDisplayModal("")}
        onSave={handlePublishCampaign}
        display={displayModal === "publish_campaign"}
        isLoading={loading}
        heading="Publish campaign to Google Calendar"
        description="The following events will be pushed to Google calendar:"
      >
        <div className="">
          {events?.map((event) => {
            let isError = errors.find((error) => error.event.id === event.id);
            return (
              <div
                key={event.id}
                className={`
                flex justify-between flex-row w-full p-2 text-sm my-1 bg-gray-100 rounded-md
                ${isError ? "bg-red-100" : "bg-green-100"}
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
      <UnpublishModal
        modalProps={{ events, loading, errors }}
        onCancel={() => setDisplayModal("")}
        onSave={() => deleteManyCalendarEvents(events, token)}
        displayModal={displayModal === "unpublish_campaign"}
        isLoading={loading}
      />
    </>
  );
};

export default ResourceHeader;
