"use client";

type LinkColumn = {
  heading: string;
  links: string[];
};

const columns: LinkColumn[] = [
  {
    heading: "Personal",
    links: ["Open an Account", "Contact Us", "About Us"],
  },
  {
    heading: "Company",
    links: [
      "Sollnissolar",
      "Join Our Team",
      "Press & Media",
      "Become a Partner",
    ],
  },
  {
    heading: "Resource",
    links: [
      "Help Center",
      "Terms and Policy",
      "Security Trust Center",
    ],
  },
];

function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#00D9A6"
        d="M3.6 2.6c-.3.3-.5.7-.5 1.2v16.4c0 .5.2.9.5 1.2l.1.1L13 12l-9.3-9.5-.1.1Z"
      />
      <path
        fill="#FFD24C"
        d="m16.1 15.1-3.1-3.1L3.7 21.3c.4.4 1 .4 1.6.1l10.8-6.3Z"
      />
      <path
        fill="#FF4D5E"
        d="m16.1 8.9-10.8-6.3c-.6-.3-1.2-.3-1.6.1L13 12l3.1-3.1Z"
      />
      <path
        fill="#00B8FF"
        d="M20.2 10.6 16.6 8.5 13 12l3.6 3.6 3.6-2.1c1-.6 1-2.3 0-2.9Z"
      />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.7 12.7c0-2.4 2-3.6 2.1-3.7-1.1-1.6-2.9-1.9-3.6-1.9-1.5-.2-3 .9-3.7.9-.8 0-2-.9-3.3-.9-1.7 0-3.2 1-4.1 2.5-1.7 3-.4 7.5 1.3 10 .8 1.2 1.8 2.6 3.1 2.5 1.2-.1 1.7-.8 3.2-.8s2 .8 3.3.8c1.4 0 2.3-1.2 3.1-2.5.7-1 1-1.9 1.5-3.1-2.6-1-3-4.4.1-3.8ZM14.1 5.4c.6-.8 1.1-1.9 1-3-1 0-2.1.6-2.8 1.4-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.8-1.4Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#1C120B] px-6 pt-16 text-brand-cream/80">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 pb-14 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        {/* Brand blurb + app badges */}
        <div>
          <h2 className="mb-3 text-xl font-bold text-brand-cream">
            SollnisPay
          </h2>
          <p className="mb-6 max-w-xs text-sm leading-relaxed text-brand-cream/65">
            SollnisPay is a fast and growing platform where you can pay
            bills, convert currencies, and transact with high security
            at the best exchange rate.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="#"
              className="flex items-center gap-2.5 rounded-lg border border-brand-cream/15 bg-brand-cream/5 px-4 py-2.5 transition hover:bg-brand-cream/10"
            >
              <GooglePlayIcon className="h-5 w-5" />
              <span className="leading-tight">
                <span className="block text-[10px] text-brand-cream/55">
                  Get it on
                </span>
                <span className="block text-[13px] font-semibold text-brand-cream">
                  Google Play
                </span>
              </span>
            </a>

            <a
              href="#"
              className="flex items-center gap-2.5 rounded-lg border border-brand-cream/15 bg-brand-cream/5 px-4 py-2.5 transition hover:bg-brand-cream/10"
            >
              <AppleIcon className="h-5 w-5 text-brand-cream" />
              <span className="leading-tight">
                <span className="block text-[10px] text-brand-cream/55">
                  Get it on
                </span>
                <span className="block text-[13px] font-semibold text-brand-cream">
                  Apple Store
                </span>
              </span>
            </a>
          </div>
        </div>

        {/* Link columns */}
        {columns.map((col) => (
          <div key={col.heading}>
            <h3 className="mb-4 text-sm font-semibold text-brand-cream">
              {col.heading}
            </h3>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-brand-cream/65 transition hover:text-brand-orange"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-brand-cream/10 py-6">
        <div className="items-center">
          <p className="text-center text-xs text-brand-cream/55">
            &copy; {new Date().getFullYear()} SollnisPay. All rights reserved. Built and developed
            by Ifeoluwa Fowobaje.
          </p>
        </div>
      </div>
    </footer>
  );
}