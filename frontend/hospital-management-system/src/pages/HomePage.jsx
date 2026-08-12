import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import HeroSection from "../components/HeroSection";
import StatsBar from "../components/StatsBar";
import ServicesSection from "../components/ServicesSection";
import AboutSection from "../components/AboutSection";
import SiteFooter from "../components/SiteFooter";
import AppointmentModal from "../components/AppointmentModal";

export default function HomePage() {
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const openAppointmentModal = () => setShowAppointmentModal(true);
  const closeAppointmentModal = () => setShowAppointmentModal(false);

  return (
    <>
      <SiteHeader onBookAppointment={openAppointmentModal} />
      <main className="bg-surface">
        <HeroSection onBookAppointment={openAppointmentModal} />
        <StatsBar />
        <ServicesSection />
        <AboutSection />
      </main>
      <SiteFooter />
      <AppointmentModal
        show={showAppointmentModal}
        onHide={closeAppointmentModal}
      />
    </>
  );
}
