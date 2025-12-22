"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

// swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

interface Product {
  id: number;
  title: string;
  price: number;
  largeImage: string;
  slug: string;
}

const FeaturedProduct = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Use relative URL for client-side fetching
        const response = await fetch('/api/featured-products?skip=1&take=6', {
          cache: 'no-store'
        });
        if (!response.ok) throw new Error("Failed to fetch products");
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err: unknown) {
        console.error("Error fetching products:", err);
        if (err instanceof Error) {
          setError(err.message || "Failed to load products");
        } else {
          setError("Failed to load products");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-12 sm:py-20 text-center">
        <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-8 text-[#1D2939]">
          Kunnianhimoinen viinin maahantuoja
        </div>

        <div className="flex justify-center mb-8">
          <span className="text-lg sm:text-xl md:text-2xl border-b border-black inline-block mt-2 sm:mt-4 text-[#282828]">
            Laatu on tärkeämpää kuin määrä
          </span>
        </div>

        {/* Improved Skeleton Swiper that better matches the final layout */}
        <div className="relative py-8 sm:py-12">
          <div className="flex justify-center items-center">
            {/* Left bottle (faded) */}
            <div className="hidden sm:block relative mx-4 transform scale-75 opacity-50">
              <div className="bg-gray-200 h-60 sm:h-72 md:h-96 w-24 sm:w-32 md:w-40 rounded-md animate-pulse mx-auto"></div>
            </div>

            {/* Center bottle (active) */}
            <div className="relative mx-4 z-10">
              <div className="bg-gray-200 h-60 sm:h-72 md:h-96 w-36 sm:w-40 md:w-48 rounded-md animate-pulse mx-auto"></div>
              <div className="mt-4 text-center w-full">
                <div className="bg-gray-200 h-6 w-full rounded mb-2 animate-pulse"></div>
                <div className="bg-gray-200 h-5 w-1/2 mx-auto rounded animate-pulse"></div>
              </div>
            </div>

            {/* Right bottle (faded) */}
            <div className="hidden sm:block relative mx-4 transform scale-75 opacity-50">
              <div className="bg-gray-200 h-60 sm:h-72 md:h-96 w-24 sm:w-32 md:w-40 rounded-md animate-pulse mx-auto"></div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0">
            <ChevronLeft className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12" />
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0">
            <ChevronRight className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12" />
          </div>
        </div>

        <div className="mt-6">
          <div className="inline-block bg-gray-200 text-transparent px-6 py-2 rounded-3xl animate-pulse">
            Vis alle viner
          </div>
        </div>

        <style jsx>{`
          @keyframes pulse {
            0%,
            100% {
              opacity: 0.6;
            }
            50% {
              opacity: 0.8;
            }
          }
          .animate-pulse {
            animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-12 sm:py-20 text-center">
        <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-8 text-[#1D2939]">
          Kunnianhimoinen viinin maahantuoja
        </div>
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-12 sm:py-20 text-center">
        <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-8 text-[#1D2939]">
          Kunnianhimoinen viinin maahantuoja
        </div>
        <div className="text-lg text-[#282828]">
          Viner er for øyeblikket ikke tilgjengelige.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
      <div className="mt-20 sm:mt-28 md:mt-40">
        <motion.div
          className="text-3xl sm:text-4xl md:text-5xl text-center font-bold text-[#1D2939]"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          Kunnianhimoinen viinin maahantuoja
        </motion.div>
        <div className="flex justify-center text-center">
          <motion.div
            className="text-lg sm:text-xl md:text-2xl border-b border-black inline-block mt-4 sm:mt-6 text-[#282828]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            Laatu on tärkeämpää kuin määrä
          </motion.div>
        </div>
      </div>

      <div
        className="relative py-8 sm:py-12"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView={1.5}
          spaceBetween={10}
          breakpoints={{
            480: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          loop={products.length > 3}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: false,
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          modules={[EffectCoverflow, Autoplay, Navigation]}
          className="wine-swiper"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              {({ isActive }) => (
                <div className="flex flex-col items-center">
                  <div
                    className={`transform transition-all duration-500 ${
                      isActive ? "scale-100" : "scale-75 opacity-50"
                    }`}
                  >
                    <div className="relative group">
                      <Link
                        href={`/viineja-luettelo/viinit/${product.slug}`}
                        className="flex justify-center"
                      >
                        <Image
                          src={
                            product.largeImage ||
                            "/placeholder.svg?height=400&width=300"
                          }
                          alt={product.title}
                          width={300}
                          height={400}
                          className={`object-contain h-60 sm:h-72 md:h-96 transition-transform duration-500 ${
                            isActive ? "group-hover:scale-105" : ""
                          }`}
                        />
                      </Link>
                    </div>
                  </div>
                  <div
                    className={`mt-8 transform transition-all duration-500 text-center w-full ${
                      isActive
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-4 opacity-0"
                    }`}
                  >
                    <h3 className="text-xl md:text-2xl font-bold line-clamp-2 text-[#1D2939]">
                      {product.title}
                    </h3>
                    <p className="text-lg md:text-xl mt-2 text-[#282828]">
                      €{product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button
          className={`swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          }`}
        >
          <ChevronLeft className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12" />
        </button>
        <button
          className={`swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
          }`}
        >
          <ChevronRight className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12" />
        </button>
      </div>

      <div className="flex justify-center mt-2 sm:mt-3">
        <Link
          href="/viinit-luettelo"
          className="text-base sm:text-lg md:text-xl text-center inline-block bg-black text-white px-4 sm:px-6 py-2 rounded-3xl hover:bg-white hover:text-black hover:border border-black hover:scale-90 transition-all duration-300 ease-in-out"
        >
          Vis alle viner
        </Link>
      </div>

      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: black;
        }
        .wine-swiper {
          padding: 2rem 0;
        }
        .swiper-slide {
          transition: all 0.3s ease;
          display: flex;
          justify-content: center;
        }
        .swiper-slide-active {
          z-index: 1;
        }

        @media (max-width: 640px) {
          .swiper-button-next:after,
          .swiper-button-prev:after {
            display: none;
          }
        }
      `}</style>
      </div>
    </div>
  );
};

export default FeaturedProduct;
