import { Avatar } from "@heroui/react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-slate-800 py-8 text-white">
      <div className="container mx-auto px-6">
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <Avatar>
                <Avatar.Image src="/icon.svg" alt="Fed Open Market Alerts" />
              </Avatar>
              <span className="text-lg font-semibold">
                Fed Open Market Alerts
              </span>
            </div>

            <Link to="/extension" target="_blank">
              <img
                src="/chrome-web-store-badge.png"
                alt="Available in the Chrome Web Store"
                className="h-12 transition-opacity hover:opacity-90"
              />
            </Link>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-700 pt-6 md:flex-row">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link
                to="/privacy-policy"
                className="text-slate-300 transition-colors hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-service"
                className="text-slate-300 transition-colors hover:text-white"
              >
                Terms of Service
              </Link>
              <Link
                to="/contact"
                className="text-slate-300 transition-colors hover:text-white"
              >
                Contact
              </Link>
              <a
                href="https://github.com/ruchernchong/fed-open-market-alerts"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 transition-colors hover:text-white"
              >
                GitHub
              </a>
            </div>

            <div className="text-center text-sm text-slate-400 md:text-right">
              <p>Data sourced from the Federal Reserve Bank of New York</p>
              <p className="mt-1">
                © {new Date().getFullYear()} Fed Open Market Alerts
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
