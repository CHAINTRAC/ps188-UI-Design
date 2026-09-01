import FlowBackground from "../components/landing/FlowBackground";
import ScrollProgress from "../components/landing/ScrollProgress";
import Nav from "../components/landing/Nav";
import Hero from "../components/landing/Hero";
import ThreatLog from "../components/landing/ThreatLog";
import HowItWorks from "../components/landing/HowItWorks";
import ImpactStrip from "../components/landing/ImpactStrip";
import GetStarted from "../components/landing/GetStarted";
import Footer from "../components/landing/Footer";

export default function Landing() {
  return (
    <div className="relative min-h-screen">
      <FlowBackground />
      <ScrollProgress />
      <Nav />
      <Hero />
      <ThreatLog />
      <HowItWorks />
      <ImpactStrip />
      <GetStarted />
      <Footer />
    </div>
  );
}
