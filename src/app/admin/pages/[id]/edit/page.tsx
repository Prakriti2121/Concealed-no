import { PrismaClient } from "@prisma/client";
import EditPage from "../../components/EditPage";

const prisma = new PrismaClient();

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await the params promise to extract the id
  const { id } = await params;

  const page = await prisma.page.findUnique({
    where: { id: Number.parseInt(id) },
  });

  if (!page) {
    return <div>Page not found</div>;
  }

  // Transform fields to match the expected Page type,
  // ensuring featuredImage is a string (defaulting to an empty string if null)
  const transformedPage = {
    ...page,
    seoTitle: page.seoTitle ?? "",
    metaDesc: page.metaDesc ?? "",
    canonicalUrl: page.canonicalUrl ?? "",
    featuredImage: page.featuredImage ?? "",
    author: page.author ?? "",
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
  };

  return <EditPage page={transformedPage} />;
}
