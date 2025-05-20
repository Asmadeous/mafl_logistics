"use client";

import { NotificationWrapper } from "@/components/dashboard/notification-wrapper"
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, userType, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    } else if (
      !isLoading &&
      userType !== "employee" &&
      window.location.pathname.startsWith("/dashboard/admin")
    ) {
      router.push("/auth/login/admin");
    }
  }, [isAuthenticated, userType, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <NotificationWrapper>{children}</NotificationWrapper>;
}
