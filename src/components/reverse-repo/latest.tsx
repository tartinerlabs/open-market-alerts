import { Alert } from "@heroui/react";
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
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-lg transition-all hover:shadow-xl">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white/10 p-2">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Latest Reverse Repo Operation
          </h2>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="h-4 w-4" />
              Operation Date
            </div>
            <div className="font-semibold text-slate-900">
              {new Date(operation.operationDate).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>

          <div className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="h-4 w-4" />
              Maturity Date
            </div>
            <div className="font-semibold text-slate-900">
              {new Date(operation.maturityDate).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>

          <div className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <Clock className="h-4 w-4" />
              Term
            </div>
            <div className="font-semibold text-slate-900">{operation.term}</div>
          </div>

          <div className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <Settings className="h-4 w-4" />
              Method
            </div>
            <div className="font-semibold text-slate-900">
              {operation.operationMethod}
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
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
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-600">
              <Users className="h-4 w-4" />
              Counterparties
            </div>
            <div className="text-lg font-semibold text-slate-900">
              <span className="text-slate-700">
                {operation.participatingCpty}
              </span>
              <span className="mx-2 text-slate-400">•</span>
              <span className="text-green-600">
                {operation.acceptedCpty} awarded
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-600">
              <Settings className="h-4 w-4" />
              Settlement Type
            </div>
            <div className="text-lg font-semibold text-slate-900">
              {operation.settlementType}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
