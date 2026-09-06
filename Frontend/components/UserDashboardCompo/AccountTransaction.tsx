import {
    ArrowBigDownIcon,
  Banknote,
  Earth,
  LoaderIcon,
  Monitor,
  PenIcon,
  Phone,
  Plane,
} from "lucide-react";
import Link from "next/link";

export default function AccountTransaction() {
  const TransactionCard = [
    {
      icon: <Phone />,
      itemsPurchase: "Airtime Purchase",
      itemsDetails: "MTN",
      DayPurchased: "Today,",
      itemsTime: "10:30 AM",
      Amount: "- ₦1,000",
    },
    {
      icon: <Banknote />,
      itemsPurchase: "Xelviotransfer",
      itemsDetails: "Transfer",
      DayPurchased: "Yesterday,",
      itemsTime: "05:50 PM",
      Amount: "- ₦100,000",
    },
    {
      icon: <LoaderIcon />,
      itemsPurchase: "Wages",
      itemsDetails: "Company",
      DayPurchased: "Sep 22, 2025",
      itemsTime: "03:00 PM",
      Amount: "+ ₦750,000",
    },
    {
      icon: <Monitor />,
      itemsPurchase: "DSTV Subscription",
      itemsDetails: "Premium",
      DayPurchased: "Sep 16, 2025",
      itemsTime: "11:30 AM",
      Amount: "- ₦19,000",
    },
    {
      icon: <Earth />,
      itemsPurchase: "Data Purchase",
      itemsDetails: "Glo",
      DayPurchased: "Sep 14, 2025",
      itemsTime: "8:30 AM",
      Amount: "- ₦5,000",
    },
    // {
    //   icon: <Plane />,
    //   itemsPurchase: "Travel",
    //   itemsDetails: "Airline",
    //   DayPurchased: "Sep 14, 2025",
    //   itemsTime: "9:30 AM",
    //   Amount: "- ₦500,000",
    // },
  ];

  return (
    <>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg md:text-xl text-green-950 font-semibold">
            Recent Transaction
          </h4>
          <span className="flex p-1 shadow-gray-500 shadow-sm cursor-pointer text-[10px] md:text-sm bg-orange-700 items-center gap-1 text-white rounded-3xl">
            <p className="bg-lime-100 p-0.5 text-gray-700 rounded-2xl">
              7days
            </p>
            <p className="text-gray-800">30days</p>
          </span>
        </div>
        {/* transaction history */}
        <div>
          {TransactionCard.map((TransactionCard, index) => (
            <div key={index} className="p-1 cursor-pointer flex flex-col">
              <div className="flex justify-between px-2 py-3 rounded-md shadow-gray-300 shadow-sm items-center gap-3">
                <span className="rounded-full text-green-700">{TransactionCard.icon}</span>
                <div className="flex flex-col max-w-sm md:w-full items-center">
                  <h4 className="font-semibold text-sm md:text-md">
                    {TransactionCard.itemsPurchase}
                  </h4>
                  <div className="flex text-[12px] md:text-md items-center gap-1 text-gray-700">
                    <p>{TransactionCard.itemsDetails}</p>
                    <p>{TransactionCard.DayPurchased}</p>
                    <p>{TransactionCard.itemsTime}</p>
                  </div>
                </div>
                <p
                  className={`font-semibold text-sm md:text-lg ${
                    TransactionCard.Amount.startsWith("+")
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {TransactionCard.Amount}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
