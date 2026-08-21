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

/* ---------- Gestão e operação (back-office) ---------- */

export interface CrmConfig {
  kind: "crm";
  appName: string;
  tagline: string;
  entityLabel: string;
  historyLabel: string;
  clients: {
    id: string;
    name: string;
    meta: string;
    emoji: string;
    tags: string[];
    visits: number;
    ticket: number;
    last: string;
    notes: string;
    history: { date: string; label: string; value: number }[];
  }[];
}

export interface InventoryConfig {
  kind: "inventory";
  appName: string;
  tagline: string;
  unitLabel: string;
  items: {
    id: string;
    name: string;
    category: string;
    emoji: string;
    stock: number;
    min: number;
    cost: number;
    supplier: string;
  }[];
}

export interface SalesConfig {
  kind: "sales";
  appName: string;
  tagline: string;
  staff: string[];
  products: { name: string; price: number }[];
  sales: {
    id: string;
    time: string;
    item: string;
    staff: string;
    payment: string;
    value: number;
  }[];
}

export interface StaffConfig {
  kind: "staff";
  appName: string;
  tagline: string;
  metricLabel: string;
  people: {
    id: string;
    name: string;
    role: string;
    emoji: string;
    done: number;
    revenue: number;
    commissionPct: number;
    shift: string;
  }[];
}

export interface TasksConfig {
  kind: "tasks";
  appName: string;
  tagline: string;
  owners: string[];
  tasks: {
    id: string;
    title: string;
    owner: string;
    priority: "alta" | "média" | "baixa";
    when: string;
    done: boolean;
  }[];
}

export interface TablesConfig {
  kind: "tables";
  appName: string;
  tagline: string;
  spotLabel: string;
  menu: { name: string; price: number }[];
  tables: {
    id: string;
    label: string;
    seats: number;
    status: "livre" | "ocupada" | "pagamento" | "reservada";
    waiter: string;
    openedAt: string;
    note: string;
    items: { name: string; qty: number; price: number }[];
  }[];
}

export interface WorkOrdersConfig {
  kind: "workorders";
  appName: string;
  tagline: string;
  orderLabel: string;
  subjectLabel: string;
  statuses: string[];
  orders: {
    id: string;
    code: string;
    customer: string;
    subject: string;
    status: string;
    responsible: string;
    opened: string;
    services: { name: string; price: number }[];
    parts: { name: string; qty: number; price: number }[];
    note: string;
  }[];
}

export interface FinanceConfig {
  kind: "finance";
  appName: string;
  tagline: string;
  opening: number;
  entries: {
    id: string;
    type: "entrada" | "saida";
    label: string;
    method: string;
    value: number;
    time: string;
  }[];
  bills: {
    id: string;
    label: string;
    due: string;
    value: number;
    kind: "pagar" | "receber";
    paid: boolean;
  }[];
}

export interface DashboardConfig {
  kind: "dashboard";
  appName: string;
  tagline: string;
  kpis: { label: string; value: string; delta: string; up: boolean }[];
  bars: { label: string; value: number }[];
  top: { label: string; value: string }[];
  alerts: string[];
  chain: string[];
}

export type DemoConfig =
  | BookingConfig
  | OrderingConfig
  | CatalogConfig
  | CrmConfig
  | InventoryConfig
  | SalesConfig
  | StaffConfig
  | TasksConfig
  | TablesConfig
  | WorkOrdersConfig
  | FinanceConfig
  | DashboardConfig;

export type SolutionAudience = "cliente" | "gestao";

export interface Solution {
  slug: string;
  segmentSlug: string;
  audience?: SolutionAudience;
  name: string;
  summary: string;
  problem: string;
  howItWorks: string[];
  benefits: string[];
  features: string[];
  flow: string[];
  tech: string[];
  differentials: string[];
  integrations?: string[];
  demo: DemoConfig;
}


export interface Segment {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  challenges: string[];
}