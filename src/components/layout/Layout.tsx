import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
  variant?: "default" | "dashboard" | "page";
  showHeaderAction?: boolean;
  headerActionText?: string;
  headerActionHref?: string;
  showFooter?: boolean;
}

export const Layout = ({
  children,
  variant = "default",
  showHeaderAction = false,
  headerActionText,
  headerActionHref,
  showFooter = true,
}: LayoutProps) => {
  const getContainerClasses = () => {
    switch (variant) {
      case "dashboard":
        return "min-h-screen min-w-[480px] bg-background";
      case "page":
        return "min-h-screen bg-background";
      default:
        return "min-h-screen bg-background";
    }
  };

  const getMainClasses = () => {
    switch (variant) {
      case "dashboard":
        return "container mx-auto flex flex-col gap-y-8 px-6 py-8";
      case "page":
        return "container mx-auto max-w-4xl px-6 py-8";
      default:
        return "container mx-auto px-6 py-8";
    }
  };

  return (
    <div className={getContainerClasses()}>
      <Header
        showAction={showHeaderAction}
        actionText={headerActionText}
        actionHref={headerActionHref}
        homeLink={variant === "page"}
      />
      <main className={getMainClasses()}>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};
