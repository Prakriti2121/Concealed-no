import { getWineBySlug } from "@/lib/actions/product.actions";
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
import type { Metadata } from "next";
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
    return <div>Tuotetta ei löytynyt!</div>;
  }

  const tasteArray = Array.isArray(product.taste)
    ? product.taste
    : typeof product.taste === "string"
    ? JSON.parse(product.taste)
    : Object.values(product.taste || {});

  const getFoodPairings = () => {
    const pairings: string[] = [];
    if (product.vegetables) pairings.push("Vihannekset");
    if (product.roastedVegetables) pairings.push("Paahdetut vihannekset");
    if (product.softCheese) pairings.push("Pehmeä juusto");
    if (product.hardCheese) pairings.push("Kova juusto");
    if (product.starches) pairings.push("Tärkkelys");
    if (product.fish) pairings.push("Kala");
    if (product.richFish) pairings.push("Rasvainen kala");
    if (product.whiteMeatPoultry) pairings.push("Valkoinen liha/Siipikarja");
    if (product.lambMeat) pairings.push("Lammas");
    if (product.porkMeat) pairings.push("Sianliha");
    if (product.redMeatBeef) pairings.push("Punainen liha/Naudanliha");
    if (product.gameMeat) pairings.push("Riistaliha");
    if (product.curedMeat) pairings.push("Suolattu liha");
    if (product.sweets) pairings.push("Makeiset");
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        <div className="md:col-span-1 lg:col-span-1">
          <div className="lg:sticky lg:top-6">
            <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-full mx-auto md:mx-0">
              <div className="lg:[&>*]:cursor-zoom-in [&>*]:cursor-default">
                <ProductImageZoom
                  src={product.largeImage || "/placeholder-wine.png"}
                  alt={product.title}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 lg:col-span-2 space-y-4">
          <div className="pb-4 border-b border-gray-200">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-[#1D2939]">
              {product.title}
            </h1>
            {product.tagLine && (
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                <Tag size={16} className="mr-1.5 flex-shrink-0" />
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
                    className="bg-[#e0944e]/10 text-[#e0944e] border-[#e0944e]/30 text-xs sm:text-sm"
                  >
                    Uusi
                  </Badge>
                )}
                {product.organic && (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 text-xs sm:text-sm"
                  >
                    <Leaf size={14} className="mr-1" /> Luomu
                  </Badge>
                )}
                {product.featured && (
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700 border-amber-200 text-xs sm:text-sm"
                  >
                    <Award size={14} className="mr-1" /> Suositeltu
                  </Badge>
                )}
                {product.availableOnlyOnline && (
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200 text-xs sm:text-sm"
                  >
                    Vain verkossa
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-4 border-b border-gray-200">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-[#1D2939]">
                {product.price.toFixed(2)} €
              </p>
              <p className="text-xs sm:text-sm text-gray-500 flex items-center mt-1">
                <Package size={14} className="mr-1 flex-shrink-0" />
                <span className="truncate">
                  {product.sortiment && <>{product.sortiment} • </>}
                  Koodi: {product.productCode}
                </span>
              </p>
            </div>
            <Button
              asChild
              className="bg-[#e0944e] hover:bg-[#d08843] px-6 w-full sm:w-auto"
            >
              <a
                href={product.buyLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Osta nyt
              </a>
            </Button>
          </div>

          {(product.producerUrl ||
            product.region ||
            product.vintage ||
            product.alcohol) && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 py-4 border-b border-gray-200">
              {product.producerUrl && (
                <div>
                  <p className="text-gray-500 text-sm mb-1 flex items-center">
                    <Grape size={14} className="mr-1 flex-shrink-0" /> Tuottaja
                  </p>
                  <div className="text-[#e0944e] text-base font-medium truncate block">
                    {product.producerUrl.split("/").pop() || "Tuottaja"}
                  </div>
                </div>
              )}
              {product.region && (
                <div>
                  <p className="text-gray-500 text-sm mb-1 flex items-center">
                    <MapPin size={14} className="mr-1 flex-shrink-0" /> Alue
                  </p>
                  <p className="text-base font-medium truncate">
                    {product.region}
                  </p>
                </div>
              )}
              {product.vintage && (
                <div>
                  <p className="text-gray-500 text-sm mb-1 flex items-center">
                    <Wine size={14} className="mr-1 flex-shrink-0" /> Vuosikerta
                  </p>
                  <p className="text-base font-medium">{product.vintage}</p>
                </div>
              )}
              {product.alcohol && (
                <div>
                  <p className="text-gray-500 text-sm mb-1 flex items-center">
                    <Percent size={14} className="mr-1 flex-shrink-0" />{" "}
                    Alkoholi
                  </p>
                  <p className="text-base font-medium">{product.alcohol}%</p>
                </div>
              )}
            </div>
          )}

          {tasteArray.length > 0 && (
            <div className="py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold mb-2 flex items-center text-[#1D2939]">
                <GlassWater size={16} className="mr-2 flex-shrink-0" />{" "}
                Makuprofiili
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {tasteArray.join(", ")}.
              </p>
            </div>
          )}

          {(product.bottleVolume || product.composition || product.closure) && (
            <div className="py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold mb-3 flex items-center text-[#1D2939]">
                <Wine size={16} className="mr-2 flex-shrink-0" /> Viinin tiedot
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {product.bottleVolume && (
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Tilavuus</p>
                    <p className="text-base font-medium">
                      {product.bottleVolume} ml
                    </p>
                  </div>
                )}
                {product.composition && (
                  <div className="sm:col-span-2">
                    <p className="text-gray-500 text-sm mb-1">Koostumus</p>
                    <p className="text-base font-medium">
                      {product.composition}
                    </p>
                  </div>
                )}
                {product.closure && (
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Sulkija</p>
                    <p className="text-base font-medium">{product.closure}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {foodPairings.length > 0 && (
            <div className="py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold mb-2 text-[#1D2939]">
                Ruokayhdistelmät
              </h3>
              <div className="flex flex-wrap gap-2">
                {foodPairings.map((pairing, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-gray-50 text-xs sm:text-sm"
                  >
                    {pairing}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {product.producerDescription && (
            <div className="py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold mb-3 flex items-center text-[#1D2939]">
                <Info size={16} className="mr-2 flex-shrink-0" /> Tietoa
                tuottajasta
              </h3>
              <div
                className="prose prose-sm max-w-none text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: product.producerDescription,
                }}
              />
            </div>
          )}

          {product.additionalInfo && (
            <div className="py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold mb-3 flex items-center text-[#1D2939]">
                <Info size={16} className="mr-2 flex-shrink-0" /> Lisätietoja
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {product.additionalInfo}
              </p>
            </div>
          )}

          {product.awards && (
            <div className="py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold mb-3 flex items-center text-[#1D2939]">
                <Award size={16} className="mr-2 flex-shrink-0" /> Palkinnot
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {product.awards}
              </p>
            </div>
          )}

          <div className="py-4">
            <SharePopover title={product.title} />
          </div>

          <div className="text-xs sm:text-sm text-gray-500 flex items-center pt-2">
            <Info size={14} className="mr-1 flex-shrink-0" />
            Viimeksi päivitetty:{" "}
            {new Date(product.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
