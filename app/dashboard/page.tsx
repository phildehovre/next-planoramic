import Sidebar from "@/components/shared/Sidebar";
import { currentUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import clerk from "@clerk/clerk-sdk-node";
import React from "react";

const DashboardPage = async () => {
  const user = await currentUser();

  if (user && user.id) {
    try {
      const currentUserOauthAccessToken = async () => {
        return await clerkClient.users.getUserOauthAccessToken(
          user.id,
          "oauth_google"
        );
      };
      console.log(await currentUserOauthAccessToken());
    } catch (err) {
      console.log(err);
    }
  }

  return <div>Dashboard under construction</div>;
};

export default DashboardPage;
