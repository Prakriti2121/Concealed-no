import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync, statSync, readFileSync } from "fs";
import sizeOf from "image-size";

// Helper function to format bytes to a human-readable string.
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type (allow only images)
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Validate file size (limit to 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define local upload directory
    const uploadDir = join(process.cwd(), "public", "uploads");

    // Ensure directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate filename
    const filename = file.name;

    // Define file path
    const filepath = join(uploadDir, filename);

    // Write file to the directory
    await writeFile(filepath, buffer);

    // Extract the current date and time for upload time
    const uploadTime = new Date().toLocaleString();

    // Calculate file stats and image dimensions
    const stats = statSync(filepath);
    const fileBuffer = readFileSync(filepath);
    const dimensions = sizeOf(fileBuffer);
    const formattedSize = formatBytes(stats.size);

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://www.cwno.vittvin.nu"
        : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Respond with the full image details including size and fullUrl
    return NextResponse.json({
      url: `${baseUrl}/uploads/${filename}`,
      success: true,
      name: filename,
      uploadTime: uploadTime,
      size: `${formattedSize} (${dimensions.width}x${dimensions.height})`,
      fullUrl: `${baseUrl}/uploads/${filename}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
