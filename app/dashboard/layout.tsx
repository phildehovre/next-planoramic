import React from "react";
import { getTemplates } from "@/hooks/templates";
import { getCampaigns } from "@/hooks/campaigns";
import Sidebar from "@/components//shared/Sidebar";
import { auth, clerkClient, currentUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();

  // const [OauthAccessToken] = await clerkClient.users.getUserOauthAccessToken(
  //   user.id || "",
  //   "oauth_google"
  // );

  let templates;
  let campaigns;

  if (user) {
    templates = await getTemplates(user.id);
    campaigns = await getCampaigns(user.id);
  }

  console.log("TEMPLATES: ", templates);

  // if (!templates) {
  //   redirect("/dashboard");
  // }

  const ressourceData: SidebarTypes[] = [
    {
      heading: "Templates",
      type: "template",
      items: templates,
    },
    {
      heading: "Campaigns",
      type: "campaign",
      items: campaigns,
    },
    {
      heading: "Settings",
      type: "settings",
      items: [
        { name: "Settings", description: "User and account settings" },
        { name: "Profile", description: "Your profile and account settings" },
        { name: "Logout", description: "Logout of your account" },
      ],
    },
  ];

  return (
    <div>
      {user && (
        <div
          className={cn(
            "dashboard_ctn",
            "w-full flex justify-between h-screen"
          )}
        >
          <Sidebar data={ressourceData} />
          <div className={cn("dashboard", " w-full flex")}>{children}</div>
        </div>
      )}
      {/* <Spinner loading={isLoading} /> */}
    </div>
  );
};

export default DashboardLayout;