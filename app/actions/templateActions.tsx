"use server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { createEvent } from "./eventActions";
import { redirect } from "next/navigation";
import { calculateDateWithOffset } from "@/utils/helpers";

export async function createTemplate(
  name: string,
  userId: string,
  phaseNumber: number
) {
  const template = await prisma.template.create({
    data: {
      name: name || "Untitled",
      description: "",
      clerk_id: userId,
    },
  });

  if (template) {
    const event = await createEvent("template", template, userId, phaseNumber);
  }

  revalidatePath("/");
  redirect(`/dashboard/template/${template.id}`);
}

export async function edit(formData: FormData) {
  const input = formData.get("newTitle") as string;
  const inputId = formData.get("inputId") as string;

  await prisma.template.update({
    where: {
      id: inputId,
    },
    data: {
      //   title: input,
    },
  });

  revalidatePath("/");
}
export async function update(formData: FormData, id: string) {
  for (let key in formData) {
    const input = formData.get(key) as string;

    await prisma.template.update({
      where: {
        id: id,
      },
      data: {
        [key]: input,
      },
    });
  }

  revalidatePath("/");
}

export const updateField = async (id: any, key: any, val: any) => {
  try {
    const updatedResource = await prisma.template.update({
      where: {
        id: id,
      },
      data: {
        [key]: val,
      },
    });

    revalidatePath("/");
    // Handle success, if needed
    // console.log("Update successful:", updatedResource);
  } catch (error: any) {
    // Handle errors here
    console.error("Error updating field:", error.message);
    // Optionally, rethrow the error if you want to propagate it further
    throw error;
  }
};

export const publishTemplate = async (
  userId: string,
  name: string,
  targetDate: any,
  events: EventType[]
) => {
  const ISOTargetDate = new Date(targetDate).toISOString();
  console.log(ISOTargetDate);

  try {
    const campaign = await prisma.campaign.create({
      data: {
        name: name || "Untitled",
        description: "",
        clerk_id: userId,
        target_date: ISOTargetDate,
      },
    });
    if (campaign) {
      const formattedEvents = events.map((event) => {
        const { id, ...rest } = event;
        return {
          ...rest,
          campaignId: campaign.id,
          type: "campaign_event",
          date: calculateDateWithOffset(targetDate, event.unit, event.range),
        };
      });
      const res = await prisma.event.createMany({
        data: formattedEvents as any,
      });

      return campaign;
    }
  } catch (err) {
    console.log(err);
  } finally {
    revalidatePath("/");
  }
};
