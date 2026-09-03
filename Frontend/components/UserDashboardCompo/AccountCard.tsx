"use client"
import { EyeIcon, Plus, EyeOffIcon, Link2, Divide } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AccountCard() {
    const [showBalance, setShowBalance] = useState(false)
    const toggleBalance = () => setShowBalance(!showBalance)

    return(
        <>
            <div className="flex flex-col gap-6 justify-center py-5 px-3 mx-auto w-full md:max-w-2xl md:p-10 bg-linear-to-r from-green-900 to-lime-400">
                <div className="flex items-center justify-between">
                    <div className="max-w-[200px]">
                        <p className="text-lg md:text-2xl text-white font-semibold whitespace-break-spaces">Welcome, <span className="text-green-100 font-semibold">Taiwo</span></p>
                    </div>
                    <div className="flex gap-4 text-lg md:text-2xl items-center">
                        <h2 className="font-semibold text-white">sollnispay</h2>
                        <Link href={"/User/Profile"} className="py-1 px-1.5 text-sm font-bold text-gray-700 bg-gray-200 rounded-full">TF</Link>
                    </div>
                </div>
                {/* bottom */}
                <div className="flex bg-lime-600 border border-dotted border-b-4 border-gray-300 rounded-2xl px-3 py-6 md:p-6  flex-col mt-10">
                    <div className="flex justify-between">
                        <div className="flex flex-col gap-1 mb-6">
                            <p className="text-white font-semibold text-lg md:text-2xl">Account Number</p>
                            <p className="text-white text-md md:text-xl">2345678923</p>
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
                            <div className="flex items-center gap-2">
                                <Link href={"/User/Deposit"}
                                    className="flex rounded-full px-2 py-1 bg-linear-to-r from-lime-700 to-green-900">
                                    <Plus size={17}/>
                                    <p className="text-[13px] md:text-sm whitespace-nowrap">Add Funds</p>
                                </Link>
                                <button onClick={toggleBalance} 
                                    className="text-xl bg-green-800 p-1 cursor-pointer rounded-full">
                                    {showBalance ? <EyeOffIcon size={17}/> : <EyeIcon size={17}/> }
                                </button>
                            </div>
                            <div className="flex items-center whitespace-nowrap justify-center">
                                <span className="text-[1.4rem] md:text-3xl font-bold">
                                    {showBalance? <div className="blur-[6px]">₦550,000.00</div> : '₦550,000.00'}
                                </span>
                            </div>  
                    </div>
                </div>
            </div>
        </>
    )
} 