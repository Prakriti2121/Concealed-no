"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import BreadCrumb from "../../components/breadcrumb/breadcrumb";
import SidebarContent from "../../../(user-view)/components/sidebarcontent";
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

interface PageData {
  title: string;
  content: string;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactContent() {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchPageData() {
      try {
        // Use relative URL for client-side fetching
        const res = await fetch('/api/ota-yhteytta', {
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to send email");
      }
      alert("Email sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error sending email");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
          {/* Skeleton Breadcrumb */}
          <div className="h-6 w-48 bg-secondary dark:bg-gray-800 rounded animate-pulse mb-6" />

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Main Contact Content Skeleton */}
            <div className="w-full lg:flex-1">
            <div className="grid grid-cols-1 gap-8">
              {/* First Card Skeleton - Company Information */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4 w-full">
                      {/* Title skeleton */}
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-48 bg-secondary dark:bg-gray-800 rounded animate-pulse" />
                      </div>

                      {/* Content skeleton - Multiple lines */}
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-secondary dark:bg-gray-800 rounded animate-pulse" />
                        <div className="h-4 w-4/5 bg-secondary dark:bg-gray-800 rounded animate-pulse" />
                        <div className="h-4 w-3/4 bg-secondary dark:bg-gray-800 rounded animate-pulse" />
                        <div className="h-4 w-5/6 bg-secondary dark:bg-gray-800 rounded animate-pulse" />
                        <div className="h-4 w-2/3 bg-secondary dark:bg-gray-800 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* Share button skeleton */}
                  <div className="mt-6 flex gap-2">
                    <div className="h-9 w-24 bg-secondary dark:bg-gray-800 rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>

              {/* Second Card Skeleton - Contact Form */}
              <Card>
                <CardContent className="p-6">
                  {/* Form title skeleton */}
                  <div className="h-7 w-36 bg-secondary dark:bg-gray-800 rounded animate-pulse mb-4" />

                  {/* Form fields skeleton */}
                  <div className="space-y-4">
                    {/* Name field */}
                    <div className="space-y-2">
                      <div className="h-5 w-16 bg-secondary dark:bg-gray-800 rounded animate-pulse" />
                      <div className="h-10 w-full bg-secondary dark:bg-gray-800 rounded animate-pulse" />
                    </div>

                    {/* Email field */}
                    <div className="space-y-2">
                      <div className="h-5 w-16 bg-secondary dark:bg-gray-800 rounded animate-pulse" />
                      <div className="h-10 w-full bg-secondary dark:bg-gray-800 rounded animate-pulse" />
                    </div>

                    {/* Subject field */}
                    <div className="space-y-2">
                      <div className="h-5 w-20 bg-secondary dark:bg-gray-800 rounded animate-pulse" />
                      <div className="h-10 w-full bg-secondary dark:bg-gray-800 rounded animate-pulse" />
                    </div>

                    {/* Message field */}
                    <div className="space-y-2">
                      <div className="h-5 w-24 bg-secondary dark:bg-gray-800 rounded animate-pulse" />
                      <div className="h-24 w-full bg-secondary dark:bg-gray-800 rounded animate-pulse" />
                    </div>

                    {/* Submit button */}
                    <div className="h-10 w-full bg-secondary dark:bg-gray-800 rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            </div>
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

  if (!pageData) {
    return <div>Error loading page data</div>;
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
        <BreadCrumb title1={pageData.title} />
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Main Contact Content */}
          <div className="w-full lg:flex-1">
          <div className="grid grid-cols-1 gap-8">
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

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1D2939] mb-4">
                  Contact Us
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Your message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
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
