"use client";

import { updateField } from "@/app/actions/actions";
import {
  fetchOauthGoogleToken,
  formatAndPostUniqueEvent,
} from "@/app/actions/calendar";
import { update } from "@/app/actions/eventActions";
import { backOff } from "exponential-backoff";
import { useState } from "react";

type ErrorType = {
  message: string;
  code?: number;
  event?: any;
};

function usePostManyEventsToGoogle() {
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorType[]>([]);
  const [successfulPosts, setSuccessfulPosts] = useState<string[]>([]);

  async function postManyEventsToGoogle(
    events: EventType[],
    userId: string
  ): Promise<void> {
    setLoading(true);
    setErrors([]);
    setSuccessfulPosts([]);

    const eventsSuccessfullyPublished: string[] = [];

    try {
      const token: string | null = await fetchOauthGoogleToken(userId);
      if (!token) return;

      for (let i = 0; i < events.length; i++) {
        try {
          const response = await backOff(() =>
            formatAndPostUniqueEvent(events[i], token).then(
              async (res: any) => {
                const [status, data] = res;
                if (status !== 200) {
                  setErrors((prevErrors: ErrorType[]) => [
                    ...prevErrors,
                    {
                      message: `Event ${data?.id} failed to publish. Error: ${status}`,
                      code: status,
                      event: data,
                    },
                  ]);
                  return;
                }
                await updateField("campaign_event", data.id, "published", true);
                eventsSuccessfullyPublished.push(data.id);
              }
            )
          );
          // return response; // It's not quite clear what you want to return here
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

  return { loading, errors, successfulPosts, postManyEventsToGoogle };
}

export default usePostManyEventsToGoogle;
