import { Helmet } from "react-helmet-async";
import { isExtensionContext } from "@/extension-routing";
import { Layout } from "../layout/Layout";
import { Latest } from "../reverse-repo/latest";
import { Trend } from "../reverse-repo/trend";
import { BrowserAlerts } from "./browser-alerts";

export const Dashboard = () => {
  const showBrowserAlerts = !isExtensionContext();

  return (
    <>
      <Helmet>
        <title>Dashboard - Fed Open Market Alerts</title>
        <meta
          name="description"
          content="Federal Reserve Open Market Operations dashboard with real-time data and trend analysis."
        />
      </Helmet>

      <Layout variant="dashboard">
        {showBrowserAlerts ? <BrowserAlerts /> : null}
        <Latest />
        <Trend />
      </Layout>
    </>
  );
};
