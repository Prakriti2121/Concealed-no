"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/components/atoms/Container";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import Link from "next/link";

interface AboutUsProps {
  data: {
    title: string;
    seoTitle: string;
    content: string;
    featuredImage: string;
    canonicalUrl: string;
  };
}

const AboutUs: React.FC<AboutUsProps> = ({ data }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

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
        id="about"
        viewport={{ once: true, margin: "-100px" }}
        className={`w-full ${
          isDesktop ? "grid grid-cols-2 items-center" : "flex flex-col"
        } gap-12`}
      >
        {/* Image section */}
        <motion.div
          variants={fadeInUp}
          className={`${isDesktop ? "order-1" : "order-1"}`}
        >
          <div className="relative overflow-hidden rounded-[40px] shadow-lg">
            <Image
              src={data.featuredImage || "/images/placeholder.jpg"}
              alt="Om oss"
              width={500}
              height={500}
              className="w-full aspect-square object-cover transform hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
          </div>
        </motion.div>

        {/* Text section */}
        <motion.div
          variants={fadeInUp}
          className={`${isDesktop ? "order-2" : "order-2"} space-y-6`}
        >
          <h2 className="text-4xl md:text-5xl font-bold relative text-[#1D2939]">
            {data.title || "Om oss"}
            <span className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary/5 text-7xl md:text-8xl font-bold">
              {data.title || "OM"}
            </span>
          </h2>

          <div className="space-y-6 text-lg relative text-[#282828]">
            {/* Render content as HTML */}
            {data.content && (
              <div dangerouslySetInnerHTML={{ __html: data.content }} />
            )}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl"></div>
          </div>

          <div className="pt-4">
            <Link href="/yrityksen-profiili">
              <Button className="relative overflow-hidden bg-[#09090B] text-xl px-6 py-3 h-full text-white border border-transparent group transition-all duration-300 ease-in-out hover:border-black">
                <span className="relative z-10 transition-all duration-300 ease-in-out group-hover:text-black">
                  Les mer
                </span>
                <span className="absolute left-0 top-0 w-0 h-full bg-white transition-all duration-500 ease-in-out group-hover:w-full"></span>
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default AboutUs;
