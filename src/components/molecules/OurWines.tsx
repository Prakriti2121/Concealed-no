"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/components/atoms/Container";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import Link from "next/link";

interface OurWinesProps {
  data: {
    title: string;
    content: string;
    featuredImage: string;
    canonicalUrl: string;
  };
}

const OurWines: React.FC<OurWinesProps> = ({ data }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <Container>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className={`w-full ${
          isDesktop ? "grid grid-cols-2 items-center" : "flex flex-col"
        } gap-12`}
      >
        {/* Text section */}
        <motion.div
          variants={fadeInUp}
          className={`${isDesktop ? "order-1" : "order-2"} space-y-6`}
        >
          <h2 className="text-4xl md:text-5xl font-bold relative text-[#1D2939]">
            {data.title || "Våre viner"}
            <span className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary/5 text-7xl md:text-8xl font-bold">
              {data.title || "Viner"}
            </span>
          </h2>

          <div className="space-y-6 text-lg relative text-[#282828]">
            {data.content && (
              <div dangerouslySetInnerHTML={{ __html: data.content }} />
            )}
            {/* Decorative element */}
            <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-primary/5 rounded-full blur-xl"></div>
          </div>

          <div className="pt-4">
            <Link href="./viinit-luettelo">
              <Button className="relative overflow-hidden bg-[#09090B] text-xl px-6 py-3 h-full text-white border border-transparent group transition-all duration-300 ease-in-out hover:border-black">
                <span className="relative z-10 transition-all duration-300 ease-in-out group-hover:text-black">
                  Les mer
                </span>
                <span className="absolute left-0 top-0 w-0 h-full bg-white transition-all duration-500 ease-in-out group-hover:w-full"></span>
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Image section */}
        <motion.div
          variants={fadeInUp}
          className={`${isDesktop ? "order-2" : "order-1"}`}
        >
          <div className="relative overflow-hidden rounded-[40px] shadow-lg">
            <Image
              src={data.featuredImage || "/images/barrels.jpg"}
              alt="Våre viner"
              width={500}
              height={500}
              className="w-full aspect-square object-cover transform hover:scale-105 transition-transform duration-700"
            />
            {/* Wine glass decorative element */}
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/30 rounded-full"></div>
            </div>
            {/* Decorative element */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
          </div>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default OurWines;
