import { NavbarHome } from "@/components/sectionHome/navbarHome";
import { Footer } from "../atoms/Footer";

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div>
      <NavbarHome />
      <div>{children}</div>
      <Footer />
    </div>
  );
};
