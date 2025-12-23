import { ProfileContent } from "./components/ProfileContent";
import { breadcrumbSchemaGenerator, organizationSchema } from "@/app/utils/schemaUtils";
import { aboutSchema } from "../../utils/constants";
import { getRobotsString } from "@/lib/seo-config";

// This function runs on the server and dynamically generates metadata
export async function generateMetadata() {
  // Construct an absolute URL using an environment variable or default to localhost.
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/yrityksen-profiili`, {
    cache: "no-cache",
  });

  const data = await res.json();

  
  const canonicalUrl = data.canonicalUrl && data.canonicalUrl.trim() !== "" 
    ? data.canonicalUrl 
    : `${baseUrl}/yrityksen-profiili`;

  return {
    metadataBase: new URL(baseUrl),
    title: data.seoTitle || data.title,
    description: data.metaDesc,
    robots: getRobotsString(),
    alternates: {
      canonical: canonicalUrl,
    },
    authors: [{ name: "Concealed Wines" }],
    publisher: "Concealed Wines",
  };
}

const SelskapProfilePage = () => {
  // Generate breadcrumb schema
  const breadcrumbs = breadcrumbSchemaGenerator([
    {
      name: "Selskapsprofil",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/yrityksen-profiili`,
    },
  ]);

  // Generate organization schema
  const organization = organizationSchema();

  // Convert aboutSchema to JSON string
  const aboutSchemaJson = JSON.stringify(aboutSchema);
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
        dangerouslySetInnerHTML={{ __html: aboutSchemaJson }}
      />
      <div>
        <ProfileContent />
      </div>
    </>
  );
};

export default SelskapProfilePage;
