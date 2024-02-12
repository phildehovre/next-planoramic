"use server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import dayjs from "dayjs";
import { redirect } from "next/navigation";

export const updateField = async (
  type: string,
  id: any,
  key: any,
  val: any,
  path?: string | undefined
) => {
  console.log(type, id, key, val);

  const isPath = path || "/dashboard";

  try {
    let updatedResource;

    const conditionnalDateVal = key === "date" ? dayjs(val).toISOString() : val;

    const queryParams = {
      where: {
        id: id,
      },
      data: {
        [key]: conditionnalDateVal,
      },
    };

    switch (type) {
      case "template":
        updatedResource = await prisma.template.update(queryParams);
        break;
      case "campaign":
        updatedResource = await prisma.campaign.update(queryParams);
        break;
      case "template_event":
        updatedResource = await prisma.event.update(queryParams);
        break;
      case "campaign_event":
        updatedResource = await prisma.event.update(queryParams);
        break;
      default:
        break;
    }

    revalidatePath(isPath);
    // Handle success, if needed
    // console.log("Update successful:", updatedResource);
  } catch (error: any) {
    // Handle errors here
    console.error("Error updating field:", error.message);
    // Optionally, rethrow the error if you want to propagate it further
    throw error;
  }
};

export const handleDuplicatePhase = async (phase: number | undefined) => {
  console.log(phase);
};

export const handleDeletePhase = async (phase: number | undefined) => {
  console.log(phase);
};

export const handlePublishPhase = async (phase: number | undefined) => {
  console.log(phase);
};

export const handleDeleteResource = async (type: string, id: string) => {
  try {
    await prisma.event
      .deleteMany({
        where: {
          [`${type}Id`]: id,
        },
      })
      .then(async () => {
        if (type === "campaign") {
          await prisma.campaign.delete({
            where: {
              id: id,
            },
          });
        }
        if (type === "template") {
          await prisma.template.delete({
            where: {
              id: id,
            },
          });
        }
      });

    revalidatePath("/");
    redirect("/dashboard");
    // Handle success, if needed
    // console.log("Update successful:", updatedResource);
  } catch (error: any) {
    // Handle errors here
    console.error("Error updating field:", error.message);
    // Optionally, rethrow the error if you want to propagate it further
    throw error;
  }
};
