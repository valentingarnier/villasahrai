"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { api, UserProfile } from "@/lib/api";
import { Logo } from "@/components/logo";
import { SidebarLayout } from "@/components/sidebar-layout";
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Avatar } from "@/components/avatar";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownMenu,
} from "@/components/dropdown";
import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import { Badge } from "@/components/badge";
import {
  HomeIcon,
  CreditCardIcon,
  ChartBarIcon,
  ArrowRightStartOnRectangleIcon,
  ChevronUpIcon,
  CheckCircleIcon,
} from "@heroicons/react/20/solid";

type Section = "home" | "billing" | "usage";

export default function DashboardPage() {
  const supabase = createClient();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [apiMessage, setApiMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const me = await api.getMe();
      setUser(me);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  async function testApi() {
    try {
      const res = await api.hello();
      setApiMessage(res.message);
    } catch (err) {
      setApiMessage(err instanceof Error ? err.message : "API error");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100">
        <div className="animate-spin h-8 w-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={loadData} className="text-zinc-900 underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const sidebarContent = (
    <Sidebar>
      <SidebarHeader>
        <Logo size="md" href="/dashboard" />
      </SidebarHeader>
      <SidebarBody>
        <SidebarSection>
          <SidebarItem current={activeSection === "home"} onClick={() => setActiveSection("home")}>
            <HomeIcon />
            <SidebarLabel>Home</SidebarLabel>
          </SidebarItem>
          <SidebarItem current={activeSection === "billing"} onClick={() => setActiveSection("billing")}>
            <CreditCardIcon />
            <SidebarLabel>Billing</SidebarLabel>
          </SidebarItem>
          <SidebarItem current={activeSection === "usage"} onClick={() => setActiveSection("usage")}>
            <ChartBarIcon />
            <SidebarLabel>Usage</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarBody>
      <SidebarFooter>
        <Dropdown>
          <DropdownButton as={SidebarItem}>
            <Avatar
              className="size-8 bg-zinc-900 text-white"
              initials={user?.email?.charAt(0).toUpperCase() || "?"}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-zinc-900 truncate">{user?.email}</p>
            </div>
            <ChevronUpIcon className="size-4 text-zinc-400" />
          </DropdownButton>
          <DropdownMenu anchor="top start">
            <DropdownItem onClick={handleSignOut}>
              <ArrowRightStartOnRectangleIcon />
              Sign out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </SidebarFooter>
    </Sidebar>
  );

  return (
    <SidebarLayout navbar={<Navbar />} sidebar={sidebarContent}>
      {activeSection === "home" && (
        <div>
          <Heading>Welcome to your dashboard</Heading>
          <Text className="mt-2">Everything is connected and ready to go.</Text>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {/* Status Card */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircleIcon className="size-6 text-green-500" />
                <h3 className="text-lg font-semibold text-zinc-900">All Systems Ready</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600">Frontend</span>
                  <Badge color="green">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600">Backend API</span>
                  <Badge color="green">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600">Supabase Auth</span>
                  <Badge color="green">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600">Subscription</span>
                  <Badge color={user?.subscription_status === "ACTIVE" ? "green" : "zinc"}>
                    {user?.subscription_status || "None"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* API Test Card */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">Test API Connection</h3>
              <Text className="mb-4">
                Click the button to call the backend /hello endpoint.
              </Text>
              <button
                onClick={testApi}
                className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors text-sm font-medium"
              >
                Call /api/v1/hello
              </button>
              {apiMessage && (
                <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-sm text-green-800">{apiMessage}</p>
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Your Account</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500 w-24">Email:</span>
                <span className="text-sm text-zinc-900">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500 w-24">User ID:</span>
                <span className="text-sm text-zinc-900 font-mono">{user?.id}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === "billing" && (
        <div>
          <Heading>Billing</Heading>
          <Text className="mt-2">Manage your subscription.</Text>
          <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-600">
              Stripe Checkout is pre-configured. Add your STRIPE_PRICE_ID to enable subscriptions.
            </p>
          </div>
        </div>
      )}

      {activeSection === "usage" && (
        <div>
          <Heading>Usage</Heading>
          <Text className="mt-2">Track your usage metrics.</Text>
          <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-600">
              Add your usage tracking logic here.
            </p>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
