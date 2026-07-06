import { Alert, Card } from "@heroui/react";
import { DataGrid } from "@heroui-pro/react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Building2, Table2, TrendingUp } from "lucide-react";
import { Loader } from "@/components/common/loader";
import { getRecentReverseRepoTrend } from "@/services/reverse-repo.ts";
import { Charts } from "./charts";
import { getColumns } from "./columns";

export const Trend = () => {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["reverse-repo-trend"],
    queryFn: getRecentReverseRepoTrend,
  });

  if (loading) {
    return <Loader message="Loading reverse repo trend data..." />;
  }

  if (error) {
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
  }

  if (!data || data.length === 0) {
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
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-accent-soft p-2">
          <TrendingUp className="size-6 text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Recent Reverse Repo Operations Trend
        </h2>
      </div>

      <Charts operations={data} />

      <Card className="overflow-hidden p-0">
        <div className="flex items-center gap-2 border-b border-border p-6">
          <Table2 className="size-5 text-accent" />
          <h3 className="text-lg font-semibold text-foreground">
            Detailed Operations
          </h3>
        </div>
        <div className="p-6">
          <DataGrid
            aria-label="Detailed reverse repo operations"
            columns={getColumns(data)}
            data={data}
            getRowId={(item) => item.operationId}
          />
        </div>
      </Card>
    </section>
  );
};
