import { Footer } from "@/components/atoms/Footer";
import { NavbarHome } from "@/components/sectionHome/navbarHome";

type MainLayoutProps = {
  children: React.ReactNode;
};

export const RealStateLayout = ({ children }: MainLayoutProps) => {
  return (
    <div>
      <NavbarHome />
      <div>{children}</div>
      <Footer />
    </div>
  );
};
