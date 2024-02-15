import { User } from "@prisma/client";
import prisma from "@/lib/db";

export async function getTemplates(userId: string) {
  console.log("userId: ", userId);
  if (userId) {
    const templates = await prisma.template.findMany({
      where: {
        clerk_id: userId,
      },
    });

    if (!templates) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
    }

    return templates;
  }
}

export async function getUniqueTemplateByUser(id: any, user: any) {
  if (user) {
    let resource = await prisma.template.findUnique({
      where: {
        id: id,
        clerk_id: user.id,
      },
    });
    return resource;
  }
}

export async function getResourceForUserById(
  resourceType: string,
  user: User,
  id: string
) {
  if (user) {
    let ressource;
    if (resourceType === "templates") {
      ressource = await prisma.template.findUnique({
        where: {
          id: id,
          clerk_id: user.id,
        },
      });
    }

    if (resourceType === "campaigns") {
      ressource = await prisma.campaign.findUnique({
        where: {
          id: id,
          clerk_id: user?.id,
        },
      });
    }
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    if (!ressource) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data for user: " + user?.firstname);
    }
  }
}

export const getEventsByTemplateId = async (id: string, user: any) => {
  if (!id || !user) return;
  let isLoading = true;
  let events;
  let error;

  try {
    events = prisma.event.findMany({
      where: {
        templateId: id,
      },
      orderBy: {
        range: "asc", // or 'desc' for descending order
      },
    });

    return events;
  } catch (err: any) {
    error = err;
  }

  return { isLoading, events, error };
};
