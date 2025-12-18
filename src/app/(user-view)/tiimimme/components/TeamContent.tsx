"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BreadCrumb from "../../components/breadcrumb/breadcrumb";
import SidebarContent from "../../components/sidebarcontent";
// import { TeamContentSkeleton } from "@/components/skeleton/TeamContentSkeleton";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  image: string | null;
  createdAt: string;
}

interface ApiResponse {
  items: TeamMember[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function TeamContent() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        // Use relative URL for client-side fetching
        const res = await fetch('/api/team', {
          cache: 'no-store'
        });
        if (!res.ok) {
          throw new Error(
            `Failed to fetch team members: ${res.status} ${res.statusText}`
          );
        }
        const data: ApiResponse = await res.json();
        setTeamMembers(data.items);
      } catch (err: unknown) {
        console.error("Error fetching team members:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchTeamMembers();
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
          {/* Skeleton breadcrumb */}
          <div className="h-6 w-64 bg-secondary rounded-md animate-pulse mb-4" />
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Main Content skeleton */}
            <div className="w-full lg:flex-1">
            <div className="grid gap-6 sm:gap-8 md:gap-10">
              {/* Generate 4 team member card skeletons */}
              {[1, 2, 3, 4].map((index) => (
                <Card
                  key={index}
                  className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row h-full">
                    {/* Image placeholder */}
                    <div className="relative w-full sm:w-1/3 h-64 sm:h-auto bg-secondary animate-pulse" />

                    <div className="flex-1 p-4 sm:p-6 flex flex-col justify-center">
                      <div className="p-0 pb-2 sm:pb-3 space-y-3">
                        {/* Name skeleton */}
                        <div className="h-7 bg-secondary rounded-md w-3/5 animate-pulse" />
                        {/* Role skeleton */}
                        <div className="h-5 bg-secondary rounded-md w-2/5 animate-pulse mt-1" />
                      </div>
                      <div className="p-0 mt-4 space-y-2">
                        {/* Description skeleton lines */}
                        <div className="h-4 bg-secondary rounded-md w-full animate-pulse" />
                        <div className="h-4 bg-secondary rounded-md w-full animate-pulse" />
                        <div className="h-4 bg-secondary rounded-md w-4/5 animate-pulse" />
                        <div className="h-4 bg-secondary rounded-md w-5/6 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

            {/* Right sidebar */}
            <aside className="w-full lg:w-1/4 lg:sticky lg:top-6 lg:self-start">
              <SidebarContent />
            </aside>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] py-8 sm:py-12 md:py-16">
        <div className="p-4 sm:p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 mx-4">
          <p className="text-red-600 dark:text-red-400 font-medium text-sm sm:text-base">
            Error: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
        <BreadCrumb title1="Tiimimme" />
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="w-full lg:flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[1.75rem] font-bold mb-6 text-[#1D2939]">Tiimimme</h1>
          <div className="grid gap-6 sm:gap-8 md:gap-10">
            {teamMembers.map((member) => (
              <Card
                key={member.id}
                className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row h-full">
                  <div className="relative w-full sm:w-1/3 h-64 sm:h-auto">
                    {member.image ? (
                      <Image
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        className="object-cover"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 33vw, 25vw"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <span className="text-base sm:text-lg text-[#282828]">
                          No Image
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-4 sm:p-6 flex flex-col justify-center">
                    <CardHeader className="p-0 pb-2 sm:pb-3">
                      <CardTitle className="text-xl md:text-2xl font-bold">
                        {member.name}
                      </CardTitle>
                      <p className="text-base mt-1 text-[#282828]">
                        {member.role}
                      </p>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-base leading-relaxed text-[#282828]">
                        {member.description}
                      </p>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
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
