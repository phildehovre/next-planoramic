import React from "react";
import { getTemplates } from "@/hooks/templates";
import { getCampaigns } from "@/hooks/campaigns";
import Sidebar from "@/components//shared/Sidebar";
import { auth, clerkClient, currentUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();

  let templates;
  let campaigns;

  if (user) {
    templates = await getTemplates(user.id);
    campaigns = await getCampaigns(user.id);
  }

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
        {
          name: "Settings",
          pathname: "/settings",
          description: "User and account settings",
        },
        {
          name: "Profile",
          pathname: "/profile",
          description: "Your profile and account settings",
        },
        {
          name: "Logout",
          pathname: "/sign-out",
          description: "Logout of your account",
        },
      ],
    },
  ];

  return (
    <>
      {user && (
        <ResizablePanelGroup
          direction="horizontal"
          className={cn("dashboard_ctn", "w-full flex justify-between h-full")}
        >
          <ResizablePanel defaultSize={15} className="min-w-5">
            <Sidebar data={ressourceData} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel className={cn("dashboard", " w-full flex")}>
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
      {/* <Spinner loading={isLoading} /> */}
    </>
  );
};

export default DashboardLayout;
