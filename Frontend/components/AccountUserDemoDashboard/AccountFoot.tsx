"use client"
import { Contact2, HomeIcon, Menu, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccountFoot() {
     const router = useRouter()
        const handleClick = () => {
            router.push("/Account/Signin")
        }

    return(
        <>
        <div className="flex justify-between  p-2 items-center rounded bg-white shadow-gray-400 mt-5 px-6 shadow-lg">
            <button 
                onClick={handleClick}
                className="p-2 rounded-full bg-amber-900 text-orange-200">
                <HomeIcon/>
            </button>
            <button 
                onClick={handleClick}
                 className="p-2 rounded-full bg-amber-900 text-orange-200">
                <Settings/>
            </button>
            {/* <AccountSideBar /> */}
            <button
                onClick={handleClick}
                className="p-2 rounded-full bg-amber-900 text-orange-200">
                <Contact2 />
            </button>
        </div>
    </>
    )
}