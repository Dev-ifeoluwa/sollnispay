import Footer from "components/PersonalComponent/Footer";
import Navbar from "components/PersonalComponent/Navbar";
import About from "components/PersonalComponent/About";
import Benefit from "components/PersonalComponent/Benefit";
import Hero from "components/PersonalComponent/Hero";
import Payment from "components/PersonalComponent/Payment";
import PersonalAccount from "components/PersonalComponent/PersonalAccount";
import CTA from "components/PersonalComponent/Cta";

export default function PersonalPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Benefit />
      {/* <PersonalAccount /> */}
      {/* <Payment /> */}
       <CTA />
      <Footer />
    </>
  );
}
