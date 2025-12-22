"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generateProductPDF } from "@/lib/utils/pdfGenerator";

interface PDFDownloadButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any; // Using any to handle Prisma return types that differ from our Product type
}

export default function PDFDownloadButton({ product }: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      // Parse taste array if needed
      const parsedProduct = {
        ...product,
        producerDescription: product.producerDescription || "",
        taste: (() => {
          if (!product.taste) return [];
          if (typeof product.taste === "string") {
            try {
              return JSON.parse(product.taste);
            } catch {
              return [product.taste];
            }
          }
          if (Array.isArray(product.taste)) {
            return product.taste;
          }
          return Object.values(product.taste);
        })(),
      };

      await generateProductPDF(parsedProduct);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Virhe PDF:n luomisessa. Yritä uudelleen.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleDownload}
      disabled={isGenerating}
      className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
    >
      <Download size={16} />
      {isGenerating ? "Luodaan PDF..." : "Lataa PDF"}
    </Button>
  );
}
