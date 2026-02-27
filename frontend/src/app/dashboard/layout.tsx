"use client";

import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { SidebarLayout } from "@/components/sidebar-layout";
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "@/components/sidebar";
import { Navbar, NavbarLabel } from "@/components/navbar";
import { Avatar } from "@/components/avatar";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownMenu,
} from "@/components/dropdown";
import {
  HomeIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ArrowsRightLeftIcon,
  InboxStackIcon,
  PhoneIcon,
  ChevronUpIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/20/solid";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const sidebarContent = (
    <Sidebar>
      <SidebarHeader>
        <Logo size="md" href="/dashboard" />
      </SidebarHeader>
      <SidebarBody>
        <SidebarSection>
          <SidebarItem href="/dashboard" current={pathname === "/dashboard"}>
            <HomeIcon />
            <SidebarLabel>Overview</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
        <SidebarSection>
          <SidebarHeading>Outreach</SidebarHeading>
          <SidebarItem
            href="/dashboard/outreach"
            current={pathname === "/dashboard/outreach"}
          >
            <BoltIcon />
            <SidebarLabel>Smart Collector</SidebarLabel>
          </SidebarItem>
          <SidebarItem
            href="/dashboard/outreach/conversations"
            current={pathname === "/dashboard/outreach/conversations"}
          >
            <ChatBubbleLeftRightIcon />
            <SidebarLabel>Conversations</SidebarLabel>
          </SidebarItem>
          <SidebarItem
            href="/dashboard/outreach/messages"
            current={pathname === "/dashboard/outreach/messages"}
          >
            <DocumentTextIcon />
            <SidebarLabel>Messages</SidebarLabel>
          </SidebarItem>
          <SidebarItem
            href="/dashboard/outreach/routing"
            current={pathname === "/dashboard/outreach/routing"}
          >
            <ArrowsRightLeftIcon />
            <SidebarLabel>Routing</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
        <SidebarSection>
          <SidebarItem
            href="/dashboard/reviews"
            current={pathname.startsWith("/dashboard/reviews")}
          >
            <InboxStackIcon />
            <SidebarLabel>Review Inbox</SidebarLabel>
          </SidebarItem>
          <SidebarItem
            href="/dashboard/voice-agent"
            current={pathname.startsWith("/dashboard/voice-agent")}
          >
            <PhoneIcon />
            <SidebarLabel>AI Receptionist</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarBody>
      <SidebarFooter>
        <Dropdown>
          <DropdownButton as={SidebarItem}>
            <Avatar
              className="size-8 bg-sahrai-900 text-white"
              initials="MC"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-zinc-900 truncate">
                Mathilde Chavent
              </p>
              <p className="text-xs text-zinc-500 truncate">
                Directrice G&eacute;n&eacute;rale
              </p>
            </div>
            <ChevronUpIcon className="size-4 text-zinc-400" />
          </DropdownButton>
          <DropdownMenu anchor="top start">
            <DropdownItem href="/dashboard/settings">
              <Cog6ToothIcon />
              Param&egrave;tres
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem
              onClick={() => {
                document.cookie = "demo_auth=; path=/; max-age=0";
                window.location.href = "/";
              }}
            >
              <ArrowRightStartOnRectangleIcon />
              Se déconnecter
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </SidebarFooter>
    </Sidebar>
  );

  const navbarContent = (
    <Navbar>
      <Logo size="sm" href="/dashboard" />
      <NavbarLabel className="font-semibold text-zinc-950">
        Villa Sahrai
      </NavbarLabel>
    </Navbar>
  );

  return (
    <SidebarLayout navbar={navbarContent} sidebar={sidebarContent}>
      {children}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-amber-600 text-white text-center text-xs py-1.5 px-4">
        This is a demo environment. All data displayed is fictitious and for demonstration purposes only.
      </div>
    </SidebarLayout>
  );
}
