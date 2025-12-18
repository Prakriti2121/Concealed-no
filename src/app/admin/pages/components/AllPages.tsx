"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";

interface Page {
  id: number;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  author?: string;
  featuredImage?: string;
  seo?: string;
}

const AllPages = ({ pages }: { pages: Page[] }) => {
  const router = useRouter();

  const handleDelete = async (pageId: number) => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete page");

      alert("Page deleted successfully!");
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Pages</h1>
        <Button onClick={() => router.push("/admin/pages/new-page")}>
          Create New Page
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="border">Image</TableHead>
              <TableHead className="border">Title</TableHead>
              <TableHead className="border w-40">Date</TableHead>
              <TableHead className="border">Author</TableHead>
              <TableHead className="text-center border">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.id} className="border-b">
                <TableCell className="border">
                  {page.featuredImage ? (
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <Image
                        src={
                          page.featuredImage.startsWith("/")
                            ? page.featuredImage
                            : `/uploads/${page.featuredImage}`
                        }
                        alt={page.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 64px) 100vw, 64px"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium border">
                  {page.title}
                </TableCell>
                <TableCell className="border">
                  <div className="text-sm text-gray-500">Created</div>
                  <div>
                    {new Date(page.createdAt).toLocaleDateString("en-CA")}
                    <span className="text-sm text-gray-500">&nbsp;at</span>{" "}
                    {new Date(page.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                </TableCell>
                <TableCell className="border">{page.author}</TableCell>
                <TableCell className="border">
                  <div className="flex gap-1 justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/admin/pages/${page.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        router.push(`/admin/pages/${page.id}/edit`)
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => handleDelete(page.id)}
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

export default AllPages;
