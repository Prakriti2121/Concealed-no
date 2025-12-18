import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import sizeOf from "image-size";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export async function GET() {
  const imagesDirectory = path.join(process.cwd(), "public/uploads");
  try {
    const files = fs.readdirSync(imagesDirectory);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const getImageHash = (filePath: string): string => {
      const fileBuffer = fs.readFileSync(filePath);
      return crypto.createHash("md5").update(fileBuffer).digest("hex");
    };

    const seenHashes = new Set<string>();
    const images: {
      url: string;
      name: string;
      uploadTime: string;
      size: string;
      fullUrl: string;
      timestamp: number;
    }[] = [];

    files.forEach((file) => {
      const filePath = path.join(imagesDirectory, file);
      const ext = path.extname(file).toLowerCase();

      if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) {
        const hash = getImageHash(filePath);

        if (!seenHashes.has(hash)) {
          seenHashes.add(hash);

          const stats = fs.statSync(filePath);
          // Get image dimensions using the file buffer.
          const fileBuffer = fs.readFileSync(filePath);
          const dimensions = sizeOf(fileBuffer);
          // Format file size to the appropriate unit.
          const formattedSize = formatBytes(stats.size);

          images.push({
            url: `/uploads/${file}`,
            name: file,
            uploadTime: stats.mtime.toLocaleString(),
            size: `${formattedSize} (${dimensions.width}x${dimensions.height})`,
            fullUrl: `${baseUrl}/uploads/${file}`,
            timestamp: stats.mtime.getTime(),
          });
        }
      }
    });

    // Sort images by modification time (newest first)
    images.sort((a, b) => b.timestamp - a.timestamp);
    const responseImages = images.map(
      ({ url, name, uploadTime, size, fullUrl }) => ({
        url,
        name,
        uploadTime,
        size,
        fullUrl,
      })
    );

    return NextResponse.json(responseImages, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { imageName } = await req.json();
    const filePath = path.join(process.cwd(), "public/uploads", imageName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
  } catch {
    return NextResponse.json(
      { error: "Error deleting image" },
      { status: 500 }
    );
  }
}
