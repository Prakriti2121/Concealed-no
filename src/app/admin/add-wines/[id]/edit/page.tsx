"use client";

import React from "react";
import EditProductForm from "@/components/molecules/EditProductForm";

export default function EditWinePage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl my-6 font-black">Edit Product</h1>
      <EditProductForm />
    </div>
  );
}
