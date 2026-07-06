import { Alert, Card } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Percent,
  Settings,
  Users,
} from "lucide-react";
import { Loader } from "@/components/common/loader";
import { MetricCard } from "@/components/common/metric-card";
import { getLatestReverseRepo } from "@/services/reverse-repo.ts";

export const Latest = () => {
  const {
    data: operation,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["latest-reverse-repo"],
    queryFn: getLatestReverseRepo,
  });

  if (loading)
    return <Loader message="Loading latest reverse repo operation..." />;
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
          <Alert.Title>No reverse repo operations found</Alert.Title>
        </Alert.Content>
      </Alert>
    );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center gap-3 border-b border-border p-6">
        <div className="rounded-lg bg-accent-soft p-2">
          <Building2 className="h-6 w-6 text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Latest Reverse Repo Operation
        </h2>
      </div>

      <div className="flex flex-col gap-6 p-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-lg bg-surface-secondary p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted">
              <Calendar className="h-4 w-4" />
              Operation Date
            </div>
            <div className="font-semibold text-foreground tabular-nums">
              {new Date(operation.operationDate).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>

          <div className="rounded-lg bg-surface-secondary p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted">
              <Calendar className="h-4 w-4" />
              Maturity Date
            </div>
            <div className="font-semibold text-foreground tabular-nums">
              {new Date(operation.maturityDate).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>

          <div className="rounded-lg bg-surface-secondary p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted">
              <Clock className="h-4 w-4" />
              Term
            </div>
            <div className="font-semibold text-foreground">
              {operation.term}
            </div>
          </div>

          <div className="rounded-lg bg-surface-secondary p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted">
              <Settings className="h-4 w-4" />
              Method
            </div>
            <div className="font-semibold text-foreground">
              {operation.operationMethod}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <MetricCard
            title="Total Submitted"
            value={formatCurrency(operation.totalAmtSubmitted)}
            icon={DollarSign}
          />
          <MetricCard
            title="Total Accepted"
            value={formatCurrency(operation.totalAmtAccepted)}
            icon={CheckCircle2}
          />
          <MetricCard
            title="Award Rate"
            value={`${operation.details[0]?.percentAwardRate.toFixed(2)}%`}
            icon={Percent}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-surface-secondary p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted">
              <Users className="h-4 w-4" />
              Counterparties
            </div>
            <div className="text-lg font-semibold text-foreground tabular-nums">
              <span>{operation.participatingCpty}</span>
              <span className="mx-2 text-muted">•</span>
              <span className="text-success">
                {operation.acceptedCpty} awarded
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-surface-secondary p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted">
              <Settings className="h-4 w-4" />
              Settlement Type
            </div>
            <div className="text-lg font-semibold text-foreground">
              {operation.settlementType}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
