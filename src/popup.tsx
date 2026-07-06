import { Alert, Button, Separator, Tooltip } from "@heroui/react";
import { LineChart } from "@heroui-pro/react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Building2, ExternalLink, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Loader } from "@/components/common/loader";
import { View } from "@/components/settings/view";
import {
  getLatestReverseRepo,
  getRecentReverseRepoTrend,
} from "@/services/reverse-repo.ts";
import { setHasUnreadNotification } from "@/services/storage.ts";

export const Popup = () => {
  const [currentView, setCurrentView] = useState<"main" | "settings">("main");

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      setHasUnreadNotification(false);
    }
  }, []);

  const {
    data: operation,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["latest-reverse-repo"],
    queryFn: getLatestReverseRepo,
  });

  const { data: trendData } = useQuery({
    queryKey: ["reverse-repo-trend"],
    queryFn: getRecentReverseRepoTrend,
  });

  const handleMoreDetails = () => {
    const webAppUrl = "/";
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.create({
        url: webAppUrl,
      });
    } else {
      window.open(webAppUrl, "_blank");
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      notation: "compact",
      compactDisplay: "short",
    }).format(amount);

  const chartData =
    trendData
      ?.slice(0, 7)
      .reverse()
      .map((operation) => ({
        date: new Date(operation.operationDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        amountAccepted: operation.totalAmtAccepted / 1000000000,
        formattedAmount: formatCurrency(operation.totalAmtAccepted),
      })) || [];

  if (currentView === "settings") {
    return <View onBack={() => setCurrentView("main")} />;
  }

  if (loading) {
    return <Loader message="Loading latest operation..." />;
  }

  if (error)
    return (
      <Alert status="danger">
        <Alert.Indicator>
          <AlertCircle />
        </Alert.Indicator>
        <Alert.Content>
          <Alert.Title>Error: {error.message}</Alert.Title>
        </Alert.Content>
      </Alert>
    );

  if (!operation)
    return (
      <Alert>
        <Alert.Indicator>
          <Building2 />
        </Alert.Indicator>
        <Alert.Content>
          <Alert.Title>No operations found</Alert.Title>
        </Alert.Content>
      </Alert>
    );

  return (
    <div className="w-80 bg-surface">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">
            Fed Open Market Alerts
          </h1>
        </div>
        <Tooltip>
          <Tooltip.Trigger>
            <Button
              isIconOnly
              variant="ghost"
              aria-label="Settings"
              onPress={() => setCurrentView("settings")}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Settings</Tooltip.Content>
        </Tooltip>
      </div>

      <div className="space-y-4 p-4">
        <div className="space-y-3 tabular-nums">
          <div className="flex items-center justify-between">
            <span className="text-muted">Date</span>
            <span className="font-semibold text-foreground">
              {new Date(operation.operationDate).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted">Amount</span>
            <span className="font-semibold text-success">
              {formatCurrency(operation.totalAmtAccepted)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted">Rate</span>
            <span className="font-semibold text-accent">
              {operation.details[0]?.percentAwardRate.toFixed(2)}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted">Last Updated</span>
            <span className="font-semibold text-muted">
              {new Date(operation.lastUpdated).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <Separator />

        {chartData.length > 0 && (
          <>
            <div className="mb-2 text-xs font-medium text-muted">
              7-Day Trend
            </div>
            <LineChart
              data={chartData}
              height={128}
              margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
            >
              <LineChart.XAxis dataKey="date" />
              <LineChart.YAxis hide />
              <LineChart.Line
                dataKey="amountAccepted"
                stroke="var(--chart-3)"
                strokeWidth={2}
                type="monotone"
                dot={false}
              />
              <LineChart.Tooltip
                content={
                  <LineChart.TooltipContent
                    valueFormatter={(v) => `$${Number(v).toFixed(1)}B`}
                  />
                }
              />
            </LineChart>
          </>
        )}

        <Button fullWidth onPress={handleMoreDetails}>
          More Details
          <ExternalLink className="size-4" />
        </Button>
      </div>
    </div>
  );
};
