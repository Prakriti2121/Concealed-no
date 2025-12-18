import { PrismaClient } from "@prisma/client";
import AllPages from "../components/AllPages";

const prisma = new PrismaClient();

export default async function AllPagesPage() {
  const pages = await prisma.page.findMany({
    orderBy: { createdAt: "desc" },
  });

  const formattedPages = pages.map((page) => ({
    ...page,
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
    author: page.author ?? undefined,
    featuredImage: page.featuredImage ?? undefined,
    seoTitle: page.seoTitle ?? undefined,
    metaDesc: page.metaDesc ?? undefined,
    canonicalUrl: page.canonicalUrl ?? undefined,
  }));

  return <AllPages pages={formattedPages} />;
}
