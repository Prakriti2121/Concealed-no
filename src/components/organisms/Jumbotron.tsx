"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

interface Product {
  id: number;
  title: string;
  price: number;
  largeImage: string;
  taste?: string;
  slug: string;
}

const Jumbotron = () => {
  const router = useRouter();
  const [latestProduct, setLatestProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestProduct = async () => {
      try {
        setIsLoading(true);
        // Use relative URL for client-side fetching
        const res = await fetch('/api/featured-products?take=1', {
          cache: 'no-store'
        });
        if (!res.ok) throw new Error("Failed to fetch product");
        const products: Product[] = await res.json();
        if (products.length) {
          setLatestProduct(products[0]);
        }
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
          setError(err.message || "Error fetching product");
        } else {
          setError("Error fetching product");
        }
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    };
    fetchLatestProduct();
  }, []);

  const handleReadMore = () => {
    if (latestProduct) {
      router.push(`/viineja-luettelo/viinit/${latestProduct.slug}`);
    }
  };

  return (
    <div className="w-full max-w-full flex items-center px-4 sm:px-6 py-6 sm:py-8 overflow-hidden">
      {isLoading ? (
        <div className="w-full grid md:grid-cols-2 items-center gap-6 md:gap-8">
          {/* Left side skeleton - Title, Description, Button */}
          <div className="z-10 order-2 md:order-1 space-y-4 sm:space-y-6">
            {/* Title skeleton */}
            <div className="space-y-2">
              <div className="h-8 sm:h-10 md:h-12 lg:h-14 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
              <div className="h-8 sm:h-10 md:h-12 lg:h-14 bg-gray-200 rounded-md w-1/2 animate-pulse"></div>
            </div>

            {/* Description skeleton */}
            <div className="space-y-2 my-3 sm:my-4 md:my-6 lg:my-8">
              <div className="h-3 sm:h-4 bg-gray-200 rounded-md w-full animate-pulse"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded-md w-11/12 animate-pulse"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded-md w-full animate-pulse"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
            </div>

            {/* Button skeleton */}
            <div className="h-10 sm:h-12 md:h-14 bg-gray-200 rounded-md w-32 sm:w-36 md:w-40 animate-pulse"></div>
          </div>

          {/* Right side skeleton - Wine bottle image */}
          <div className="-z-10 order-1 md:order-2 flex justify-center items-center mt-6 md:mt-0">
            <div className="transform-gpu">
              <div className="animate-pulse bg-gray-200 w-24 sm:w-28 md:w-44 lg:w-56 xl:w-64 h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px]"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 items-center gap-6 md:gap-8 w-full">
          <div className="z-10 order-2 md:order-1 space-y-4 sm:space-y-6">
            {error ? (
              <p className="text-xl text-red-500">Feil: {error}</p>
            ) : latestProduct ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1D2939]"
                >
                  {latestProduct.title}
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="my-3 sm:my-4 md:my-6 lg:my-8 text-base sm:text-lg md:text-xl text-[#282828]"
                >
                  {latestProduct.taste}
                </motion.p>
                <Button
                  onClick={handleReadMore}
                  className="relative overflow-hidden bg-[#09090B] text-base sm:text-lg md:text-xl px-3 sm:px-4 py-2 h-full text-white border border-transparent group transition-all duration-300 ease-in-out hover:border-black"
                >
                  <span className="relative z-10 transition-all duration-300 ease-in-out group-hover:text-black">
                    Les mer
                  </span>
                  <span className="absolute left-0 top-0 w-0 h-full bg-white transition-all duration-500 ease-in-out group-hover:w-full"></span>
                </Button>
              </>
            ) : (
              // Fallback static content
              <>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1D2939]"
                >
                  Bertrand Machard de Gramont Nuits-saint-Georges Les Terrasses
                  des Vallerots 2014
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="my-3 sm:my-4 md:my-6 lg:my-8 text-xs sm:text-sm md:text-base text-[#282828]"
                >
                  Bæraktige og friske rødviner er lette eller middels fyldig viner
                  fylt med smaken og aktiviteten av friske bær. Du kan skjelne
                  tydelige tyttebær-, bringebær- og kirsebærtoner i
                  disse vinene. Sprø friskhet gjør dem ideelle til en rekke
                  matretter.
                </motion.p>
                <Button
                  onClick={() => router.push("/viineja-luettelo/viinit/default-slug")}
                  className="relative overflow-hidden bg-[#09090B] text-base sm:text-lg md:text-xl px-3 sm:px-4 py-2 h-full text-white border border-transparent group transition-all duration-300 ease-in-out hover:border-black"
                >
                  <span className="relative z-10 transition-all duration-300 ease-in-out group-hover:text-black">
                    Les mer
                  </span>
                  <span className="absolute left-0 top-0 w-0 h-full bg-white transition-all duration-500 ease-in-out group-hover:w-full"></span>
                </Button>
              </>
            )}
          </div>
          <div className="-z-10 order-1 md:order-2 flex justify-center items-center mt-6 md:mt-0">
            <div className="rotate-[30deg] transform-gpu">
              {latestProduct ? (
                <Image
                  src={latestProduct.largeImage || "/placeholder.svg"}
                  width={250}
                  height={250}
                  alt={latestProduct.title}
                  className="animate-floating cursor-pointer w-24 sm:w-28 md:w-44 lg:w-56 xl:w-64 h-auto"
                />
              ) : (
                <Image
                  src="/images/wine-header.webp"
                  width={500}
                  height={500}
                  alt="Header Wine"
                  className="animate-floating cursor-pointer w-24 sm:w-28 md:w-44 lg:w-56 xl:w-64 h-auto"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jumbotron;
