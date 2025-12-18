import AddProductForm from "@/components/molecules/AddProductForm";
import React from "react";

const page = () => {
  return (
    <div className="container mx-auto ">
      <h1 className="text-4xl my-6 font-black">Add Product</h1>
      <AddProductForm />
    </div>
  );
};

export default page;
