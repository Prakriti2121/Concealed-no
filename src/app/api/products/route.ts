import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { generateSlug } from "@/lib/utils/slugify";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming form data
    const formData = await request.formData();

    // Extract the file from form data
    const file = formData.get("largeImage");

    let largeImage = null; // default value if no image is uploaded

    // Process the image only if a file is provided and is a valid File instance
    if (file instanceof File) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type" },
          { status: 400 }
        );
      }

      // Convert File to Buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename and save the file
      const filename = `${Date.now()}-${file.name}`;
      const publicDir = path.join(process.cwd(), "public/uploads");
      await writeFile(path.join(publicDir, filename), buffer);

      // Set the URL/path for the uploaded image
      largeImage = `/uploads/${filename}`;
    }

    // Extract and process the other form data fields as before
    const isNew = formData.get("isNew") === "true";
    const availableOnlyOnline = formData.get("availableOnlyOnline") === "true";
    const organic = formData.get("organic") === "true";
    const featured = formData.get("featured") === "true";
    const productCode = formData.get("productCode")?.toString() || "";
    const vintage = formData.get("vintage")?.toString() || "";
    const price = formData.get("price")
      ? parseFloat(formData.get("price")?.toString() ?? "0")
      : 0;
    const buyLink = formData.get("buyLink")?.toString() || "";
    const sortiment = formData.get("sortiment")?.toString() || "";
    const tagLine = formData.get("tagLine")?.toString() || "";
    const producerDescription =
      formData.get("producerDescription")?.toString() || "";
    const producerUrl = formData.get("producerUrl")?.toString() || "";
    const region = formData.get("region")?.toString() || "";

    let taste;
    try {
      const tasteData = formData.get("taste");
      taste = tasteData ? JSON.parse(tasteData.toString()) : null;
    } catch {
      taste = formData.get("taste")?.toString() || "";
    }

    const awards = formData.get("awards")?.toString() || "";
    const additionalInfo = formData.get("additionalInfo")?.toString() || "";
    const title = formData.get("title")?.toString() || "";

    const composition = formData.get("composition")?.toString() || "";
    const closure = formData.get("closure")?.toString() || "";
    const vegetables = formData.get("vegetables") === "true";
    const roastedVegetables = formData.get("roastedVegetables") === "true";
    const softCheese = formData.get("softCheese") === "true";
    const fish = formData.get("fish") === "true";
    const richFish = formData.get("richFish") === "true";
    const whiteMeatPoultry = formData.get("whiteMeatPoultry") === "true";
    const lambMeat = formData.get("lambMeat") === "true";
    const porkMeat = formData.get("porkMeat") === "true";
    const redMeatBeef = formData.get("redMeatBeef") === "true";
    const gameMeat = formData.get("gameMeat") === "true";
    const curedMeat = formData.get("curedMeat") === "true";
    const sweets = formData.get("sweets") === "true";
    const bottleVolume = formData.get("bottleVolume")
      ? parseFloat(formData.get("bottleVolume")?.toString() ?? "0")
      : 0;
    const alcohol = formData.get("alcohol")
      ? parseFloat(formData.get("alcohol")?.toString() ?? "0")
      : 0;
    const hardCheese = formData.get("hardCheese") === "true";
    const starches = formData.get("starches") === "true";

    // Generate slug from title
    const slug = generateSlug(title);

    // Create a new product record in the database
    const newProduct = await prisma.product.create({
      data: {
        title,
        slug,
        isNew,
        availableOnlyOnline,
        organic,
        featured,
        productCode,
        vintage,
        price,
        largeImage: largeImage || "", // provide empty string as fallback when null
        buyLink,
        sortiment,
        tagLine,
        producerDescription,
        producerUrl,
        region,
        taste,
        awards,
        additionalInfo,
        vegetables,
        roastedVegetables,
        softCheese,
        hardCheese,
        starches,
        fish,
        richFish,
        whiteMeatPoultry,
        lambMeat,
        porkMeat,
        redMeatBeef,
        gameMeat,
        curedMeat,
        sweets,
        bottleVolume,
        alcohol,
        composition,
        closure,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Error creating product" },
      { status: 500 }
    );
  }
}

// NEW GET handler: fetch only featured products for banner
export async function GET() {
  try {
    // Query only products where featured is true
    const featuredProducts = await prisma.product.findMany({
      where: { featured: true },
    });
    return NextResponse.json(featuredProducts, { status: 200 });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return NextResponse.json(
      { error: "Error fetching featured products" },
      { status: 500 }
    );
  }
}
