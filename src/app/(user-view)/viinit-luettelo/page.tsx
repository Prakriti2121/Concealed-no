import { getAllProducts } from "@/lib/actions/product.actions";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import React from "react";
import { breadcrumbSchemaGenerator, organizationSchema } from "@/app/utils/schemaUtils";

interface PageProps {
  searchParams: {
    page?: string;
  };
}

interface SeoData {
  title: string;
  seoTitle: string;
  metaDesc: string;
  canonicalUrl: string;
}

export async function generateMetadata(): Promise<Metadata> {
  // Build your absolute base URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Fetch your page's SEO data
  const res = await fetch(`${baseUrl}/api/viinit`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    // fallback values
    return {
      title: "Alle viner",
      description: "Bla gjennom vår komplette katalog av viner.",
    };
  }

  const data: SeoData = await res.json();


  const canonicalUrl = data.canonicalUrl && data.canonicalUrl.trim() !== ""
    ? data.canonicalUrl
    : `${baseUrl}/viinit-luettelo`;

  return {
    title: data.seoTitle || data.title,
    description: data.metaDesc || "Bla gjennom vår komplette katalog av viner.",
    alternates: {
      canonical: canonicalUrl,
    },
    authors: [{ name: "Concealed Wines" }],
    publisher: "Concealed Wines",
  };
}

const PRODUCTS_PER_PAGE = 10;

export default async function Page({ searchParams }: PageProps) {
  // parse & clamp page number
  const params = await searchParams;
  const raw = parseInt(params.page ?? "1", 10);
  const currentPage = isNaN(raw) || raw < 1 ? 1 : raw;

  // fetch products
  const allWines = await getAllProducts();
  const totalPages = Math.ceil(allWines.length / PRODUCTS_PER_PAGE);
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PRODUCTS_PER_PAGE;
  const displayed = allWines.slice(start, start + PRODUCTS_PER_PAGE);

  // Build your absolute base URL for breadcrumb schema
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Generate breadcrumb schema
  const breadcrumbs = breadcrumbSchemaGenerator([
    {
      name: "Viinit Luettelo",
      url: `${baseUrl}/viinit-luettelo`,
    },
  ]);

  // Generate organization schema
  const organization = organizationSchema();

  return (
    <>
      <script
        type="application/ld+json"
        className="rank-math-schema"
        dangerouslySetInnerHTML={{ __html: breadcrumbs }}
      />
      <script
        type="application/ld+json"
        className="rank-math-schema"
        dangerouslySetInnerHTML={{ __html: organization }}
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-[#1D2939]">Alle viner</h1>

        {displayed.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {displayed.map((wine) => (
              <div
                key={wine.id}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col sm:flex-row h-full">
                  {/* Image Section */}
                  <div className="w-full sm:w-2/5 flex justify-center items-center p-8 bg-gradient-to-br from-gray-50 to-white relative">
                    <Link href={`/viineja-luettelo/viinit/${wine.slug}`}>
                      <div className="relative h-64 w-40 cursor-pointer transform transition-transform duration-300 group-hover:scale-105">
                        <Image
                          src={wine.largeImage}
                          alt={wine.title || "Wine"}
                          fill
                          sizes="(max-width: 640px) 100vw, 40vw"
                          className="object-contain drop-shadow-lg"
                        />
                      </div>
                    </Link>
                  </div>

                  {/* Content Section */}
                  <div className="w-full sm:w-3/5 p-6 flex flex-col justify-between">
                    <div className="flex-grow">
                      <Link
                        href={`/viineja-luettelo/viinit/${wine.slug}`}
                        className="block group-hover:text-gray-700 transition-colors"
                      >
                        <h2 className="text-xl md:text-2xl font-bold leading-tight mb-3 line-clamp-2 text-[#1D2939]">
                          {wine.title}
                        </h2>
                      </Link>
                      <p className="text-sm mb-4 text-[#282828]">
                        Kode: {wine.productCode}
                      </p>
                    </div>

                    <div className="space-y-4 mt-4">
                      <div className="text-3xl font-black text-[#1D2939]">
                        {wine.price} €
                      </div>

                      <Link
                        href={`/viineja-luettelo/viinit/${wine.slug}`}
                        className="block"
                      >
                        <button className="w-full bg-[#333333] text-white py-3 px-6 rounded-lg font-semibold hover:bg-black transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]">
                          Lue lisää
                        </button>
                      </Link>

                      <div className="text-sm leading-relaxed pt-2 border-t border-gray-100 text-[#282828]">
                        Saatavana Alkon myymälöiden •{" "}
                        <Link
                          href={wine.buyLink}
                          className="hover:text-black hover:underline transition-colors text-[#282828]"
                        >
                          Etsi lähin myymälä
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-base text-[#282828]">Ingen viner funnet.</p>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-6 mt-12">
          {safePage > 1 && (
            <Link
              href={`?page=${safePage - 1}`}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
            >
              Forrige
            </Link>
          )}
          <span className="text-lg font-semibold text-[#282828]">
            Side {safePage} av {totalPages}
          </span>
          {safePage < totalPages && (
            <Link
              href={`?page=${safePage + 1}`}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
            >
              Neste
            </Link>
          )}
        </div>
      </div>
    </>
  );
}