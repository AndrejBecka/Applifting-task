import type { LucideIcon } from "lucide-react";
import { PUBLIC_ROUTES, PRIVATE_ROUTES } from "~/routes/routes";

export type NavItem = {
  title: string;
  href: string;
  icon?: LucideIcon;
};

export const PUBLIC_HEADER_ROUTES: NavItem[] = [
  {
    title: "Recent Articles",
    href: PUBLIC_ROUTES.RECENT_ARTICLES,
  },
  {
    title: "About",
    href: PUBLIC_ROUTES.ABOUT,
  },
];

export const PRIVATE_HEADER_ROUTES: NavItem[] = [
  {
    title: "My Articles",
    href: PRIVATE_ROUTES.MY_ARTICLES,
  },
  {
    title: "Create Article",
    href: PRIVATE_ROUTES.CREATE_ARTICLE,
  },
  {
    title: "Edit Article",
    href: PRIVATE_ROUTES.EDIT_ARTICLE,
  },
];
