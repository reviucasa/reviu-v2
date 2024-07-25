import { MetadataRoute } from "next";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  return {
    name: "Reviu",
    start_url: "/",
  };
}
