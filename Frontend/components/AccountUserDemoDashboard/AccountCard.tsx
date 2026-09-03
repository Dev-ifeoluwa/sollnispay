"use client"
import { EyeIcon, Plus, StampIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function AccountCard() {

    const router = useRouter()
    const handleClick = () => {
        router.push("/Account/Signin")
    }

    return(
        <>
            <div className="flex flex-col gap-6 justify-center p-4 mx-auto w-full md:max-w-2xl md:p-10 bg-[radial-gradient(ellipse_at_top_left,_#FF6B00,_#3D2416_40%,_#1C110A_90%)]">
                <div className="flex items-center pt-2 justify-between">
                    <div className="flex gap-3 text-lg items-center">
                        <p className="text-lg md:text-2xl text-white font-semibold">Hi</p>
                        <button 
                            onClick={handleClick}
                            className="py-1 px-3 text-sm font-semibold text-gray-50 shadow-sm cursor-pointer shadow-white rounded-full">Login
                        </button>
                    </div>
                    <div>
                        <h2 className="font-semibold text-white text-lg md:text-2xl">Sollnispay</h2>
                    </div>
                </div>
                {/* bottom */}
                <div className="flex bg-orange-800 border border-dotted border-b-4 border-gray-300 rounded-2xl p-6 flex-col mt-10">
                    <div className="flex  justify-between">
                        <div className="flex flex-col gap-1 mb-6">
                            <p className="text-white font-semibold text-lg md:text-2xl">Account Number</p>
                            <Link href="/Account/Signin" className="text-lg md:text-2xl text-white">********</Link>
                        </div>
                        <div className="flex flex-col gap-7 items-center">
                            <div className="flex gap-2 items-center">
                                <p className="text-md text-white font-semibold">Currency</p>
                                <select name="" id="" className="text-white border-0 outline-0">
                                    <option value="" className="text-black">$</option>
                                    <option value="" className="text-black">£</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between gap-4 items-center text-white">
                            <div className="flex items-center gap-4">
                                <span className="bg-orange-950 p-1 rounded-full"><EyeIcon size={18}/></span>
                                <span className="bg-orange-950 p-1 rounded-full"><Plus size={18}/></span>
                            </div>
                            <Link href="/Account/Signin" className="text-lg md:text-2xl text-white">******</Link>
                    </div>
                </div>
            </div>
        </>
    )
} 