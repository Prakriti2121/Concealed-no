import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import { generateSlug } from "@/lib/utils/slugify";
import prisma from "@/lib/prisma";

// GET a single product by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params; // Await params before using it

  const session = await getServerSession(NEXT_AUTH_CONFIG);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const productId = Number(id);
  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Error fetching product" },
      { status: 500 }
    );
  }
}

// UPDATE a product
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params; // Await params before using it

  const session = await getServerSession(NEXT_AUTH_CONFIG);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const productId = Number(id);
  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    // Parse the incoming form data (multipart/form-data)
    const formData = await req.formData();

    // Define a proper interface for the product data
    interface ProductData {
      [key: string]:
        | string
        | number
        | boolean
        | Array<string>
        | Record<string, unknown>;
    }

    const data: ProductData = {};

    // List of keys that are booleans in your Prisma model
    const booleanKeys = [
      "isNew",
      "availableOnlyOnline",
      "organic",
      "featured",
      "vegetables",
      "roastedVegetables",
      "softCheese",
      "hardCheese",
      "starches",
      "fish",
      "richFish",
      "whiteMeatPoultry",
      "lambMeat",
      "porkMeat",
      "redMeatBeef",
      "gameMeat",
      "curedMeat",
      "sweets",
    ];

    for (const [key, value] of formData.entries()) {
      if (["price", "bottleVolume", "alcohol"].includes(key)) {
        data[key] = Number(value);
      } else if (key === "taste") {
        const strValue = value as string;
        if (strValue.trim() === "") {
          data[key] = [];
        } else {
          try {
            data[key] = JSON.parse(strValue);
          } catch {
            data[key] = strValue;
          }
        }
      } else if (booleanKeys.includes(key)) {
        // Convert string "true"/"false" to boolean values
        data[key] = value === "true";
      } else if (value === "" || value === null) {
        continue;
      } else if (value instanceof File) {
        // Handle File objects appropriately or skip them
        continue;
      } else {
        data[key] = value as string;
      }
    }

    // If title is being updated, regenerate the slug
    if (data.title && typeof data.title === "string") {
      data.slug = generateSlug(data.title);
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
