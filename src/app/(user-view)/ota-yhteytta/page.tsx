import { ContactContent } from "./components/ContactContent";
import { breadcrumbSchemaGenerator, organizationSchema } from "@/app/utils/schemaUtils";
import { getRobotsString } from "@/lib/seo-config";

// Dynamically fetch metadata on the server
export async function generateMetadata() {
  // Use an absolute URL for the internal API route
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = new URL("/api/ota-yhteytta", baseUrl);
  const res = await fetch(url.href, { cache: "no-cache" });
  const data = await res.json();


  const canonicalUrl = data.canonicalUrl && data.canonicalUrl.trim() !== "" 
    ? data.canonicalUrl 
    : `${baseUrl}/ota-yhteytta`;

  return {
    metadataBase: new URL(baseUrl),
    title: data.seoTitle || "Ota yhteyttä - Concealed Wines Finland",
    description:
      data.metaDesc || "Ta kontakt med Concealed Wines. Vi er her for å hjelpe!",
    robots: getRobotsString(),
    alternates: {
      canonical: canonicalUrl,
    },
    authors: [{ name: "Concealed Wines" }],
    publisher: "Concealed Wines",
  };
}

const KontaktOssPage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // Generate breadcrumb schema
  const breadcrumbs = breadcrumbSchemaGenerator([
    {
      name: "Ota yhteyttä",
      url: `${baseUrl}/ota-yhteytta`,
    },
  ]);

  // Create contact page specific schema
  const contactSchema = {
    "@context": "http://schema.org/",
    "@type": "Organization",
    name: "Concealed Wines",
    logo: `${baseUrl}/concealedlogo.webp`,
    url: baseUrl,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+46 8 410 244 34",
      contactType: "customer service",
      areaServed: ["SE", "NO", "FI"],
      availableLanguage: ["Swedish", "Norwegian", "Finnish", "English"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ste Bergmans gata 14",
      addressLocality: "Stockholm",
      addressRegion: "Stockholms län",
      postalCode: "115 50",
      addressCountry: "SE",
    },
    sameAs: [
      "https://www.linkedin.com/company/concealed-wines/",
      "https://x.com/ConcealedWines",
      "https://m.facebook.com/concealed-wines",
    ],
    location: [
      {
        "@type": "Place",
        name: "Concealed Wines AB - Sweden",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Ste Bergmans gata 14",
          addressLocality: "Stockholm",
          postalCode: "115 50",
          addressCountry: "Sweden",
        },
        telephone: "+46 8 410 244 34",
      },
      {
        "@type": "Place",
        name: "Concealed Wines NUF - Norway",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Ulvenveien 88 c/o Kregevold Smith",
          addressLocality: "Oslo",
          postalCode: "0581",
          addressCountry: "Norway",
        },
      },
      {
        "@type": "Place",
        name: "Concealed Wines OY - Finland",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Närpiöntien 25 c/o Best bokföring",
          addressLocality: "Närpes",
          postalCode: "64200",
          addressCountry: "Finland",
        },
      },
    ],
  };

  // Generate organization schema
  const organization = organizationSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbs }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: organization }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <div>
        <ContactContent />
      </div>
    </>
  );
};

export default KontaktOssPage;
