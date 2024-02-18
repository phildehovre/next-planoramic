"use server";

import { auth } from "@clerk/nextjs";
import dayjs from "dayjs";
import { backOff } from "exponential-backoff";
import { update } from "./eventActions";
import { updateField } from "./actions";
import { Event } from "@prisma/client";

export const fetchOauthGoogleToken = async (userId: string | null) => {
  if (!userId) return;
  try {
    const response = await fetch(
      `https://api.clerk.dev/v1/users/${userId}/oauth_access_tokens/oauth_google`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      }
    );
    const responseData = await response.json();
    return responseData[0].token;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export async function deleteCalendarEvent(id: string, token: any) {
  try {
    await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + process.env.CLERK_SECRET_KEY,
        },
      }
    ).then((data) => {
      console.log(JSON.stringify(data));
    });
  } catch (error) {
    alert("Unable to delete event at this time: " + error);
  }
}

export const deleteCalendarEvents = async (events: [], token: any) => {
  let idArray = events.map((e: { event_id: string }) => {
    return e.event_id;
  });
  for (let i = 0; i < events.length; i++) {
    await deleteCalendarEvent(idArray[i], token);
  }
};

export async function formatAndUpdateEvent(
  eventObj: {
    category: string;
    completed: boolean;
    description: string;
    position: number;
    id: string;
    type: string;
    event_id: string;
  },
  targetDate: Date,

  // ===== PASS THE USER TOKEN AS SECOND PARAMETER:
  token: any
) {
  const { category, description, position, type, event_id } = eventObj;

  const start = dayjs(targetDate).subtract(position, "days");
  const end = dayjs(targetDate).subtract(position, "days").add(1, "hour");

  const event = {
    summary: description,
    description: `${category} / ${type}`,
    start: {
      dateTime: start.toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: end.toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    id: event_id,
  };

  try {
    await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${event_id}`,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(event),
      }
    ).then((data) => {
      return data.json();
    });
  } catch (error) {
    alert("Unable to create event at this time: " + error);
  }
}

const fetchHolidays = async (region: string, token: any) => {
  const BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAYS =
    "holiday@group.v.calendar.google.com";
  const CALENDAR_REGION = region;
  try {
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_REGION}%23${BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAYS}/events`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token.provider_token,
        },
      }
    );
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

// export async function postManyEventsToGoogle(
//   events: any[],
//   // targetDate: Date,
//   userId: string
// ) {
//   const eventsSuccessfullyPublished: string[] = [];
//   const token = await fetchOauthGoogleToken(userId);
//   if (!token) return;
//   for (let i = 0; i < events.length; i++) {
//     try {
//       const response = await backOff(() =>
//         formatAndPostUniqueEvent(events[i], token).then((res: any) => {
//           const [status, data] = res;
//           if (status !== 200) {
//             return;
//           }
//           console.log("RESPONSE FROM INDIVIDUAL EVENT POST: ", res);
//           eventsSuccessfullyPublished.push(data.id);
//         })
//       );
//       return response;
//     } catch (e) {
//       console.log("error: ", e);
//     }
//   }
// }

export async function formatAndPostUniqueEvent(
  eventObj: EventType,
  token: string
) {
  const { entity, description, id, date } = eventObj;
  let status, data;

  if (!token || !eventObj) {
    console.log(
      "missing token or eventObj in function formatAndPostUniqueEvent",
      "obj: ",
      eventObj,
      "token: ",
      token
    );
    return;
  }

  const start = dayjs(date).toISOString();
  const end = dayjs(date).add(1, "hour").toISOString();

  // console.log(date, token);

  const event = {
    summary: description,
    description: `${entity} - ${description}`,
    start: {
      dateTime: start,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: end,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    id: id,
  };

  try {
    await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(event),
      }
    ).then((res) => {
      data = eventObj;
      console.log(res.status);
      status = res.status;
      if (res.status !== 200) return;
      try {
        updateField(
          eventObj.type,
          eventObj.id,
          "published",
          true,
          `/dashboard`
        );
      } catch (e) {
        console.log("error: ", e);
      }
      return res.json();
    });
  } catch (error) {
    alert("Unable to create event at this time: " + error);
  }
  return [status, data];
}
