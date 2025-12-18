"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import BreadCrumb from "../../components/breadcrumb/breadcrumb";
import SidebarContent from "../../components/sidebarcontent";

interface PageData {
  title: string;
  content: string;
  imageUrl: string;
}

export function ProfileContent() {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPageData() {
      try {
        // Use relative URL for client-side fetching
        const res = await fetch('/api/yrityksen-profiili', {
          cache: 'no-store'
        });
        if (!res.ok) {
          throw new Error("Failed to fetch page data");
        }
        const data = await res.json();
        setPageData(data);
      } catch (error) {
        console.error("Error fetching page data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPageData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
          {/* Skeleton breadcrumb */}
          <div className="h-6 w-64 bg-secondary rounded-md animate-pulse mb-4" />
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Main Content skeleton - 3/4 width */}
            <div className="w-full lg:flex-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-4 w-full">
                    {/* Title skeleton */}
                    <div className="flex items-center gap-2">
                      <div className="h-7 bg-secondary rounded-md w-3/5 animate-pulse" />
                    </div>

                    {/* Image skeleton - matches the wine glasses image */}
                    <div className="my-6 flex justify-center">
                      <div className="w-full max-w-md h-72 bg-secondary rounded-md animate-pulse" />
                    </div>

                    {/* Content paragraph skeletons */}
                    <div className="space-y-3">
                      <div className="h-4 bg-secondary rounded-md w-full animate-pulse" />
                      <div className="h-4 bg-secondary rounded-md w-full animate-pulse" />
                      <div className="h-4 bg-secondary rounded-md w-5/6 animate-pulse" />
                      <div className="h-4 bg-secondary rounded-md w-full animate-pulse" />
                      <div className="h-4 bg-secondary rounded-md w-4/5 animate-pulse" />
                    </div>

                    {/* Additional paragraph with gap */}
                    <div className="space-y-3 mt-4">
                      <div className="h-4 bg-secondary rounded-md w-full animate-pulse" />
                      <div className="h-4 bg-secondary rounded-md w-3/4 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Share button skeleton */}
                <div className="mt-6 flex gap-2">
                  <div className="h-9 w-24 bg-secondary rounded-md animate-pulse" />
                </div>
              </CardContent>
            </Card>
          </div>

            {/* Right sidebar placeholder - actual SidebarContent component has its own loading state */}
            <aside className="w-full lg:w-1/4 lg:sticky lg:top-6 lg:self-start">
              <SidebarContent />
            </aside>
          </div>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return <div>Error loading page data</div>;
  }

  // Get the current URL (client-side)
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
        <BreadCrumb title1={pageData.title} />
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="w-full lg:flex-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[1.75rem] font-bold text-[#1D2939]">
                      {pageData.title}
                    </h1>
                  </div>
                  <div
                    className="leading-relaxed content text-[#282828]"
                    dangerouslySetInnerHTML={{ __html: pageData.content }}
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2">
                    <div className="flex space-x-2">
                      <FacebookShareButton
                        url={currentUrl}
                        title={pageData.title}
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                        >
                          <Facebook className="h-4 w-4" />
                          <span className="sr-only">Share on Facebook</span>
                        </Button>
                      </FacebookShareButton>
                      <TwitterShareButton
                        url={currentUrl}
                        title={pageData.title}
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                        >
                          <Twitter className="h-4 w-4" />
                          <span className="sr-only">Share on Twitter</span>
                        </Button>
                      </TwitterShareButton>
                      <LinkedinShareButton
                        url={currentUrl}
                        title={pageData.title}
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                        >
                          <Linkedin className="h-4 w-4" />
                          <span className="sr-only">Share on LinkedIn</span>
                        </Button>
                      </LinkedinShareButton>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>
        </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-1/4 lg:sticky lg:top-6 lg:self-start">
            <SidebarContent />
          </aside>
        </div>
      </div>
    </div>
  );
}
