"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import BreadCrumb from "../../components/breadcrumb/breadcrumb";
import SidebarContent from "../../components/sidebarcontent";

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

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
    <rect width='100%' height='100%' fill='#f3f4f6'/>
    <circle cx='100' cy='75' r='30' fill='#6b7280' opacity='0.3'/>
    <path d='M50 150 Q50 140 60 140 L140 140 Q150 140 150 150 L150 160 Q150 170 140 170 L60 170 Q50 170 50 160 Z' fill='#6b7280' opacity='0.3'/>
    </svg>`,
  );

export function TeamContent() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeamMembers() {
      try {
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
          <div className="h-6 w-64 bg-secondary rounded-md animate-pulse mb-4" />
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="w-full lg:flex-1">
              <div className="space-y-8 md:space-y-12">
                {[1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center gap-6 py-6 sm:gap-8 md:gap-10 md:py-8 ${
                      index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                    }`}
                  >
                    <div className="shrink-0">
                      <div className="h-32 w-32 sm:h-36 sm:w-36 md:h-40 md:w-40 rounded-full bg-secondary animate-pulse" />
                    </div>
                    <div className="flex-1 space-y-3 text-center lg:text-left">
                      <div className="h-7 bg-secondary rounded-md w-3/5 animate-pulse" />
                      <div className="h-5 bg-secondary rounded-md w-2/5 animate-pulse mt-1" />
                      <div className="space-y-2 mt-4">
                        <div className="h-4 bg-secondary rounded-md w-full animate-pulse" />
                        <div className="h-4 bg-secondary rounded-md w-full animate-pulse" />
                        <div className="h-4 bg-secondary rounded-md w-4/5 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
            Feil: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
        <BreadCrumb title1="Vårt team" />
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="w-full lg:flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[1.75rem] font-bold mb-6 text-center lg:text-left text-[#1D2939]">
              Vårt team
            </h1>
            
            <div className="space-y-8 md:space-y-12">
              {teamMembers.map((member, index) => {
                const src = member.image || PLACEHOLDER;

                return (
                  <div
                    key={member.id}
                    className={`group flex flex-col items-center gap-6 py-6 sm:gap-8 md:gap-10 md:py-8 ${
                      index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                    }`}
                  >
                    {/* Profile Image Section */}
                    <div className="shrink-0">
                      <div className="h-32 w-32 overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-105 sm:h-36 sm:w-36 md:h-40 md:w-40">
                        <Image
                          src={src}
                          alt={member.name}
                          width={160}
                          height={160}
                          sizes="(max-width: 640px) 128px, (max-width: 768px) 144px, 160px"
                          className="h-full w-full object-cover"
                          priority={index < 2}
                        />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 space-y-3 text-center lg:text-left">
                      {/* Name and Role */}
                      <div className="space-y-1">
                        <h2 className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl dark:text-white">
                          {member.name}
                        </h2>
                        {member.role && (
                          <p className="text-base text-[#282828] dark:text-gray-400">
                            {member.role}
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      {member.description && (
                        <div className="max-w-2xl">
                          <p className="text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-400">
                            {member.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Separator Line */}
                    {index < teamMembers.length - 1 && (
                      <div className="absolute bottom-0 left-1/2 h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-200 to-transparent sm:w-32 md:w-48 dark:via-gray-700" />
                    )}
                  </div>
                );
              })}
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
