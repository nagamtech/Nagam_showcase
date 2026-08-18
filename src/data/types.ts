export type DemoKind = "booking" | "ordering" | "catalog";

export interface BookingConfig {
  kind: "booking";
  appName: string;
  tagline: string;
  proLabel: string;
  serviceLabel: string;
  pros: { id: string; name: string; role: string; rating: number; emoji: string }[];
  services: { id: string; name: string; duration: number; price: number; note: string }[];
}

export interface OrderingConfig {
  kind: "ordering";
  appName: string;
  tagline: string;
  categories: {
    id: string;
    name: string;
    emoji: string;
    items: { id: string; name: string; desc: string; price: number; emoji: string }[];
  }[];
}

export interface CatalogConfig {
  kind: "catalog";
  appName: string;
  tagline: string;
  variantLabel: string;
  categories: {
    id: string;
    name: string;
    emoji: string;
    items: {
      id: string;
      name: string;
      desc: string;
      price: number;
      emoji: string;
      variants: string[];
    }[];
  }[];
}

export type DemoConfig = BookingConfig | OrderingConfig | CatalogConfig;

export interface Solution {
  slug: string;
  segmentSlug: string;
  name: string;
  summary: string;
  problem: string;
  howItWorks: string[];
  benefits: string[];
  features: string[];
  flow: string[];
  tech: string[];
  differentials: string[];
  demo: DemoConfig;
}

export interface Segment {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  challenges: string[];
}