"use server";

import { auth } from "@clerk/nextjs";
import dayjs from "dayjs";
import { backOff } from "exponential-backoff";
import { update } from "./eventActions";
import { updateField } from "./actions";
import { Event } from "@prisma/client";

export const fetchOauthGoogleToken = async (userId: string | undefined) => {
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
          Authorization: "Bearer " + token,
        },
      }
    ).then(async (data) => {
      updateField("event", id, "published", false);
      const event = await fetchUniqueCalendarEvent(id, token);
      console.log("EVENT DELETED: ", event);
    });
  } catch (error) {
    alert("Unable to delete event at this time: " + error);
  }
}

export const deleteManyCalendarEvents = async (
  events: EventType[] | undefined,
  token: any
) => {
  if (!events || !token) return;
  let idArray = events.map((e: { id: string }) => {
    return e.id;
  });
  for (let i = 0; i < events.length; i++) {
    // BUG: Make sure this works
    const response = await backOff(() =>
      deleteCalendarEvent(idArray[i], token)
    );
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

export const fetchAllCalendarEvents = async (token: any) => {
  if (!token) {
    alert("No token found");
  }
  try {
    const res = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    ).then((res) => {
      return res.json();
    });

    return res;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const fetchUniqueCalendarEvent = async (id: string, token: any) => {
  try {
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    ).then((res) => {
      return res.json();
    });

    return res;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const updateUniqueCalendarEvent = async (
  event: EventType,
  token: any,
  [key, value]: [string, any]
) => {
  let status, data, error;

  const headers = {
    Authorization: "Bearer " + token,
  };
  try {
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${event.id}`,
      {
        method: "GET",
        headers,
      }
    ).then(async (res) => {
      const fetchedEvent = await res.json();
      if (!fetchedEvent) {
        error = "No event fetched on update";
        throw new Error("No event fetched on update");
      }
      const body = JSON.stringify({
        ...fetchedEvent,
        [key]: value,
      });
      console.log(body);
      try {
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${event.id}`,
          {
            method: "PUT",
            headers,
            body,
          }
        );
        status = response.status;
        data = response.json();
      } catch (err) {
        error = err;
      }
    });

    return [status, data, error];
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return [status, data, error];
};

export async function formatAndPostUniqueEvent(
  eventObj: EventType,
  token: string
) {
  const { entity, description, id, date } = eventObj;
  let status, data, error;

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
      console.log(res);
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
  } catch (err) {
    alert("Unable to create event at this time: " + err);
    error = err;
  }
  return [status, data, error];
}
