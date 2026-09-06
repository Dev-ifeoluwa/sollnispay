import AccountCard from "components/AccountUserDemoDashboard/AccountCard";
import AccountFoot from "components/AccountUserDemoDashboard/AccountFoot";
import AccountProductCard from "components/AccountUserDemoDashboard/AccountProductCard";

export default function Loginaccount() {
    return(
        <>
        <div className="justify-center shadow-gray-200 shadow-lg mx-auto w-full md:max-w-2xl md:px-0 relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#1a0f0a_0%,#0e0704_40%,#0a0503_100%)]">
        <AccountCard />
        <AccountProductCard />
        <AccountFoot />
        </div>
        </>
    )
}