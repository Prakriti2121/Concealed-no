"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

interface ProductImageZoomProps {
  src: string;
  alt: string;
}

export default function ProductImageZoom({ src, alt }: ProductImageZoomProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [containerHeight, setContainerHeight] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (imageRef.current) {
      setContainerHeight(imageRef.current.offsetHeight);
    }
  };

  return (
    <>
      <div className="relative">
        <div
          ref={imageRef}
          className="bg-gray-50 rounded-lg p-6 flex items-start justify-center border border-gray-200 cursor-crosshair"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
        >
          <div className="w-full max-w-[240px]">
            <Image
              src={src}
              alt={alt}
              width={240}
              height={480}
              className="object-contain w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>

      {isHovering && (
        <div
          className="hidden lg:block absolute left-full ml-6 top-0 w-[calc(200%-1.5rem)] bg-white border-2 border-[#e0944e] rounded-lg shadow-2xl z-[100] overflow-hidden"
          style={{ height: `${containerHeight}px` }}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Zoom indicator badge */}
          <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1.5 rounded-lg text-xs font-medium z-10 flex items-center gap-1.5 shadow-lg">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
              />
            </svg>
            Zoomed View
          </div>

          {/* Zoomed image */}
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: "150%",
              backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
              backgroundRepeat: "no-repeat",
              imageRendering: "crisp-edges",
            }}
          />

          {/* Crosshair indicator */}
          <div
            className="absolute w-0.5 h-10 bg-[#e0944e]/60 pointer-events-none shadow-sm"
            style={{
              left: `${mousePosition.x}%`,
              top: `${mousePosition.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            className="absolute w-10 h-0.5 bg-[#e0944e]/60 pointer-events-none shadow-sm"
            style={{
              left: `${mousePosition.x}%`,
              top: `${mousePosition.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      )}
    </>
  );
}
