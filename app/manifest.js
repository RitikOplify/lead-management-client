export default function manifest() {
  return {
    name: "Lead Management Software",
    short_name: "LMS",
    description: "Lead Management Software for Efficient Sales Tracking",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/logo-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
