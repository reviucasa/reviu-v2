import { NavbarHome } from "@/components/sectionHome/navbarHome";
import { Footer } from "../atoms/Footer";

type MainLayoutProps = {
  className?: string;
  children: React.ReactNode;
};

const MainLayout = ({ className, children }: MainLayoutProps) => {
  return (
    <div>
      <NavbarHome />
      <div className={`${className}`}>{children}</div>
      <Footer />
    </div>
  );
};

export default MainLayout;
