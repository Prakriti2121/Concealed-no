import { AllWinesTable } from "@/components/molecules/AllWinesTable";
import { getAllProducts } from "@/lib/actions/product.actions";
import React from "react";
import { Product } from "@/types/types";
const AllWines = async () => {
  const products = await getAllProducts();

  const formattedProducts = products.map((product) => ({
    ...product,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    taste: Array.isArray(product.taste)
      ? product.taste
      : typeof product.taste === "string"
      ? [product.taste]
      : Array.isArray(JSON.parse(JSON.stringify(product.taste)))
      ? JSON.parse(JSON.stringify(product.taste))
      : [],
  })) as Product[];
  return (
    <div>
      {formattedProducts && <AllWinesTable products={formattedProducts} />}
    </div>
  );
};

export default AllWines;
