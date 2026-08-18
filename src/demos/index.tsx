import type { DemoConfig } from "@/data/types";
import BookingDemo from "./BookingDemo";
import OrderingDemo from "./OrderingDemo";
import CatalogDemo from "./CatalogDemo";

export function DemoRenderer({ config }: { config: DemoConfig }) {
  switch (config.kind) {
    case "booking":
      return <BookingDemo config={config} />;
    case "ordering":
      return <OrderingDemo config={config} />;
    case "catalog":
      return <CatalogDemo config={config} />;
  }
}