import { NextResponse } from "next/server";
import {
  sitemapTemplate,
  rowsTemplate,
  formatUTC,
} from "@/app/utils/sitemapUtils";
import fs from "fs";
import path from "path";

export async function GET() {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_BASE_URL!;

  // Get all images from public/images and public/uploads directories
  const attachments: { url: string; lastmod: string }[] = [];

  try {
    const publicPath = path.join(process.cwd(), "public");
    const imageDirs = ["images", "uploads"];

    for (const dir of imageDirs) {
      const dirPath = path.join(publicPath, dir);
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        files.forEach((file) => {
          if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)) {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);
            attachments.push({
              url: `${baseUrl}/${dir}/${file}`,
              lastmod: formatUTC(stats.mtime),
            });
          }
        });
      }
    }
  } catch (error) {
    console.error("Error reading attachment directories:", error);
  }

  const rows = rowsTemplate(attachments);
  const html = sitemapTemplate(rows, attachments.length);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
