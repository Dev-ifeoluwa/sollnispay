import Animate from "components/Animate";

const stats = [
  { value: "99.9%", label: "Platform uptime" },
  { value: "<30s", label: "Average payment confirmation" },
  { value: "20+", label: "Billers and providers supported" },
];

const pillars = [
  {
    heading: "Bank-grade security",
    body: "Every transaction is encrypted end-to-end and processed through licensed payment channels, so your money and data stay protected at every step.",
  },
  {
    heading: "Built for reliability",
    body: "We monitor every biller connection around the clock and route payments through backup channels automatically if one provider is slow.",
  },
  {
    heading: "Transparent by default",
    body: "No hidden charges. You see the exact fee before you confirm, every single time — on airtime, data, cable, or electricity.",
  },
];

export default function About() {
  return (
    <section className="bg-brand-cream px-6 py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-14 md:grid-cols-[1.1fr_0.9fr] md:gap-18">
        {/* Left column — narrative */}
        <div>
          <span className="mb-6 inline-block rounded-full bg-brand-orange-bg px-3.5 py-1.5 text-[13px] font-semibold tracking-wide text-brand-orange">
            About the sollnispay
          </span>

          <Animate type="fade-down" delay={300}>
          <h2 className="mb-6 max-w-lg text-2xl mt-0.5 md:text-3xl lg:text-5xl font-bold leading-tight text-brand-brown">
            One platform, built to make every bill payment effortless
          </h2>
          </Animate>

          <p className="mb-10 max-w-md text-[17px] leading-relaxed text-brand-brown-soft">
            We built this platform because paying bills in Nigeria
            shouldn't mean juggling five different apps, unstable
            connections, and unclear charges. From airtime and data to
            cable subscriptions and electricity tokens, everything routes
            through one secure, dependable system so you spend less
            time on logistics and more time on what actually matters to
            you.
          </p>

          {/* <div className="grid gap-7">
            {pillars.map((pillar) => (
              <div key={pillar.heading} className="flex items-start gap-4">
                <span className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-brand-orange" />
                <div>
                  <h3 className="mb-1.5 text-base font-semibold text-brand-brown">
                    {pillar.heading}
                  </h3>
                  <p className="max-w-sm text-[15px] leading-relaxed text-brand-brown-muted">
                    {pillar.body}
                  </p>
                </div>
              </div>
            ))}
          </div> */}
        </div>

        {/* Right column — reliability panel */}
        <div className="relative overflow-hidden rounded-2xl bg-brand-brown px-9 py-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-brand-orange opacity-15" />

          <p className="relative mb-2 text-[13px] font-semibold tracking-wide text-brand-orange-light">
            Why people trust us
          </p>
          <p className="relative mb-9 text-xl font-medium leading-snug text-brand-cream">
            Numbers we hold ourselves to, every day.
          </p>

          <div className="relative grid gap-6">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={
                  i < stats.length - 1
                    ? "border-b border-brand-cream/10 pb-6"
                    : ""
                }
              >
                <div className="mb-2 text-4xl font-bold leading-none text-brand-orange">
                  {stat.value}
                </div>
                <div className="text-sm text-brand-cream/70">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}