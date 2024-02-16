import Sidebar from "@/components/shared/Sidebar";
import { auth, currentUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import clerk from "@clerk/clerk-sdk-node";
import React from "react";

const DashboardPage = async () => {
  const { userId } = auth();

  console.log(userId);

  if (userId) {
    // try {
    // const currentUserOauthAccessToken = async () => {
    //   return await clerkClient.users.getUserOauthAccessToken(
    //     userId,
    //     "oauth_google"
    //   );
    // };
    // console.log(await currentUserOauthAccessToken());
    // }
    // } catch (err) {
    //   console.log(err);
    // }
    const token = async () => {
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
        console.log("DATA:", responseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    token();
  }

  return <div>Dashboard under construction</div>;
};

export default DashboardPage;
