export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export const ADMIN_TOKEN_KEY = "adminToken";

export function getAdminToken() {
    return typeof window === "undefined" ? null : localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function clearAdminToken() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
}

// fetch wrapper for every admin screen: adds the token, and sends you to login if it's rejected
export async function adminFetch(path: string, init: RequestInit = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init.headers || {}),
            Authorization: `Bearer ${getAdminToken()}`,
        },
    });
    if (res.status === 401) {
        clearAdminToken();
        window.location.href = "/Admin/Login";
    }
    return res;
}