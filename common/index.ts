import {
  ListBulletIcon,
  HomeIcon,
  BriefcaseIcon,
  SparklesIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { NavItem } from "@/types";

export const navigation: { [key: string]: Array<NavItem> } = {
  home: [{ name: "Home", href: "/", icon: HomeIcon }],
  services: [{ name: "Services", href: "/services", icon: BriefcaseIcon }],
  studio: [{ name: "Studio", href: "/studio", icon: SparklesIcon }],
  history: [{ name: "History", href: "/history", icon: ListBulletIcon }],
  about: [{ name: "About", href: "/about", icon: InformationCircleIcon }],
};