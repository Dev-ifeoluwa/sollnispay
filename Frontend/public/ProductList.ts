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
      Name: "Convert Funds",
      href: "/User/Convertmoney"
    },
    {
      icon: Earth,
      Name: "Mobile data",
      href: "/User/Mobiledata"
    },
    {
      icon: PhoneCall,
      Name: "Airtime Topup",
      href: "/User/AirtimeTopup"
    },
    {
      icon: Gamepad2,
      Name: "Sport wallet Funding",
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



