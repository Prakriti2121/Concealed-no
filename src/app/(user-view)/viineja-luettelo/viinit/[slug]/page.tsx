import { getWineBySlug } from "@/lib/actions/product.actions";
import React from "react";
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
import { Metadata } from "next";
import {
  productSchemaGenerator,
  breadcrumbSchemaGenerator,
  organizationSchema,
} from "@/app/utils/schemaUtils";

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
      title: "Product Not Found",
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
    return <div>Product not found!</div>;
  }

  const tasteArray = Array.isArray(product.taste)
    ? product.taste
    : typeof product.taste === "string"
    ? JSON.parse(product.taste)
    : Object.values(product.taste || {});

  const getFoodPairings = () => {
    const pairings: string[] = [];
    if (product.vegetables) pairings.push("Vegetables");
    if (product.roastedVegetables) pairings.push("Roasted Vegetables");
    if (product.softCheese) pairings.push("Soft Cheese");
    if (product.hardCheese) pairings.push("Hard Cheese");
    if (product.starches) pairings.push("Starches");
    if (product.fish) pairings.push("Fish");
    if (product.richFish) pairings.push("Rich Fish");
    if (product.whiteMeatPoultry) pairings.push("White Meat/Poultry");
    if (product.lambMeat) pairings.push("Lamb");
    if (product.porkMeat) pairings.push("Pork");
    if (product.redMeatBeef) pairings.push("Red Meat/Beef");
    if (product.gameMeat) pairings.push("Game Meat");
    if (product.curedMeat) pairings.push("Cured Meat");
    if (product.sweets) pairings.push("Sweets");
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
      name: "Viinit-luettelo",
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
    <div className="container mx-auto px-4 py-4 lg:py-6">
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

      <div className="flex items-center gap-2 mb-4">
        <BreadCrumb title1="Viineja-luettelo » Viinit" title2={product.title} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6">
            <ProductImageZoom
              src={product.largeImage || "/placeholder-wine.png"}
              alt={product.title}
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="pb-4 border-b border-gray-200">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-[#1D2939]">
              {product.title}
            </h1>
            {product.tagLine && (
              <p className="text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                <Tag size={16} className="mr-1.5" />
                <span>{product.tagLine}</span>
              </p>
            )}
            {(product.isNew ||
              product.organic ||
              product.featured ||
              product.availableOnlyOnline) && (
              <div className="flex flex-wrap gap-2">
                {product.isNew && (
                  <Badge
                    variant="outline"
                    className="bg-[#e0944e]/10 text-[#e0944e] border-[#e0944e]/30"
                  >
                    New
                  </Badge>
                )}
                {product.organic && (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    <Leaf size={14} className="mr-1" /> Organic
                  </Badge>
                )}
                {product.featured && (
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700 border-amber-200"
                  >
                    <Award size={14} className="mr-1" /> Featured
                  </Badge>
                )}
                {product.availableOnlyOnline && (
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200"
                  >
                    Online Only
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-4 border-b border-gray-200">
            <div>
              <p className="text-3xl font-bold text-[#1D2939]">
                {product.price.toFixed(2)} €
              </p>
              <p className="text-sm text-gray-500 flex items-center mt-1">
                <Package size={14} className="mr-1" />
                {product.sortiment && <>{product.sortiment} • </>}
                Code: {product.productCode}
              </p>
            </div>
            <Button asChild className="bg-[#e0944e] hover:bg-[#d08843] px-6">
              <a
                href={product.buyLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Buy Now
              </a>
            </Button>
          </div>

          {(product.producerUrl ||
            product.region ||
            product.vintage ||
            product.alcohol) && (
            <div className="grid grid-cols-2 gap-4 py-4 border-b border-gray-200">
              {product.producerUrl && (
                <div>
                  <p className="text-gray-500 text-sm mb-1 flex items-center">
                    <Grape size={14} className="mr-1" /> Producer
                  </p>
                  <div className="text-[#e0944e] font-medium truncate block">
                    {product.producerUrl.split("/").pop() || "Producer"}
                  </div>
                </div>
              )}
              {product.region && (
                <div>
                  <p className="text-gray-500 text-sm mb-1 flex items-center">
                    <MapPin size={14} className="mr-1" /> Region
                  </p>
                  <p className="font-medium truncate">{product.region}</p>
                </div>
              )}
              {product.vintage && (
                <div>
                  <p className="text-gray-500 text-sm mb-1 flex items-center">
                    <Wine size={14} className="mr-1" /> Vintage
                  </p>
                  <p className="font-medium">{product.vintage}</p>
                </div>
              )}
              {product.alcohol && (
                <div>
                  <p className="text-gray-500 text-sm mb-1 flex items-center">
                    <Percent size={14} className="mr-1" /> Alcohol
                  </p>
                  <p className="font-medium">{product.alcohol}%</p>
                </div>
              )}
            </div>
          )}

          {tasteArray.length > 0 && (
            <div className="py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold mb-2 flex items-center text-[#1D2939]">
                <GlassWater size={16} className="mr-2" /> Taste Profile
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                {tasteArray.join(", ")}.
              </p>
            </div>
          )}

          {(product.bottleVolume || product.composition || product.closure) && (
            <div className="py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold mb-3 flex items-center text-[#1D2939]">
                <Wine size={16} className="mr-2" /> Wine Details
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {product.bottleVolume && (
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Volume</p>
                    <p className="font-medium">{product.bottleVolume} ml</p>
                  </div>
                )}
                {product.composition && (
                  <div className="col-span-2">
                    <p className="text-gray-500 text-sm mb-1">Composition</p>
                    <p className="font-medium">{product.composition}</p>
                  </div>
                )}
                {product.closure && (
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Closure</p>
                    <p className="font-medium">{product.closure}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {foodPairings.length > 0 && (
            <div className="py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold mb-2 text-[#1D2939]">
                Food Pairings
              </h3>
              <div className="flex flex-wrap gap-2">
                {foodPairings.map((pairing, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-50">
                    {pairing}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {product.producerDescription && (
            <div className="py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold mb-3 flex items-center text-[#1D2939]">
                <Info size={16} className="mr-2" /> About the Producer
              </h3>
              <div
                className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300 leading-relaxed text-sm"
                dangerouslySetInnerHTML={{
                  __html: product.producerDescription,
                }}
              />
            </div>
          )}

          {product.additionalInfo && (
            <div className="py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold mb-3 flex items-center text-[#1D2939]">
                <Info size={16} className="mr-2" /> Additional Information
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                {product.additionalInfo}
              </p>
            </div>
          )}

          {product.awards && (
            <div className="py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold mb-3 flex items-center text-[#1D2939]">
                <Award size={16} className="mr-2" /> Awards
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                {product.awards}
              </p>
            </div>
          )}

          <div className="py-4">
            <SharePopover title={product.title} />
          </div>

          <div className="text-sm text-gray-500 flex items-center pt-2">
            <Info size={14} className="mr-1" />
            Last updated: {new Date(product.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
