import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

export const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Fed Open Market Alerts</title>
        <meta
          name="description"
          content="Privacy policy for Fed Open Market Alerts application and Chrome extension."
        />
      </Helmet>

      <Layout variant="page">
        <div className="prose prose-slate max-w-none">
          <h1>Privacy Policy</h1>

          <p>
            <strong>Last updated:</strong>{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <h2>Information We Collect</h2>
          <p>
            Fed Open Market Alerts does not collect account details, email
            addresses, or other directly identifying personal information. The
            application only:
          </p>
          <ul>
            <li>
              Fetches public Federal Reserve data from the official New York Fed
              API
            </li>
            <li>
              Stores user notification preferences locally in your browser
            </li>
            <li>
              Stores timestamps of last data updates to prevent duplicate
              notifications
            </li>
            <li>
              Stores an anonymous browser push endpoint and encryption keys when
              you enable browser alerts
            </li>
          </ul>

          <h2>Data Storage</h2>
          <p>
            Extension preferences remain in browser storage. When you enable
            browser alerts on the web dashboard, the app stores the browser push
            endpoint and encryption keys with our notification service. These
            values are used only to deliver Fed operation alerts and can be
            removed at any time by selecting “Stop alerts” on the dashboard.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            This application fetches public data from the Federal Reserve Bank
            of New York API (markets.newyorkfed.org). Browser-alert
            subscriptions are stored with our notification service so that we
            can deliver the alerts you request.
          </p>

          <h2>Chrome Extension Permissions</h2>
          <p>The Chrome extension requests the following permissions:</p>
          <ul>
            <li>
              <strong>Storage:</strong> To save your notification preferences
              locally
            </li>
            <li>
              <strong>Notifications:</strong> To send alerts about new Fed
              operations
            </li>
            <li>
              <strong>Host permissions:</strong> To access Federal Reserve data
              from markets.newyorkfed.org
            </li>
          </ul>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Any changes
            will be posted on this page with an updated revision date.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about this privacy policy, please contact us
            through our{" "}
            <Link
              to="/contact"
              className="text-accent underline hover:text-accent-hover"
            >
              contact page
            </Link>{" "}
            or{" "}
            <a
              href="https://github.com/tartinerlabs/open-market-alerts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline hover:text-accent-hover"
            >
              GitHub repository
            </a>
            .
          </p>
        </div>
      </Layout>
    </>
  );
};
