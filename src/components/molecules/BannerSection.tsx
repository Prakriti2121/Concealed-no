"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Simplified interfaces
interface BannerItem {
  id: number;
  image: string;
}

interface FeaturedProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  largeImage: string;
  link: string | undefined;
}

export default function SimplifiedBannerSection() {
  const [, setBannerItems] = useState<BannerItem[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [selectedBanner, setSelectedBanner] = useState<BannerItem | null>(null);

  // Fetch banners and featured products once on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const timestamp = new Date().getTime();
        const bannerResponse = await fetch(`/api/banners?t=${timestamp}`);
        if (bannerResponse.ok) {
          const banners: BannerItem[] = await bannerResponse.json();
          setBannerItems(banners);

          if (banners.length > 0) {
            const randomIndex = Math.floor(Math.random() * banners.length);
            setSelectedBanner(banners[randomIndex]);
          }
        } else {
          console.error("Failed to fetch banners");
        }

        const productResponse = await fetch("/api/products");
        if (productResponse.ok) {
          const products: FeaturedProduct[] = await productResponse.json();
          setFeaturedProducts(products);
        } else {
          console.error("Failed to fetch featured products");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Auto-slide setup for featured products
  useEffect(() => {
    if (featuredProducts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentProductIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  if (isLoading) {
    return (
      <section className="relative w-full h-[40vh] sm:h-[42vh] md:h-[45vh] lg:h-[50vh] xl:h-[55vh] overflow-hidden bg-gray-400">
        {/* Skeleton dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-450 via-gray-350 to-gray-450 animate-pulse" />

        <div className="absolute inset-0 z-10">
          <div className="w-full h-full mx-auto px-3 sm:px-4 md:px-6 flex items-center max-w-7xl">
            <div className="w-full flex flex-col md:flex-row items-center justify-center md:gap-4 lg:gap-6">
              {/* Skeleton Product Image */}
              <div className="w-full md:w-2/5 flex justify-center order-1 md:order-1 mb-4 sm:mb-5 md:mb-0 mt-4 sm:mt-5 md:mt-0">
                <div className="relative">
                  <div className="relative h-[140px] w-[120px] xs:h-[160px] xs:w-[140px] sm:h-[180px] sm:w-[160px] md:h-[260px] md:w-[220px] lg:h-[300px] lg:w-[240px] xl:h-[340px] xl:w-[260px] bg-gray-300 rounded-md animate-pulse">
                    {/* Pulsing glow effect */}
                    <div className="absolute inset-0 -z-10 bg-gray-250/30 rounded-full blur-2xl sm:blur-3xl scale-90 opacity-70 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Skeleton Product Information */}
              <div className="w-full md:w-1/2 space-y-2 xs:space-y-2.5 sm:space-y-3 md:space-y-5 text-center md:text-left order-2 md:order-2">
                {/* Title skeleton */}
                <div className="h-6 xs:h-7 sm:h-8 md:h-10 lg:h-12 bg-gray-300 rounded-md w-3/4 mx-auto md:mx-0 animate-pulse" />

                {/* Description skeleton - multiple lines */}
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="h-3 xs:h-4 sm:h-5 bg-gray-300 rounded-md w-full animate-pulse" />
                  <div className="h-3 xs:h-4 sm:h-5 bg-gray-300 rounded-md w-5/6 animate-pulse" />
                  <div className="h-3 xs:h-4 sm:h-5 bg-gray-300 rounded-md w-2/3 animate-pulse hidden sm:block" />
                </div>

                {/* Price and button skeleton */}
                <div className="flex flex-row items-center gap-3 xs:gap-4 sm:gap-5 md:gap-6 justify-center md:justify-start pt-1 sm:pt-2">
                  <div className="h-6 xs:h-7 sm:h-8 md:h-9 lg:h-10 bg-gray-300 rounded-md w-16 xs:w-20 sm:w-24 md:w-28 animate-pulse" />
                  <div className="h-8 xs:h-9 sm:h-10 md:h-11 bg-gray-300 rounded-md w-20 xs:w-24 sm:w-28 md:w-32 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton Slide Indicators */}
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-5 left-0 right-0 z-20 flex justify-center space-x-1.5 sm:space-x-2">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-300 w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!selectedBanner || featuredProducts.length === 0) {
    return (
      <section className="relative w-full h-[30vh] sm:h-[35vh] md:h-[40vh] flex items-center justify-center bg-gray-50">
        <p className="text-sm sm:text-base text-gray-200 font-medium px-4 text-center">
          No banner or featured products available
        </p>
      </section>
    );
  }

  // Current product
  const currentProduct = featuredProducts[currentProductIndex];

  return (
    <section className="relative w-full h-[40vh] sm:h-[42vh] md:h-[45vh] lg:h-[50vh] xl:h-[55vh] overflow-hidden">
      {/* Banner Background with Darker Overlay */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.03 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
      >
        <Image
          src={selectedBanner.image ?? "/placeholder.svg"}
          alt="Banner background"
          fill
          className="object-cover object-center brightness-[0.85]"
          priority
          quality={90}
          sizes="100vw"
        />
        {/* Darker Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/75 to-black/85" />
      </motion.div>

      {/* Content Container */}
      <div className="absolute inset-0 z-10">
        <div className="w-full h-full mx-auto px-3 sm:px-4 md:px-6 flex items-center max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col md:flex-row items-center justify-center md:gap-4 lg:gap-6"
            >
              {/* Product Image Section */}
              <div className="w-full md:w-2/5 flex justify-center order-1 md:order-1 mb-4 sm:mb-5 md:mb-0 mt-4 sm:mt-5 md:mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="relative"
                >
                  <div className="relative h-[140px] w-[120px] xs:h-[160px] xs:w-[140px] sm:h-[180px] sm:w-[160px] md:h-[260px] md:w-[220px] lg:h-[300px] lg:w-[240px] xl:h-[340px] xl:w-[260px]">
                    <Image
                      src={currentProduct.largeImage ?? "/placeholder.svg"}
                      alt={currentProduct.title ?? "Featured product"}
                      fill
                      style={{ objectFit: "contain" }}
                      className="drop-shadow-2xl"
                      priority
                      sizes="(max-width: 768px) 140px, (max-width: 1024px) 220px, 260px"
                    />
                    {/* Enhanced glow effect behind product */}
                    <div className="absolute inset-0 -z-10 bg-white/15 rounded-full blur-2xl sm:blur-3xl scale-90 opacity-70" />
                  </div>
                </motion.div>
              </div>

              {/* Product Information Section */}
              <div className="w-full md:w-1/2 space-y-2 xs:space-y-2.5 sm:space-y-3 md:space-y-5 text-center md:text-left order-2 md:order-2">
                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight line-clamp-2"
                >
                  {currentProduct.title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-base md:text-lg text-white/90 line-clamp-2 sm:line-clamp-3 max-w-xl px-2 sm:px-0"
                >
                  {currentProduct.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex flex-row items-center gap-3 xs:gap-4 sm:gap-5 md:gap-6 justify-center md:justify-start pt-1 sm:pt-2"
                >
                  <p className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white">
                    €{currentProduct.price}
                  </p>
                  <Link
                    href={currentProduct.link ?? "#"}
                    className="bg-white text-black px-4 xs:px-5 sm:px-6 py-1.5 xs:py-2 sm:py-2.5 text-xs xs:text-sm sm:text-base rounded-md hover:bg-white/90 transition-all duration-300 font-medium shadow-lg"
                  >
                    Osta nyt
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-5 left-0 right-0 z-20 flex justify-center space-x-1.5 sm:space-x-2">
        {featuredProducts.map((_, index) => (
          <button
            key={index}
            className={`transition-all duration-300 rounded-full ${
              index === currentProductIndex
                ? "bg-white w-4 sm:w-5 md:w-6 h-1.5 sm:h-2"
                : "bg-white/40 w-1.5 sm:w-2 h-1.5 sm:h-2 hover:bg-white/60"
            }`}
            onClick={() => setCurrentProductIndex(index)}
            aria-label={`Go to product ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
