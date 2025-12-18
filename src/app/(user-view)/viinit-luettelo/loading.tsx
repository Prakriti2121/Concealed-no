import React from "react";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title skeleton */}
      <div className="h-10 w-48 bg-secondary rounded-md animate-pulse mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Generate 9 wine card skeletons to match PRODUCTS_PER_PAGE */}
        {Array(9)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden shadow-md"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image placeholder */}
                <div className="w-full md:w-1/3 flex justify-center items-center p-4 bg-white">
                  <div className="relative h-48 w-32">
                    <div className="h-full w-full bg-secondary rounded-md animate-pulse" />
                  </div>
                </div>

                {/* Details placeholder */}
                <div className="w-full md:w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    {/* Title skeleton */}
                    <div className="h-6 bg-secondary rounded-md w-4/5 animate-pulse mb-2" />
                    {/* Product code skeleton */}
                    <div className="h-4 bg-secondary rounded-md w-1/3 animate-pulse mb-1" />
                  </div>

                  <div className="mt-4">
                    {/* Price skeleton */}
                    <div className="h-7 bg-secondary rounded-md w-1/4 animate-pulse mb-2" />

                    <div className="flex flex-col space-y-2">
                      {/* Button skeleton */}
                      <div className="h-10 bg-secondary rounded-md w-full animate-pulse" />

                      {/* Availability text skeleton */}
                      <div className="h-4 bg-secondary rounded-md w-3/4 animate-pulse mt-2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-center items-center space-x-4 mt-8">
        <div className="h-8 w-20 bg-secondary rounded-md animate-pulse" />
        <div className="h-5 w-28 bg-secondary rounded-md animate-pulse" />
        <div className="h-8 w-20 bg-secondary rounded-md animate-pulse" />
      </div>
    </div>
  );
}
