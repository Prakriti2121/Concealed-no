import EnglishContent from "./components/EnglishContent";
import { breadcrumbSchemaGenerator, organizationSchema } from "@/app/utils/schemaUtils";
import { getRobotsString } from "@/lib/seo-config";

// Dynamically fetch metadata on the server
export async function generateMetadata() {
  // Build an absolute URL using an environment variable or default to localhost.
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/in-english`, {
    cache: "no-cache",
  });
  const data = await res.json();

  
  const canonicalUrl = data.canonicalUrl && data.canonicalUrl.trim() !== "" 
    ? data.canonicalUrl 
    : `${baseUrl}/in-english`;

  return {
    metadataBase: new URL(baseUrl),
    title: data.seoTitle || data.title,
    description:
      data.metaDesc ||
      "Learn about Concealed Wines, an established wine and spirit importer in the Swedish market.",
    robots: getRobotsString(),
    alternates: {
      canonical: canonicalUrl,
    },
    authors: [{ name: "Concealed Wines" }],
    publisher: "Concealed Wines",
  };
}

const InEnglishPage = () => {
  // Generate breadcrumb schema
  const breadcrumbs = breadcrumbSchemaGenerator([
    {
      name: "In English",
      url: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.cwno.vittvin.nu"
      }/in-english`,
    },
  ]);

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
      <div>
        <EnglishContent />
      </div>
    </>
  );
};

export default InEnglishPage;
