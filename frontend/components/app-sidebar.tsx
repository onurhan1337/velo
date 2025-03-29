"use client";

import * as React from "react";
import {
  Command,
  FileText,
  BarChart2,
  Sparkles,
  Users,
  Settings2,
  LifeBuoy,
  Send,
  Database,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Forms",
      url: "/forms",
      icon: FileText,
      isActive: true,
      items: [
        {
          title: "My Forms",
          url: "/forms/my-forms",
        },
        {
          title: "Templates",
          url: "/forms/templates",
        },
        {
          title: "Shared",
          url: "/forms/shared",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart2,
      items: [
        {
          title: "Overview",
          url: "/analytics/overview",
        },
        {
          title: "Responses",
          url: "/analytics/responses",
        },
        {
          title: "Reports",
          url: "/analytics/reports",
        },
      ],
    },
    {
      title: "AI Insights",
      url: "/ai-insights",
      icon: Sparkles,
      items: [
        {
          title: "Suggestions",
          url: "/ai-insights/suggestions",
        },
        {
          title: "Form Optimization",
          url: "/ai-insights/optimization",
        },
        {
          title: "Sentiment Analysis",
          url: "/ai-insights/sentiment",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "Account",
          url: "/settings/account",
        },
        {
          title: "Integrations",
          url: "/settings/integrations",
        },
        {
          title: "Billing",
          url: "/settings/billing",
        },
        {
          title: "Team",
          url: "/settings/team",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Form Collections",
      url: "/collections",
      icon: Database,
    },
    {
      name: "Team Workspace",
      url: "/team-workspace",
      icon: Users,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Velo</span>
                  <span className="truncate text-xs">powered by AI</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
