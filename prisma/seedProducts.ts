// prisma/seedProducts.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Now we strip diacritics, lowercase, replace non‑alphanumerics with hyphens,
// and trim leading/trailing hyphens.
function generateSlug(title: string): string {
  return title
    .normalize("NFKD")                            // split accented letters
    .replace(/[\u0300-\u036f]/g, "")               // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")                   // non‑alphanumeric → hyphen
    .replace(/(^-|-$)/g, "");                      // trim leading/trailing hyphens
}

async function main() {
  const products = await prisma.product.findMany();
  for (const product of products) {
    // regenerate slug if it currently contains “-<number>” or is empty
    if (!product.slug || /-\d+$/.test(product.slug)) {
      const newSlug = generateSlug(product.title);
      await prisma.product.update({
        where: { id: product.id },
        data: { slug: newSlug },
      });
      console.log(`✔ Updated product ${product.id} → slug="${newSlug}"`);
    }
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
