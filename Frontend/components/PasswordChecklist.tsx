"use client";

import { Check, X } from "lucide-react";

// Keep these in step with src/common/password-policy.ts on the backend.
// The backend is the real gatekeeper; this just helps the user as they type.
export const passwordRules = [
  { id: "length", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { id: "lower", label: "A lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { id: "upper", label: "An uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { id: "number", label: "A number", test: (p: string) => /\d/.test(p) },
  {
    id: "special",
    label: "A special character (! @ # $ ...)",
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
];

export const isStrongPassword = (password: string) =>
  passwordRules.every((rule) => rule.test(password));

const PasswordChecklist = ({ password }: { password: string }) => {
  if (!password) return null;

  return (
    <ul className="mt-2 space-y-1">
      {passwordRules.map((rule) => {
        const ok = rule.test(password);
        return (
          <li
            key={rule.id}
            className={`flex items-center gap-1.5 text-[10px] ${
              ok ? "text-green-400" : "text-white/60"
            }`}
          >
            {ok ? <Check size={11} /> : <X size={11} />}
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
};

export default PasswordChecklist;