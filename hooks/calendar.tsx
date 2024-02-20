"use client";

import { updateField } from "@/app/actions/actions";
import {
  fetchOauthGoogleToken,
  formatAndPostUniqueEvent,
  updateUniqueCalendarEvent,
} from "@/app/actions/calendar";
import { update } from "@/app/actions/eventActions";
import { GoogleEventSchema } from "@/schemas/events";
import { backOff } from "exponential-backoff";
import { useState } from "react";

type ErrorType = {
  message: string;
  code?: number;
  event?: any;
};

function usePostManyEventsToGoogle(campaign: CampaignType | null) {
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorType[]>([]);
  const [successfulPosts, setSuccessfulPosts] = useState<string[]>([]);

  console.log(successfulPosts, "SUCCESSFUL POSTS");

  async function postManyEventsToGoogle(
    events: EventType[],
    userId: string
  ): Promise<void> {
    setLoading(true);
    setErrors([]);
    setSuccessfulPosts([]);

    const eventsSuccessfullyPublished: string[] = [];

    if (campaign === null) return;

    console.log("ERRORS: ", errors);

    try {
      const token: string | null = await fetchOauthGoogleToken(userId);
      if (!token) return;

      for (let i = 0; i < events.length; i++) {
        try {
          if (!campaign.published) {
            const response = await backOff(() =>
              formatAndPostUniqueEvent(events[i], token).then(
                async (res: any) => {
                  const [status, data, error] = res;
                  if (status !== 200) {
                    setErrors((prevErrors: ErrorType[]) => [
                      ...prevErrors,
                      {
                        message: `Event ${data?.id} failed to publish. Error: ${error}, code: ${status}`,
                        code: status,
                        event: data,
                      },
                    ]);
                    return;
                  }
                  // BUG: This is not updating the event in the database
                  await updateField("event", data.id, "published", true);
                  eventsSuccessfullyPublished.push(data.id);
                }
              )
            );
          }
        } catch (e: any) {
          console.log("error: ", e);
          setErrors((prevErrors: ErrorType[]) => [
            ...prevErrors,
            { message: `Error occurred: ${e.message}` },
          ]);
        }
      }

      setSuccessfulPosts(eventsSuccessfullyPublished);
    } catch (error: any) {
      console.error("Error occurred while posting events:", error);
      setErrors((prevErrors: ErrorType[]) => [
        ...prevErrors,
        { message: `Error occurred: ${error.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function updateManyEventsToGoogle(
    events: EventType[],
    userId: string,
    keyValue: [string, any]
  ): Promise<void> {
    setLoading(true);
    setErrors([]);
    setSuccessfulPosts([]);

    const eventsSuccessfullyPublished: string[] = [];

    if (campaign === null) return;

    try {
      const token: string | null = await fetchOauthGoogleToken(userId);
      if (!token) return;

      for (let i = 0; i < events.length; i++) {
        try {
          const response = await backOff(() =>
            updateUniqueCalendarEvent(events[i], token, keyValue).then(
              async (res: any) => {
                const [status, data, error] = res;

                // console.log(res)
                if (status !== 200) {
                  setErrors((prevErrors: ErrorType[]) => [
                    ...prevErrors,
                    {
                      message: `Event ${data?.id} failed to publish. Error: ${error}, code: ${status}`,
                      code: status,
                      event: data,
                    },
                  ]);
                  return;
                }
                // BUG: This is not updating the event in the database
                await updateField("event", data.id, "published", true);
                console.log("DATA: ", data);
                eventsSuccessfullyPublished.push(data.id);
              }
            )
          );
        } catch (e: any) {
          console.log("error: ", e);
          setErrors((prevErrors: ErrorType[]) => [
            ...prevErrors,
            { message: `Error occurred: ${e.message}` },
          ]);
        } finally {
          setLoading(false);
        }
      }

      setSuccessfulPosts(eventsSuccessfullyPublished);
    } catch (error: any) {
      console.error("Error occurred while posting events:", error);
      setErrors((prevErrors: ErrorType[]) => [
        ...prevErrors,
        { message: `Error occurred: ${error.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    errors,
    successfulPosts,
    postManyEventsToGoogle,
    updateManyEventsToGoogle,
  };
}

export default usePostManyEventsToGoogle;
