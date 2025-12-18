"use client";

import type { Product } from "@/types/types";
import Link from "next/link";
import { deleteProductById } from "@/lib/actions/product.actions";
import toast from "react-hot-toast";
import { Edit, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface ProductTableProps {
  products: Product[];
}

export const AllWinesTable = ({ products }: ProductTableProps) => {
  const router = useRouter();

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      toast.success("Product deleted successfully");
      await deleteProductById(Number(productId));
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Wines</h1>
        <Button onClick={() => router.push("/admin/add-wines")}>
          Create New Product
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto shadow-md">
        <Table className="border-collapse w-full text-sm text-left text-black">
          <TableHeader>
            <TableRow className="border-b text-xs text-gray-700 uppercase bg-gray-50">
              <TableHead className="border px-6 py-3">ID</TableHead>
              <TableHead className="border px-6 py-3">Title</TableHead>
              <TableHead className="border px-6 py-3">Price</TableHead>
              <TableHead className="border px-6 py-3">Product Code</TableHead>
              <TableHead className="border px-6 py-3">Created At</TableHead>
              <TableHead className="border px-6 py-3 text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="border-b bg-white">
                <TableCell className="border px-6 py-4 font-medium text-black whitespace-nowrap">
                  {product.id}
                </TableCell>
                <TableCell className="border px-6 py-4 font-medium">
                  <Link
                    href={`/admin/add-wines/${product.id}/edit`}
                    className="hover:underline"
                  >
                    {product.title}
                  </Link>
                </TableCell>
                <TableCell className="border px-6 py-4">
                  {product.price}
                </TableCell>
                <TableCell className="border px-6 py-4">
                  {product.productCode}
                </TableCell>
                <TableCell className="border px-6 py-4">
                  <div>
                    {new Date(product.createdAt).toLocaleDateString("en-CA")}
                    <span className="text-sm text-gray-500">&nbsp;at</span>{" "}
                    {new Date(product.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                </TableCell>
                <TableCell className="border px-6 py-4">
                  <div className="flex gap-1 justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        router.push(`/viineja-luettelo/viinit/${product.slug}`)
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        router.push(`/admin/add-wines/${product.id}/edit`)
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => handleDelete(String(product.id))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// export default AllWinesTable;
