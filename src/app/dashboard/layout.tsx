import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ChatNotificationProvider } from "@/components/dashboard/chat-notifications";

export const metadata: Metadata = {
  title: "Student Dashboard",
  // Account area — never indexed.
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatNotificationProvider>
      <DashboardShell>{children}</DashboardShell>
    </ChatNotificationProvider>
  );
}
