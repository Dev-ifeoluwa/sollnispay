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
      href: "/User/Mobiledata"
    },
    {
      icon: PhoneCall,
      Name: "Airtime",
      href: "/User/AirtimeTopup"
    },
    {
      icon: Gamepad2,
      Name: "Sport betting",
      href: "/User/Betting"
    },
    {
      icon: Monitor,
      Name: "Tv subscription",
      href: "/User/Tvsubscription"
    },
    // {
    //   icon: LoaderIcon,
    //   Name: "view More",
    //   href: "/User/ViewMore"
    // },
  ]



