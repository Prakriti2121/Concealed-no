import MediaGallery from "./components/mediagallery";

const MediaPage = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/media`, { cache: "no-store" });
  const images = await response.json();

  return (
    <div>
      <MediaGallery images={images} />
    </div>
  );
};

export default MediaPage;
