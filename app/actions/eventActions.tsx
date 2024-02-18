"use server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";

export async function createEvent(
  type: string,
  resource: ResourceType | TemplateType | CampaignType,
  userId: string,
  phaseNumber?: number
) {
  const { templateId, campaignId } = resource as any;

  const resourceIds =
    type === "template"
      ? { templateId: resource.id, campaignId: null }
      : { templateId, campaignId: resource.id };

  const event = await prisma.event.create({
    data: {
      ...resourceIds,
      name: "",
      description: "",
      clerk_id: userId,
      type: `${type}_event`,
      entity: "",
      range: 0,
      unit: "",
      phase_number: phaseNumber || 1,
    },
  });
  revalidatePath(`/dashboard/${type}/${resource.id}`);
  return event;
}

export async function edit(formData: FormData) {
  const inputId = formData.get("inputId") as string;

  await prisma.event.update({
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

    await prisma.event.update({
      where: {
        id: id,
      },
      data: {
        [key]: input,
      },
    });
  }

  revalidatePath(`/dashboard`);
}

export async function deleteEvent(id: string) {
  await prisma.event.delete({
    where: {
      id,
    },
  });

  revalidatePath("/");
}

export async function deleteManyEvents(array: any[]) {
  await prisma.event.deleteMany({
    where: {
      id: {
        in: [...array],
      },
    },
  });

  revalidatePath("/");
}

export const useDeleteEvent = (id: string) => {
  let isLoading = true;
  let error;
  let data;

  try {
    const deleteEvent = async () => {
      await prisma.event
        .delete({
          where: {
            id,
          },
        })
        .then((res) => {
          data = res;
        });

      revalidatePath("/");
    };
    data = deleteEvent;
  } catch (err) {
    error = err;
  } finally {
    isLoading = false;
  }

  return { data, isLoading, error };
};

export async function todoStatus(formData: FormData) {
  const inputId = formData.get("inputId") as string;
  const event = await prisma.event.findUnique({
    where: {
      id: inputId,
    },
  });

  if (!event) {
    return;
  }

  //   const updatedStatus = !event.isCompleted;

  await prisma.event.update({
    where: {
      id: inputId,
    },
    data: {
      //   isCompleted: updatedStatus,
    },
  });

  revalidatePath("/");

  //   return updatedStatus;
}

export const handleUpdateField = async (
  id: string,
  key: string,
  val: string | number
) => {
  try {
    let data = { [key]: val };

    // console.log(key, val);
    if (key === "date") {
      console.log("update range!");
    }
    const updatedResource = await prisma.event.update({
      where: {
        id: id,
      },
      data,
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

export const copyManyEventsToPhase = async (
  array: any[],
  destinationPhase: number
) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        id: {
          in: [...array],
        },
      },
    });

    const newEvents = events.map((event) => {
      // Omitting the 'id' field to allow Prisma to generate a new one
      const { id, ...eventWithoutId } = event;

      return {
        ...eventWithoutId,
        phase_number: destinationPhase,
      };
    });

    await prisma.event.createMany({
      data: newEvents,
    });

    revalidatePath("/");
  } catch (error: any) {
    // Handle errors here
    console.error("Error updating field:", error.message);
    // Optionally, rethrow the error if you want to propagate it further
    throw error;
  }
};
