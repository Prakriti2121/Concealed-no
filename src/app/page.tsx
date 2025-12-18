import AboutUs from "@/components/molecules/AboutUs";
import BannerSection from "@/components/molecules/BannerSection";
import OurWines from "@/components/molecules/OurWines";
import FeaturedProduct from "@/components/organisms/FeaturedProduct";
import Jumbotron from "@/components/organisms/Jumbotron";
import { Metadata } from "next";
import { breadcrumbSchemaGenerator, organizationSchema } from "@/app/utils/schemaUtils";
import { getRobotsString } from "@/lib/seo-config";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
export async function generateMetadata(): Promise<Metadata> {
  const resSeo = await fetch(`${baseUrl}/api/etusivu`, { cache: "no-cache" });
  const data = await resSeo.json();

  const canonicalUrl = data.canonicalUrl && data.canonicalUrl.trim() !== ""
    ? data.canonicalUrl
    : baseUrl;

  return {
    metadataBase: new URL(baseUrl),
    title: data.seoTitle || data.title,
    description:
      data.metaDesc || "Welcome to Concealed Wines Finland homepage!",
    robots: getRobotsString(),
    alternates: {
      canonical: canonicalUrl,
    },
    authors: [{ name: "Concealed Wines" }],
    publisher: "Concealed Wines",
  };
}

export default async function Home() {
  // Fetch About Us data
  const resAbout = await fetch(`${baseUrl}/api/meista`, { cache: "no-cache" });
  const aboutUsData = await resAbout.json();

  // Fetch Our Wines data
  const resWines = await fetch(`${baseUrl}/api/meidan-viinit`, {
    cache: "no-cache",
  });
  const ourWinesData = await resWines.json();

  const breadcrumbs = breadcrumbSchemaGenerator([]);
  const organization = organizationSchema();

  return (
    <div className="overflow-x-hidden w-full max-w-full">
      <script
        type="application/ld+json"
        className="yoast-schema-graph"
        dangerouslySetInnerHTML={{ __html: breadcrumbs }}
      />
      <script
        type="application/ld+json"
        className="yoast-schema-graph"
        dangerouslySetInnerHTML={{ __html: organization }}
      />
      <h1 className="sr-only">Concealed Wines Finland</h1>
      <BannerSection />
      <Jumbotron />
      <FeaturedProduct />
      <div className="mt-24 sm:mt-32 md:mt-40">
        <div>
          <AboutUs data={aboutUsData} />
        </div>
        <div className="mt-24 sm:mt-32 md:mt-40">
          <OurWines data={ourWinesData} />
        </div>
      </div>
    </div>
  );
}
