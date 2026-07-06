import { Avatar } from "@heroui/react";
import { Link } from "react-router-dom";

interface HeaderProps {
  showAction?: boolean;
  actionText?: string;
  actionHref?: string;
  homeLink?: boolean;
}

export const Header = ({
  showAction = false,
  actionText = "Add to Browser",
  actionHref = "/extension",
  homeLink = false,
}: HeaderProps) => {
  const headerContent = (
    <div className="flex items-center gap-3">
      <Avatar>
        <Avatar.Image src="/icon.svg" alt="Fed Open Market Alerts" />
      </Avatar>
      <h1 className="text-2xl font-bold text-foreground">
        Fed Open Market Alerts
      </h1>
    </div>
  );

  return (
    <header className="border-b border-border bg-surface px-6 py-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {homeLink ? (
            <Link to="/" className="flex items-center gap-3">
              <Avatar>
                <Avatar.Image src="/icon.svg" alt="Fed Open Market Alerts" />
              </Avatar>
              <h1 className="text-2xl font-bold text-foreground">
                Fed Open Market Alerts
              </h1>
            </Link>
          ) : (
            headerContent
          )}

          {showAction && (
            <div className="hidden md:block">
              <Link
                to={actionHref}
                target="_blank"
                className="flex items-center gap-2 rounded-full bg-accent px-6 py-4 text-accent-foreground transition-colors hover:bg-accent-hover"
              >
                {actionText}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
