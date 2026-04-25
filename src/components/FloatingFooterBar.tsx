import { useState, useEffect } from "react";
import { ArrowUp, MapPin } from "lucide-react";
import { getSettings } from "@/lib/products";

const FloatingFooterBar = () => {
  const [num, setNum] = useState(getSettings().whatsappNumber);

  useEffect(() => {
    const handleSettings = () => setNum(getSettings().whatsappNumber);
    window.addEventListener("settings-updated", handleSettings);
    return () => window.removeEventListener("settings-updated", handleSettings);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t"
      style={{
        backgroundColor: "#000",
        borderColor: "#FFF9E6",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="grid grid-cols-3 h-20">
        {/* Left - Scroll to Top */}
        <button
          onClick={scrollToTop}
          className="flex items-center justify-center transition-all duration-300 group relative overflow-hidden"
          style={{
            borderRight: "1px solid #FFF9E6",
          }}
          aria-label="Scroll to top"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/20 group-hover:to-blue-500/0 transition-all duration-300"></div>
          <div className="flex flex-col items-center gap-1 relative z-10">
            <ArrowUp className="h-7 w-7 text-blue-400 transition-all duration-300 group-hover:text-blue-300 group-hover:scale-125" />
            <span className="text-xs font-semibold text-white opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              Topo
            </span>
          </div>
        </button>

        {/* Center - Google Maps */}
        <a
          href="https://maps.app.goo.gl/kP9HvFtU6faBvTPA9"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center transition-all duration-300 group relative overflow-hidden"
          style={{
            borderRight: "1px solid #FFF9E6",
          }}
          aria-label="Localização no Google Maps"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-500/0 group-hover:from-red-500/20 group-hover:to-red-500/0 transition-all duration-300"></div>
          <div className="flex flex-col items-center gap-1 relative z-10">
            <MapPin className="h-7 w-7 text-red-400 transition-all duration-300 group-hover:text-red-300 group-hover:scale-125" />
            <span className="text-xs font-semibold text-white opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              Localização
            </span>
          </div>
        </a>

        {/* Right - WhatsApp */}
        <a
          href={`https://wa.me/${num}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center transition-all duration-300 group relative overflow-hidden"
          aria-label="Contato via WhatsApp"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/30 group-hover:to-emerald-500/0 transition-all duration-300"></div>
          <div className="flex flex-col items-center gap-1 relative z-10">
            {/* Official WhatsApp Logo SVG */}
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-7 w-7 text-emerald-400 transition-all duration-300 group-hover:text-emerald-300 group-hover:scale-125"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.006c-1.504 0-2.992-.513-4.255-1.637l-.305-.249-3.159.829.843-3.075c-.738-1.274-1.161-2.747-1.161-4.288 0-4.966 4.029-9 8.99-9 2.39 0 4.626.931 6.312 2.612 1.686 1.681 2.612 3.915 2.612 6.305 0 4.966-4.029 9-8.99 9m7.772-18.355c-2.937-2.925-6.84-4.536-10.986-4.536-8.55 0-15.5 6.9-15.5 15.4 0 2.718.707 5.35 2.05 7.697L0 24l8.116-2.129c2.26 1.23 4.786 1.879 7.384 1.879 8.55 0 15.5-6.9 15.5-15.4 0-4.118-1.595-7.986-4.49-10.878" />
            </svg>
            <span className="text-xs font-semibold text-white opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              WhatsApp
            </span>
          </div>
        </a>
      </div>
    </div>
  );
};

export default FloatingFooterBar;
