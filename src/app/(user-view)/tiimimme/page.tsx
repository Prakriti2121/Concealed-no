import { TeamContent } from "./components/TeamContent";
import { breadcrumbSchemaGenerator, organizationSchema } from "@/app/utils/schemaUtils";
import { personSchema } from "../../utils/constants";
import { getRobotsString } from "@/lib/seo-config";

export async function generateMetadata() {
  // Build an absolute URL from an environment variable or default to localhost
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/tiimimme`, { cache: "no-cache" });
  const data = await res.json();

  
  const canonicalUrl = data.canonicalUrl && data.canonicalUrl.trim() !== "" 
    ? data.canonicalUrl 
    : `${baseUrl}/tiimimme`;

  return {
    metadataBase: new URL(baseUrl),
    title: data.seoTitle || data.title,
    description:
      data.metaDesc ||
      "Møt teamet bak Concealed Wines, din pålitelige vinimportør i Skandinavia.",
    robots: getRobotsString(),
    alternates: {
      canonical: canonicalUrl,
    },
    authors: [{ name: "Concealed Wines" }],
    publisher: "Concealed Wines",
  };
}

const VartTeamPage = () => {
  // Generate breadcrumb schema
  const breadcrumbs = breadcrumbSchemaGenerator([
    {
      name: "Tiimimme",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/tiimimme`,
    },
  ]);

  // Generate organization schema
  const organization = organizationSchema();

  // Convert personSchema to JSON string
  const personSchemaJson = JSON.stringify(personSchema);
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
        dangerouslySetInnerHTML={{ __html: personSchemaJson }}
      />
      <div>
        <TeamContent />
      </div>
    </>
  );
};

export default VartTeamPage;
