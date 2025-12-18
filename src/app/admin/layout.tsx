import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/molecules/AppSidebar";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin dashboard for ConcealedWines",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  // If there's no active session, redirect to the home page
  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <SidebarProvider>
        <div className="relative max-w-1/5">
          <AppSidebar />
          <div className="absolute right-0 top-0 z-50">
            <SidebarTrigger />
          </div>
        </div>

        <div className="min-w-4/5 w-full">{children}</div>
      </SidebarProvider>
    </div>
  );
}
