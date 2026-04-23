import { Link, useLocation, useNavigate } from "react-router-dom";
import { Smartphone, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    toast({ title: "Desconectado com sucesso" });
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <Smartphone className="h-6 w-6 text-accent" />
          <span>Master Cell</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/" className={`text-sm font-medium transition-colors hover:text-accent ${isActive("/") ? "text-accent" : "text-muted-foreground"}`}>Início</Link>
          <Link to="/produtos" className={`text-sm font-medium transition-colors hover:text-accent ${isActive("/produtos") ? "text-accent" : "text-muted-foreground"}`}>Produtos</Link>

          {user && isAdmin && (
            <Link to="/admin" className={`text-sm font-medium transition-colors hover:text-accent ${isActive("/admin") ? "text-accent" : "text-muted-foreground"}`}>
              Painel
            </Link>
          )}

          <Button asChild size="sm" className="bg-whatsapp hover:bg-whatsapp-hover text-whatsapp-foreground">
            <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </Button>

          {user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">Sair</span>
            </Button>
          ) : (
            <Button asChild size="sm" variant="default">
              <Link to="/admin/login">Entrar</Link>
            </Button>
          )}
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden border-t bg-card px-4 pb-4 pt-2 space-y-2">
          <Link to="/" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium">Início</Link>
          <Link to="/produtos" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium">Produtos</Link>

          {user && isAdmin && (
            <Link to="/admin" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium">Painel Admin</Link>
          )}

          <Button asChild size="sm" className="w-full bg-whatsapp hover:bg-whatsapp-hover text-whatsapp-foreground">
            <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </Button>

          {user ? (
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          ) : (
            <Button asChild size="sm" className="w-full" variant="default">
              <Link to="/admin/login" onClick={() => setOpen(false)}>Entrar</Link>
            </Button>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
