import {LucideIcon} from "lucide-react";

export type Product = {
    Name: string;
    href: string;
    icon: LucideIcon;
    comingSoon?: boolean;
};