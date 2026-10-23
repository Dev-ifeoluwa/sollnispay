"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { clearPwaCaches } from "lib/pwa";

export default function DeleteAccountButton() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/delete-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        await clearPwaCaches();    
        localStorage.removeItem("token");
        toast.success("Your account has been deleted.");
        router.push("/Account/Signin");
        return;
      }
      if (res.status === 401) { 
        await clearPwaCaches();
        router.push("/Account/Signin"); return; }
      const err = await res.json().catch(() => null);
      toast.error((Array.isArray(err?.message) ? err.message[0] : err?.message) ?? "Could not delete account.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="w-full mt-7 py-3 text-sm font-semibold text-[#e8563a] rounded-xl border border-[#e8563a]/30">
        Delete my account
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#26140c] border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-[#fbf3ec]">Delete your account?</h3>
            <p className="text-xs text-[#8f7768] mt-2">
              This is permanent. Your personal details are removed and you can't log in again.
              Transaction records are kept for financial record-keeping. Your balance must be ₦0
              with no pending orders.
            </p>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full mt-4 bg-transparent border-b border-white/20 text-[#fbf3ec] py-2 outline-none" />
            <input value={confirm} onChange={(e) => setConfirm(e.target.value)}
              placeholder='Type "DELETE" to confirm'
              className="w-full mt-4 bg-transparent border-b border-white/20 text-[#fbf3ec] py-2 outline-none" />
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setOpen(false); setPassword(""); setConfirm(""); }}
                className="flex-1 py-2.5 rounded-lg bg-white/10 text-[#d8c3b6] text-sm">Cancel</button>
              <button onClick={handleDelete}
                disabled={loading || !password || confirm !== "DELETE"}
                className="flex-1 py-2.5 rounded-lg bg-[#e8563a] text-white text-sm font-semibold disabled:opacity-40">
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}