import { Product } from "types";
import {
    Wallet,
    Gamepad2,
    PhoneCall,
    Earth,
    BookIcon,
    EuroIcon,
    WalletCards,
    // Card,
    Plane,
    Network,
    Monitor,
    LoaderIcon,
    IdCard,
    ShoppingBag
  } from "lucide-react";



  export const Products: Product[] = [
    {
      icon: Earth,
      Name: "Mobile data",
      // href: "/",
      href: "/User/Mobiledata",
      // comingSoon: true,
    },
    {
      icon: PhoneCall,
      Name: "Airtime",
      // href: "",
      href: "/User/AirtimeTopup",
      // comingSoon: true,
    },
     {
      icon: Monitor,
      Name: "Cable TV",
      // href: "",
      href: "/User/Tvsubscription",
      // comingSoon: true,
    },
    {
      icon: IdCard,
      Name: "Virtual card",
      href: "/User/Card",
      // comingSoon: true,
    },
    // {
    //   icon: BookIcon,
    //   Name: "Education",
    //   href: "",
    //   // href: "/User/Betting",
    //   comingSoon: true,
    // },
    {
      icon: IdCard,
      Name: "Gift card",
      href: "",
      // href: "/User/GiftCard",
      comingSoon: true,
    },
    {
      icon: EuroIcon,
      Name: "FX swap",
      href: "",
      // href: "/User/Convertmoney",
      comingSoon: true,  
    },
    // {
    //   icon: Gamepad2,
    //   Name: "Betting",
    //   href: "",
    //   // href: "/User/Betting",
    //   comingSoon: true,
    // },
   
    // {
    //   icon: LoaderIcon,
    //   Name: "view More",
    //   href: "/User/ViewMore"
    // },
  ]



