import { Link } from "react-router-dom";
import {
  Shield,
  CheckCircle,
  Headphones,
  ArrowRight,
  MessageCircle,
  Truck,
  Star,
  Award,
  Zap,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useEffect, useMemo, useState } from "react";
import { supabase, type Product } from "@/lib/supabase";
import { getSettings, BRANDS } from "@/lib/products";

const ICONS: Record<string, any> = {
  Shield,
  CheckCircle,
  Headphones,
  Truck,
  Star,
  Award,
  Zap
};

const Home = () => {
  const [s, setS] = useState(getSettings());
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const h = () => setS(getSettings());
    window.addEventListener("settings-updated", h);
    return () => window.removeEventListener("settings-updated", h);
  }, []);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts((data || []) as Product[]);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = useMemo(
    () =>
      brandFilter === "all"
        ? products
        : products.filter((p) => p.brand === brandFilter),
    [products, brandFilter]
  );

  const featured = filtered.filter((p) => p.featured).slice(0, 4);
  const list = filtered.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden text-white" style={{ backgroundColor: '#3B6FD8' }}>
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #ffffff 0%, transparent 50%)"
          }}
        />
        <div className="container mx-auto px-4 py-20 md:py-28 relative grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
              {s.heroTitle}
            </h1>
            <p className="text-lg opacity-90 max-w-lg text-white">
              {s.heroSubtitle}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="border-2 border-white bg-transparent text-white hover:bg-white/10">
                <Link to="/produtos">
                  Ver catálogo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-white/90" style={{ backgroundColor: 'white', color: '#3B6FD8' }}>
                <a
                  href={`https://wa.me/${s.whatsappNumber}`}
                  target="_blank"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {s.heroCtaText}
                </a>
              </Button>
            </div>
          </div>

          <div className="hidden md:flex justify-center items-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F2ab7f0f046f142c08bab1f7e136ba5b7%2F7bdd4f69137248a0949c7ef544dcf127?format=webp&width=800&height=1200"
              alt="Master Cell Logo"
              className="h-80 w-auto"
            />
          </div>
        </div>
      </section>

      {/* Brand filter */}
      <section className="container mx-auto px-4 pt-12">
        <div className="flex flex-wrap gap-2 justify-center">
          <button onClick={() => setBrandFilter("all")} className="px-4 py-2 rounded-full text-sm font-medium transition-colors hover:text-primary">
            Todas
          </button>
          {BRANDS.map((b) => (
            <button key={b} onClick={() => setBrandFilter(b)} className="px-4 py-2 rounded-full text-sm font-medium transition-colors hover:text-primary">
              {b}
            </button>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Em destaque</h2>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ gridAutoRows: "1fr" }}>
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Vitrine */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-8">Vitrine</h2>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ gridAutoRows: "1fr" }}>
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* WhatsApp CTA */}
      <section className="text-center py-16">
        <h2 className="text-3xl font-bold">
          {s.whatsappSectionTitle}
        </h2>
        <p>{s.whatsappSectionText}</p>

        <Button asChild size="lg">
          <a href={`https://wa.me/${s.whatsappNumber}`}>
            <MessageCircle className="mr-2" />
            {s.whatsappSectionCta}
          </a>
        </Button>
      </section>
    </div>
  );
};

export default Home;
