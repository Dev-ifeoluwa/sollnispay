import { Product } from "types";
import {
    Wallet,
    Gamepad2,
    PhoneCall,
    Earth,
    EuroIcon,
    WalletCards,
    Plane,
    Network,
    Monitor,
    LoaderIcon,
    IdCard,
    ShoppingBag
  } from "lucide-react";



  export const Products: Product[] = [
    {
      icon: IdCard,
      Name: "Gift card",
      href: "/User/GiftCard"
    },
    {
      icon: EuroIcon,
      Name: "Convert money",
      href: "/User/Convertmoney",
      comingSoon: true,  
    },
    {
      icon: Earth,
      Name: "Mobile data",
      href: "/User/Mobiledata",
      comingSoon: true,
    },
    {
      icon: PhoneCall,
      Name: "Airtime",
      href: "/User/AirtimeTopup",
      comingSoon: true,
    },
    {
      icon: Gamepad2,
      Name: "Betting",
      href: "/User/Betting",
      comingSoon: true,
    },
    {
      icon: Monitor,
      Name: "Tv subscription",
      href: "/User/Tvsubscription",
      comingSoon: true,
    },
    // {
    //   icon: LoaderIcon,
    //   Name: "view More",
    //   href: "/User/ViewMore"
    // },
  ]



