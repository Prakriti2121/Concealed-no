import { getWineBySlug, getAllProducts } from "@/lib/actions/product.actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wine,
  Tag,
  GlassWater,
  Leaf,
  Award,
  Info,
  MapPin,
  Percent,
  Package,
  Grape,
} from "lucide-react";
import BreadCrumb from "../../../components/breadcrumb/breadcrumb";
import SharePopover from "../../../viinit-luettelo/components/SharePopover";
import ProductImageZoom from "./_components/ProductImage";
import PDFDownloadButton from "./_components/PDFDownloadButton";
import type { Metadata } from "next";
import {
  productSchemaGenerator,
  breadcrumbSchemaGenerator,
  organizationSchema,
} from "@/app/utils/schemaUtils";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 0;

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getWineBySlug(slug);

  if (!product) {
    return {
      title: "Produkt ikke funnet",
      description: "",
    };
  }

  const seoTitle = product.title;
  const description = product.tagLine ?? "";

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
  const canonicalUrl = `${baseUrl}/viineja-luettelo/viinit/${slug}`;

  const productData = {
    title: product.title,
    slug: product.slug,
    vintage: product.vintage,
    price: product.price,
    largeImage: product.largeImage,
    region: product.region,
    producerDescription: product.producerDescription || undefined,
    alcohol: product.alcohol,
    productCode: product.productCode,
    buyLink: product.buyLink,
    sortiment: product.sortiment,
    tagLine: product.tagLine,
    producerUrl: product.producerUrl,
    bottleVolume: product.bottleVolume,
    composition: product.composition,
    closure: product.closure,
    isNew: product.isNew,
    organic: product.organic,
    featured: product.featured,
    availableOnlyOnline: product.availableOnlyOnline,
  };

  const productJsonLd = productSchemaGenerator(productData);

  return {
    title: seoTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    authors: [{ name: "Concealed Wines" }],
    publisher: "Concealed Wines",
    openGraph: {
      title: seoTitle,
      description,
      url: canonicalUrl,
      images: [
        {
          url: product.largeImage || "/placeholder-wine.png",
          width: 1200,
          height: 630,
          alt: seoTitle,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description,
      images: [product.largeImage || "/placeholder-wine.png"],
    },
    other: {
      "script:product-json-ld": ["application/ld+json", productJsonLd],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const product = await getWineBySlug(slug);

  if (!product) {
    return <div>Produkt ikke funnet!</div>;
  }

  // Fetch all products and filter out the current one
  const allProducts = await getAllProducts();
  const otherProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const tasteArray = Array.isArray(product.taste)
    ? product.taste
    : typeof product.taste === "string"
    ? JSON.parse(product.taste)
    : Object.values(product.taste || {});

  const getFoodPairings = () => {
    const pairings: string[] = [];
    if (product.vegetables) pairings.push("Grønnsaker");
    if (product.roastedVegetables) pairings.push("Stekte grønnsaker");
    if (product.softCheese) pairings.push("Myk ost");
    if (product.hardCheese) pairings.push("Hard ost");
    if (product.starches) pairings.push("Stivelse");
    if (product.fish) pairings.push("Fisk");
    if (product.richFish) pairings.push("Fet fisk");
    if (product.whiteMeatPoultry) pairings.push("Hvitt kjøtt/Fjærkre");
    if (product.lambMeat) pairings.push("Lam");
    if (product.porkMeat) pairings.push("Svinekjøtt");
    if (product.redMeatBeef) pairings.push("Rødt kjøtt/Storfekjøtt");
    if (product.gameMeat) pairings.push("Vilt");
    if (product.curedMeat) pairings.push("Speket kjøtt");
    if (product.sweets) pairings.push("Søtsaker");
    return pairings;
  };

  const foodPairings = getFoodPairings();

  const productData = {
    title: product.title,
    slug: product.slug,
    vintage: product.vintage,
    price: product.price,
    largeImage: product.largeImage,
    region: product.region,
    producerDescription: product.producerDescription || undefined,
    alcohol: product.alcohol,
    productCode: product.productCode,
    buyLink: product.buyLink,
    sortiment: product.sortiment,
    tagLine: product.tagLine,
    producerUrl: product.producerUrl,
    bottleVolume: product.bottleVolume,
    composition: product.composition,
    closure: product.closure,
    isNew: product.isNew,
    organic: product.organic,
    featured: product.featured,
    availableOnlyOnline: product.availableOnlyOnline,
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const breadcrumbs = breadcrumbSchemaGenerator([
    {
      name: "Vinliste",
      url: `${baseUrl}/viinit-luettelo`,
    },
    {
      name: product.title,
      url: `${baseUrl}/viineja-luettelo/viinit/${slug}`,
    },
  ]);

  const organization = organizationSchema();
  const productJsonLd = productSchemaGenerator(productData);

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 max-w-7xl">
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
        dangerouslySetInnerHTML={{ __html: productJsonLd }}
      />

      <div className="mb-4">
        <BreadCrumb title1="Vinliste » Viner" title2={product.title} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10">
        {/* Image Section - Pure image, no containers */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-4 h-[60vh] sm:h-[65vh] lg:h-[75vh]">
            <ProductImageZoom
              src={product.largeImage || "/placeholder-wine.png"}
              alt={product.title}
            />
          </div>
        </div>

        {/* Details Section */}
        <div className="lg:col-span-3">
          {/* Title Section with PDF Download */}
          <div className="mb-5 pb-5 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1D2939]">
                  {product.title}
                </h1>
              </div>
              <div className="sm:ml-4 flex-shrink-0 w-full sm:w-auto">
                <PDFDownloadButton product={product} />
              </div>
            </div>
            {product.tagLine && (
              <div className="flex items-start mb-3">
                <Tag
                  size={16}
                  className="mr-2 mt-1 flex-shrink-0 text-gray-400"
                />
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {product.tagLine}
                </p>
              </div>
            )}
            {(product.isNew ||
              product.organic ||
              product.featured ||
              product.availableOnlyOnline) && (
              <div className="flex flex-wrap gap-2">
                {product.isNew && (
                  <Badge className="bg-[#e0944e]/10 text-[#e0944e] border-[#e0944e]/30 text-xs sm:text-sm">
                    Ny
                  </Badge>
                )}
                {product.organic && (
                  <Badge className="bg-green-50 text-green-700 border-green-200 text-xs sm:text-sm">
                    <Leaf size={14} className="mr-1" /> Økologisk
                  </Badge>
                )}
                {product.featured && (
                  <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs sm:text-sm">
                    <Award size={14} className="mr-1" /> Anbefalt
                  </Badge>
                )}
                {product.availableOnlyOnline && (
                  <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-xs sm:text-sm">
                    Kun online
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Price and Buy Section */}
          <div className="mb-5 pb-5 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex-1">
                <p className="text-3xl sm:text-4xl font-bold text-[#1D2939] mb-2">
                  {product.price.toFixed(2)} €
                </p>
                <div className="flex items-center text-gray-600 text-sm">
                  <Package size={16} className="mr-2 flex-shrink-0" />
                  <span>
                    {product.sortiment && (
                      <span className="font-medium">{product.sortiment}</span>
                    )}
                    {product.sortiment && <span className="mx-2">•</span>}
                    <span>
                      Vinmonopolet liste nr:{" "}
                      <span className="font-medium">{product.productCode}</span>
                    </span>
                  </span>
                </div>
              </div>
              <Button
                asChild
                className="bg-[#e0944e] hover:bg-[#d08843] text-white px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-medium transition-all w-full sm:w-auto"
              >
                <a
                  href={product.buyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Kjøp nå
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Info Grid - No truncate */}
          {(product.producerUrl ||
            product.region ||
            product.vintage ||
            product.alcohol) && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-5 pb-5 border-b border-gray-200">
              {product.producerUrl && (
                <div>
                  <div className="flex items-center text-gray-500 mb-1.5">
                    <Grape size={16} className="mr-1.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">
                      Produsent
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-[#e0944e] font-semibold break-words">
                    {product.producerUrl.split("/").pop() || "Produsent"}
                  </p>
                </div>
              )}
              {product.region && (
                <div>
                  <div className="flex items-center text-gray-500 mb-1.5">
                    <MapPin size={16} className="mr-1.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">
                      Region
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-[#1D2939] font-semibold break-words">
                    {product.region}
                  </p>
                </div>
              )}
              {product.vintage && (
                <div>
                  <div className="flex items-center text-gray-500 mb-1.5">
                    <Wine size={16} className="mr-1.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">
                      Årgang
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-[#1D2939] font-semibold">
                    {product.vintage}
                  </p>
                </div>
              )}
              {product.alcohol && (
                <div>
                  <div className="flex items-center text-gray-500 mb-1.5">
                    <Percent size={16} className="mr-1.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">
                      Alkohol
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-[#1D2939] font-semibold">
                    {product.alcohol}%
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Taste Profile */}
          {tasteArray.length > 0 && (
            <div className="mb-5 pb-5 border-b border-gray-200">
              <div className="flex items-center mb-3">
                <GlassWater
                  size={18}
                  className="mr-2 flex-shrink-0 text-[#e0944e]"
                />
                <h3 className="text-base sm:text-lg font-semibold text-[#1D2939]">
                  Smaksprofil
                </h3>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {tasteArray.join(", ")}.
              </p>
            </div>
          )}

          {/* Wine Details */}
          {(product.bottleVolume || product.composition || product.closure) && (
            <div className="mb-5 pb-5 border-b border-gray-200">
              <div className="flex items-center mb-3">
                <Wine size={18} className="mr-2 flex-shrink-0 text-[#e0944e]" />
                <h3 className="text-base sm:text-lg font-semibold text-[#1D2939]">
                  Vindetaljer
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {product.bottleVolume && (
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">
                      Volum
                    </p>
                    <p className="text-sm sm:text-base text-[#1D2939] font-semibold">
                      {product.bottleVolume} ml
                    </p>
                  </div>
                )}
                {product.composition && (
                  <div className="sm:col-span-2">
                    <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">
                      Sammensetning
                    </p>
                    <p className="text-sm sm:text-base text-[#1D2939] font-semibold break-words">
                      {product.composition}
                    </p>
                  </div>
                )}
                {product.closure && (
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">
                      Lukketype
                    </p>
                    <p className="text-sm sm:text-base text-[#1D2939] font-semibold">
                      {product.closure}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Food Pairings */}
          {foodPairings.length > 0 && (
            <div className="mb-5 pb-5 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-[#1D2939] mb-3">
                Matkombinasjoner
              </h3>
              <div className="flex flex-wrap gap-2">
                {foodPairings.map((pairing, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-gray-50 border-gray-300 text-gray-700 text-xs sm:text-sm"
                  >
                    {pairing}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Producer Description */}
          {product.producerDescription && (
            <div className="mb-5 pb-5 border-b border-gray-200">
              <div className="flex items-center mb-3">
                <Info size={18} className="mr-2 flex-shrink-0 text-[#e0944e]" />
                <h3 className="text-base sm:text-lg font-semibold text-[#1D2939]">
                  Om produsenten
                </h3>
              </div>
              <div
                className="prose prose-sm max-w-none text-sm sm:text-base text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: product.producerDescription,
                }}
              />
            </div>
          )}

          {/* Additional Info */}
          {product.additionalInfo && (
            <div className="mb-5 pb-5 border-b border-gray-200">
              <div className="flex items-center mb-3">
                <Info size={18} className="mr-2 flex-shrink-0 text-[#e0944e]" />
                <h3 className="text-base sm:text-lg font-semibold text-[#1D2939]">
                  Tilleggsinformasjon
                </h3>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {product.additionalInfo}
              </p>
            </div>
          )}

          {/* Awards */}
          {product.awards && (
            <div className="mb-5 pb-5 border-b border-gray-200">
              <div className="flex items-center mb-3">
                <Award
                  size={18}
                  className="mr-2 flex-shrink-0 text-[#e0944e]"
                />
                <h3 className="text-base sm:text-lg font-semibold text-[#1D2939]">
                  Priser
                </h3>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {product.awards}
              </p>
            </div>
          )}

          {/* Share Button */}
          <div className="mb-5 pb-5 border-b border-gray-200">
            <SharePopover title={product.title} />
          </div>

          {/* Last Updated */}
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <Info size={16} className="mr-2 flex-shrink-0" />
            Sist oppdatert: {new Date(product.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Other Products Section */}
      {otherProducts.length > 0 && (
        <div className="mt-16 sm:mt-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center text-[#1D2939]">
            Andre produkter
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {otherProducts.map((wine) => (
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
                          Les mer
                        </button>
                      </Link>

                      <div className="text-sm leading-relaxed pt-2 border-t border-gray-100 text-[#282828]">
                        Tilgjengelig i Vinmonopolet •{" "}
                        <Link
                          href={wine.buyLink}
                          className="hover:text-black hover:underline transition-colors text-[#282828]"
                        >
                          Finn nærmeste butikk
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
