import { PrismaClient } from "@prisma/client";
import NewPage from "../components/NewPage";

const prisma = new PrismaClient();

export default async function NewPagePage() {
  const pages = await prisma.page.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <NewPage pages={pages} />;
}
