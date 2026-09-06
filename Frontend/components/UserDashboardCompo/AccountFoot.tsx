import { Contact, HomeIcon, Menu, Settings } from "lucide-react";
import Link from "next/link";
import AccountSideBar from "./AccountSIdebar";

export default function AccountFoot() {
    return(
        <>
        <div className="flex justify-between p-2 items-center rounded bg-white shadow-gray-400 mt-5 px-6 shadow-lg">
            <Link href={"/UserDashboard"} className="p-2 rounded-full bg-amber-900 text-orange-200 ">
                <div className="">
                <HomeIcon/>
                </div>
            </Link>
            <Link href={"/User/Settings"} className="p-2 rounded-full bg-amber-900 text-orange-200 ">
                <div className="">
                <Settings/>
                </div>
            </Link>
            <Link 
                href={"/"}
                className="p-2 rounded-full bg-amber-900 text-orange-200 ">
                <div className="">
                <Contact />
                </div>
            </Link>
            {/* <AccountSideBar /> */}
        </div>
    </>
    )
}