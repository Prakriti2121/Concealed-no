"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductImageZoomProps {
  src: string;
  alt: string;
}

export default function ProductImageZoom({ src, alt }: ProductImageZoomProps) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center overflow-hidden relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      <Image
        src={src}
        alt={alt}
        width={500}
        height={1000}
        className="object-contain w-full h-full transition-all duration-300 ease-out"
        style={{
          transform: isHovering ? "scale(1.5)" : "scale(1)",
          transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
        }}
        priority
      />
    </div>
  );
}
