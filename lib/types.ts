interface ResourceType {
  id: string;
  name: string;
  description: string;
  userId: string | null;
  clerk_id: string;
}

interface CampaignType extends ResourceType {
  generated_from: string;
  templateId?: string;
  target_date: Date;
  published: boolean;
}

interface TemplateType extends ResourceType {
  Campaign: CampaignType[];
}

interface EventType extends ResourceType {
  templateId: string;
  campaignId?: string;
  entity?: string;
  range?: number;
  unit?: string;
  phase_number?: number;
  type: "template_event" | "campaign_event";
  date?: string;
  published: boolean;
}

interface User {
  id: string;
  clerk_id: string;
  email: string;
  firstname: string | null;
  lastname: string | null;
  name?: string | null;
  Templates?: TemplateType[];
  Campaigns?: CampaignType[];
  Events?: Event[];
}

interface SidebarTypes {
  heading: "Templates" | "Campaigns" | "Settings";
  type: "template" | "campaign" | "settings";
  items: ResourceType[] | SidebarSettingsMenuItems[] | undefined;
}

type SidebarSettingsMenuItems = {
  name: "Settings" | "Profile" | "Logout";
  description: string;
  id?: string;
  icon?: React.ReactElement;
  pathname: string;
};

type OptionType = {
  type: string;
  label: string;
  url?: string;
  values?: any[];
  submenu?: SubmenuType;
};

type SubmenuType = {
  label: string;
  type: string;
  values: any[];
};

type DropdownOptionType = {
  options: OptionType[];
  onOptionClick: (type: string) => void;
  Icon: React.JSXElementConstructor<any>;
  active?: boolean;
  disabled?: boolean;
};

type InferValueFromColor<Color extends string> =
  Color extends `${infer N}-${infer C}-${infer T}`
    ? {
        namespace: N;
        color: C;
        tone: T;
      }
    : never;

type Example = InferValueFromColor<"text-green-300">;
// type Example = { namespace: "text"; color: "green"; tone: "300" }
