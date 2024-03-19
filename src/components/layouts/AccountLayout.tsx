import { NavbarHome } from "@/components/sectionHome/navbarHome";

type MainLayoutProps = {
  children: React.ReactNode;
};

export const AccountLayout = ({ children }: MainLayoutProps) => {
  return (
    <div>
      <NavbarHome />
      <div>{children}</div>
    </div>
  );
};
