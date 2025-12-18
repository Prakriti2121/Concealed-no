"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { ElementType } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Home,
  Inbox,
  Users,
  User,
  ChevronRight,
  Menu,
  X,
  AppWindowMac,
  ImageIcon,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Banner",
    icon: AppWindowMac,
    url: "/admin/banner",
  },
  {
    title: "Products",
    url: "/admin/wines",
    icon: Inbox,
    submenu: [
      { title: "View Products", url: "/admin/wines" },
      { title: "Add Product", url: "/admin/add-wines" },
    ],
  },

  {
    title: "Pages",
    icon: FileText,
    url: "/admin/pages/all-pages",
    submenu: [
      { title: "View Pages", url: "/admin/pages/all-pages" },
      { title: "Add Page", url: "/admin/pages/new-page" },
    ],
  },

  {
    title: "Media",
    icon: ImageIcon,
    url: "/admin/media",
  },
  {
    title: "Teams",
    icon: Users,
    url: "/admin/teams/allteams",
    submenu: [
      { title: "View Teams", url: "/admin/teams/allteams" },
      { title: "Add Team", url: "/admin/teams/newteam" },
    ],
  },
];

const bottomItems = [
  {
    title: "Profile",
    url: "#",
    icon: User,
    submenu: [
      { title: "Settings", url: "#" },
      {
        title: "Logout",
        url: "#",
        onClick: () => signOut({ callbackUrl: "/" }),
      },
    ],
  },
];

interface MenuItem {
  title: string;
  url: string;
  icon: ElementType;
  submenu?: {
    title: string;
    url: string;
    onClick?: () => void;
  }[];
  onClick?: () => void;
}
export function AppSidebar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { openMobile, setOpenMobile } = useSidebar();

  // Close mobile sidebar when navigating
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);

  const toggleMobileSidebar = () => {
    setOpenMobile(!openMobile);
  };

  const renderMenuItem = (item: MenuItem, isBottomItem = false) => {
    const Icon = item.icon;
    const isActive = pathname.startsWith(item.url);

    return (
      <SidebarMenuItem key={item.title}>
        {item.submenu ? (
          <HoverCard openDelay={100} closeDelay={200}>
            <HoverCardTrigger asChild>
              <SidebarMenuButton
                asChild
                className={cn(
                  "w-full justify-between py-3 text-base transition-colors duration-200",
                  isActive && "bg-accent text-accent-foreground",
                  isBottomItem && "text-muted-foreground hover:text-primary"
                )}
              >
                <Link href={item.url} className="flex items-center">
                  <Icon className="mr-3 h-5 w-5" />
                  <span className="transition-opacity duration-200">
                    {item.title}
                  </span>
                  <ChevronRight className="ml-auto h-5 w-5" />
                </Link>
              </SidebarMenuButton>
            </HoverCardTrigger>
            <HoverCardContent side="right" align="start" className="w-56 p-2">
              <SidebarMenuSub>
                {item.submenu.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton asChild>
                      {subItem.onClick ? (
                        <button
                          onClick={subItem.onClick}
                          className="flex items-center w-full"
                        >
                          {subItem.title}
                        </button>
                      ) : (
                        <Link href={subItem.url}>{subItem.title}</Link>
                      )}
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </HoverCardContent>
          </HoverCard>
        ) : (
          <SidebarMenuButton
            asChild
            className={cn(
              "py-3 text-base transition-colors duration-200",
              isActive && "bg-accent text-accent-foreground",
              isBottomItem && "text-muted-foreground hover:text-primary"
            )}
          >
            {item.onClick ? (
              <button
                onClick={item.onClick}
                className="flex items-center w-full"
              >
                <Icon className="mr-3 h-5 w-5" />
                <span className="transition-opacity duration-200">
                  {item.title}
                </span>
              </button>
            ) : (
              <Link href={item.url} className="flex items-center">
                <Icon className="mr-3 h-5 w-5" />
                <span className="transition-opacity duration-200">
                  {item.title}
                </span>
              </Link>
            )}
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    );
  };

  // Mobile toggle button that appears at the top of the page
  const MobileToggle = () => (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleMobileSidebar}
      className="fixed top-2 right-2 z-[60] block md:hidden"
    >
      {openMobile ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
    </Button>
  );

  // Desktop sidebar (always visible)
  const DesktopSidebar = () => (
    <div className="relative hidden md:block">
      <Sidebar className="fixed left-0 top-0 z-40 h-full w-64 bg-sidebar text-sidebar-foreground shadow-xl border-r border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <SidebarHeader className="border-b border-border/40 px-6 py-4">
          <h2 className="text-2xl font-bold tracking-tight">Concealed Wines</h2>
        </SidebarHeader>

        <SidebarContent className="py-4">
          <SidebarMenu>{items.map((item) => renderMenuItem(item))}</SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-border/40 pb-12 mt-auto">
          <SidebarMenu>
            {bottomItems.map((item) => renderMenuItem(item, true))}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  );

  // Mobile sidebar
  const renderMobileSidebar = () => (
    <>
      <MobileToggle />
      <div className="md:hidden">
        {openMobile && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpenMobile(false)}
          />
        )}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-sidebar p-4 shadow-lg transition-transform duration-300",
            openMobile ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <h2 className="text-2xl font-bold tracking-tight">
              Concealed Wines
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenMobile(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-4">
            <SidebarMenu>
              {items.map((item) => renderMenuItem(item))}
            </SidebarMenu>
          </div>

          <div className="mt-auto border-t border-border/40 pt-4">
            <SidebarMenu>
              {bottomItems.map((item) => renderMenuItem(item, true))}
            </SidebarMenu>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {DesktopSidebar()}
      {renderMobileSidebar()}
    </>
  );
}
