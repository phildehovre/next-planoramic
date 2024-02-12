"use server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { createEvent } from "./eventActions";
import { redirect } from "next/navigation";
import { calculateDateWithOffset } from "@/utils/helpers";

export const handlePublishCampaign = async (id: string) => {
  console.log(id);
};

export const createCampaign = async (
  userId: string,
  name: string,
  targetDate: any
) => {
  const ISOTargetDate = new Date(targetDate).toISOString();
  const campaign = await prisma.campaign.create({
    data: {
      name: name || "Untitled",
      description: "",
      clerk_id: userId,
      target_date: ISOTargetDate,
    },
  });

  if (campaign) {
    const event = await createEvent("campaign_event", campaign, userId);
  }
  if (campaign) {
  }

  revalidatePath("/");
  redirect(`/dashboard/campaign/${campaign.id}`);
};

export const updateTargetDate = async (id: string, targetDate: string) => {
  const ISOTargetDate = new Date(targetDate).toISOString();
  let isLoading = true;

  try {
    const campaignEvents = await prisma.event.findMany({
      where: {
        campaignId: id,
      },
    });

    for (let event of campaignEvents) {
      const updatedEvent = await prisma.event.update({
        where: {
          id: event.id,
        },
        data: {
          date: calculateDateWithOffset(
            ISOTargetDate,
            event.unit as string,
            event.range as number
          ),
        },
      });
    }

    const campaign = await prisma.campaign.update({
      where: {
        id: id,
      },
      data: {
        target_date: ISOTargetDate,
      },
    });

    // return campaign;
  } catch (error: any) {
    console.error("Error updating field:", error.message);
    throw error;
  } finally {
    isLoading = false;
  }

  revalidatePath("/");
  return isLoading;
};
