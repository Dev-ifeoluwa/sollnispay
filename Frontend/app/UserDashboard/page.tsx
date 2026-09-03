"use client";
import AccountProductCard from "components/UserDashboardCompo/AccountProductCard";
import { useEffect, useState } from "react";
import { EyeIcon, Plus, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Preloader from "components/preloader";


export default function UserDashboard() {
    const router = useRouter();
    const [dashboard, setDashboard] = useState<any>(null);
    const [showBalance, setShowBalance] = useState(false)
    const toggleBalance = () => setShowBalance(!showBalance)

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error("No token found, redirecting to signin.");
            router.push('/Account/Signin');
            return;
        }

        const fetchDashboard = async () => {
            // const res = await fetch('https://shalompay.onrender.com/auth/me', {
            const res = await fetch(`${API_URL}/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                // credentials: "include",
            })
            if (res.ok) {
                const data = await res.json();
                // console.log('user Info', data);
                setDashboard(data.dashboard);
            } else if (res.status === 401) {
                console.error("Unauthorized, redirecting to signin.");
                router.push('/Account/Signin');
            } else {
                console.error("Failed to fetch dashboard data.");
            }
        }
        fetchDashboard();
    }, []);

    return (
        <>
            {!dashboard ? (
                <div>
                    <Preloader />
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-6 justify-center py-8 px-3 mx-auto w-full md:max-w-2xl md:p-10 bg-linear-to-r from-green-900 to-lime-400">
                        <div className="flex items-center justify-between">
                            <div className="max-w-[200px]">
                                <p className="text-lg md:text-2xl text-white font-semibold whitespace-break-spaces">Welcome, <span className="text-green-100 font-semibold">{dashboard.firstName}!</span></p>
                            </div>
                            <div className="flex gap-4 text-lg md:text-2xl items-center">
                                <h2 className="font-semibold text-white">Sollnispay</h2>
                                <Link href={"/User/Profile"} className="p-2 text-sm font-bold text-gray-700 bg-gray-200 rounded-full">
                                    {`${dashboard.firstName?.[0] ?? "U"}${dashboard.lastName?.[0] ?? ""}`}
                                </Link>
                            </div>
                        </div>
                        {/* bottom */}
                        <div className="flex bg-lime-600 border border-dotted border-b-4 border-gray-300 rounded-2xl px-3 py-6 md:p-6  flex-col mt-10">
                            <div className="flex justify-between">
                                <div className="flex flex-col gap-1 mb-6">
                                    <p className="text-white font-semibold text-lg md:text-2xl">Account Number</p>
                                    <p className="text-white text-md md:text-xl">************</p>
                                    <p className="text-white text-md md:text-xl">{dashboard.accountNumber}</p>
                                </div>
                                <div className="flex flex-col gap-0.5 text-white text-right">
                                    <div className="flex gap-2 items-center">
                                        <p className="text-md text-white font-semibold">Currency</p>
                                        <select name="" id="" className="text-white border-0 outline-0">
                                            <option value="" className="text-black">$</option>
                                            <option value="" className="text-black">£</option>
                                        </select>
                                    </div>
                                    <span>
                                        {showBalance ? <span className="blur-[6px]">${dashboard.balance.toFixed(2)}</span> : <>${dashboard.balance.toFixed(2)}</>}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between gap-4 items-center text-white">
                                <div className="flex items-center gap-2">
                                    <Link href={"/User/Deposit"}
                                        className="flex rounded-full px-2 py-1 bg-linear-to-r from-lime-700 to-green-900">
                                        <Plus size={17} />
                                        <p className="text-[13px] md:text-sm whitespace-nowrap">Fund Wallet</p>
                                    </Link>
                                    <button onClick={toggleBalance}
                                        className="text-xl bg-green-800 p-1 cursor-pointer rounded-full">
                                        {showBalance ? <EyeOffIcon size={17} /> : <EyeIcon size={17} />}
                                    </button>
                                </div>
                                <div className="flex flex-col -gap-4 items-center whitespace-nowrap justify-center">
                                    <span className="text-[1.4rem] md:text-3xl font-bold">
                                        {showBalance ? <span className="blur-[6px]">₦{dashboard.balance.toFixed(2)}</span> : <>₦{dashboard.balance.toFixed(2)}</>}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <AccountProductCard />
                    <div className="flex flex-col gap-3 p-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-lg md:text-xl text-green-950 font-semibold">
                                Recent Transaction
                            </h4>
                            <span className="flex p-1 shadow-gray-500 shadow-sm cursor-pointer text-[10px] md:text-sm bg-green-300 items-center gap-1 text-white rounded-3xl">
                                <p className="bg-lime-100 p-0.5 text-gray-700 rounded-2xl">
                                    7days
                                </p>
                                <p className="text-gray-800">30days</p>
                            </span>
                        </div>
                        {/* transaction history */}
                        <div>
                            {dashboard.transactions.length === 0 ? (
                                <p className="text-gray-600 mb-20 mt-5 text-center">No transactions made yet.</p>
                            ) : (
                                <div>
                                    {dashboard.transactions.map((tx: any) => (
                                        <div key={tx.id} className="p-1 cursor-pointer flex flex-col mb-15">
                                            <div className="flex justify-between px-2 py-3 rounded-md shadow-gray-300 shadow-sm items-center gap-3">
                                                {/* <span className="rounded-full text-green-700">{TransactionCard.icon}</span> */}
                                                <div className="flex flex-col max-w-sm md:w-full items-center">
                                                    <h4 className="font-semibold text-sm md:text-md">
                                                        {tx.itemsPurchase}
                                                    </h4>
                                                    <div className="flex text-[12px] md:text-md items-center gap-1 text-gray-700">
                                                        <p>{tx.description}</p>
                                                        <p>{tx.DayPurchased}</p>
                                                        <p>{tx.itemsTime}</p>
                                                    </div>
                                                </div>
                                                <p className="font-semibold text-sm md:text-lg">{tx.amount}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

        </>
    )
}