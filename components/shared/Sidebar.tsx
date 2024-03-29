"use client";

import Image from "next/image";
import React, { useState } from "react";
import Modal from "./Modal";
import { createTemplate } from "@/app/actions/templateActions";
import SidebarSection from "@/components/shared/SidebarSection";
import Form from "@/components/ui/Form";
import { createCampaign } from "@/app/actions/campaignActions";
import { ExitIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { currentUser, useAuth, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "@/components/ui/use-toast";

const Sidebar = ({ data }: { data: SidebarTypes[] }) => {
  const [isShowing, setIsShowing] = useState(true);
  const [isExtended, setIsExtended] = useState("");
  const [displayModal, setDisplayModal] = useState("");
  const [formtargetDate, setFormTargetDate] = useState("");
  const [resourceCreationLoading, setResourceCreationLoading] = useState(false);

  const { isLoaded, isSignedIn, user } = useUser();
  // console.log(user?.primaryEmailAddress);
  const handleHeadingClick = (heading: string) => {
    setIsExtended((prev) => (prev === heading ? "" : heading));
  };

  const handleCreateResource = async (formData: FormData) => {
    setResourceCreationLoading(true);
    if (displayModal === "template") {
      const name = formData.get("name") as string;
      if (user) {
        try {
          const res = await createTemplate(name, user.id, 1).then((res) => {
            console.log(res);
          });
        } catch (err) {
          console.log(err);
        } finally {
          setResourceCreationLoading(false);
          setDisplayModal("");
        }
      }
    }
    if (displayModal === "campaign") {
      const name = formData.get("name") as string;
      const targetDate = formData.get("targetDate");
      if (user) {
        try {
          const res = await createCampaign(user.id, name, targetDate).then(
            (res) => {
              setResourceCreationLoading(false);
              setDisplayModal("");
              console.log(res);
            }
          );
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  return (
    <div
      className={`flex justify-start flex-col ${
        isShowing ? "" : ""
      } relative p-4 gap-2`}
    >
      <Button
        onClick={() => setIsShowing((prev) => !prev)}
        className=" p-2 w-8 bg-slate-400 flex items-center justify-start rounded-md text-white hover:bg-slate-500 transition-all duration-200 ease-in-out hover:shadow-md"
      >
        <ExitIcon />
      </Button>
      <aside
        // open={isShowing}
        // placement="left"
        // onClose={() => setIsShowing(false)}
        role="complementary"
        className={cn(`h-full flex flex-col gap-4 ${!isShowing && "hidden"}`)}
      >
        {data.map((category, index) => {
          return (
            <div key={category.heading + index}>
              <SidebarSection
                heading={category.heading}
                items={category.items}
                type={category.type}
              />
              {category.type !== "settings" && (
                <Button
                  variant={category.type === "template" ? "outline" : "default"}
                  color={category.type === "template" ? "blue" : "cyan"}
                  onClick={() => setDisplayModal(category.type)}
                  style={{ cursor: "pointer" }}
                  className={`flex items-center gap-2 w-[150px]
                   ${
                     category.type === "template" &&
                     `bg-cyan-500 hover:bg-cyan-600 text-white p-2`
                   }
                   ${
                     category.type === "campaign" &&
                     `bg-violet-500 hover:bg-violet-600 text-white p-2 border-violet-700`
                   }
                   
                   rounded-md transition-all duration-200 ease-in-out hover:shadow-md`}
                >
                  <PlusCircledIcon />
                  New {category.type}
                </Button>
              )}
            </div>
          );
        })}
        <div>
          <Image
            src={user?.imageUrl || ""}
            alt="user profile picture"
            width={30}
            height={30}
          />
          {/* <p>{user?.primaryEmailAddress}</p> */}
        </div>
      </aside>
      <Form action={handleCreateResource}>
        <Modal
          submit={
            <Button variant="default" type="submit">
              Create
            </Button>
          }
          onCancel={() => setDisplayModal("")}
          display={displayModal === "campaign" || displayModal === "template"}
          isLoading={resourceCreationLoading}
          heading={`Create ${displayModal}`}
          // description="Create a brand new "
        >
          <Label htmlFor="name">Name</Label>
          <Input type="text" name="name" id="name" />
          {displayModal === "campaign" && (
            <>
              <Label htmlFor="targetDate">Campaign Deadline: </Label>
              <Input
                type="date"
                name="targetDate"
                id="targetDate"
                onChange={(e) => setFormTargetDate(e.target.value)}
              />
            </>
          )}
        </Modal>
      </Form>
    </div>
  );
};

export default Sidebar;
