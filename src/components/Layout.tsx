import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import FloatingButtons from "./FloatingButtons";

const Layout = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1" style={{ backgroundColor: '#3A3A32' }}>
      <Outlet />
    </main>
    <Footer />
    <FloatingButtons />
  </div>
);

export default Layout;
