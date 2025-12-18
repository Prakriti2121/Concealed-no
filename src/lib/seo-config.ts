/**
 * Centralized SEO configuration
 * Controls indexing based on SHOULD_INDEX environment variable
 */

export const getRobotsConfig = () => {
  const shouldIndex = process.env.SHOULD_INDEX === "true";
  
  if (shouldIndex) {
    return {
      index: true,
      follow: true,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
      "max-video-preview": -1,
    };
  }
  
  return {
    index: false,
    follow: false,
  };
};

// For pages that use string format
export const getRobotsString = () => {
  const shouldIndex = process.env.SHOULD_INDEX === "true";
  
  return shouldIndex
    ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    : "noindex, nofollow";
};
