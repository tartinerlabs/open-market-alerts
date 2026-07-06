import { ProgressBar, Tooltip } from "@heroui/react";
import type { DataGridColumn } from "@heroui-pro/react";
import type { Operation } from "@/types/reverse-repo";

export const getColumns = (data: Operation[]): DataGridColumn<Operation>[] => [
  {
    id: "operationDate",
    header: "Date",
    accessorKey: "operationDate",
    cell: (item) => new Date(item.operationDate).toLocaleDateString(),
  },
  {
    id: "term",
    header: "Term",
    accessorKey: "term",
  },
  {
    id: "totalAmtAccepted",
    header: "Amount Accepted",
    accessorKey: "totalAmtAccepted",
    align: "end",
    cell: (item) => `$${item.totalAmtAccepted.toLocaleString()}`,
  },
  {
    id: "awardRate",
    header: "Award Rate",
    align: "end",
    cell: (item) => {
      const rate = item.details[0]?.percentAwardRate;
      return rate ? `${rate.toFixed(2)}%` : "N/A";
    },
  },
  {
    id: "counterparties",
    header: "Counterparties",
    align: "end",
    cell: (item) => {
      const percent = (item.acceptedCpty / item.participatingCpty) * 100;
      return (
        <div className="flex justify-end">
          <Tooltip delay={300}>
            <Tooltip.Trigger>
              <div className="flex w-full max-w-24 flex-col gap-2">
                <ProgressBar
                  aria-label="Counterparties accepted"
                  value={percent}
                >
                  <ProgressBar.Track>
                    <ProgressBar.Fill />
                  </ProgressBar.Track>
                </ProgressBar>
                <div className="text-muted text-center text-xs">
                  {Math.round(percent)}%
                </div>
              </div>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>
                {item.acceptedCpty} Accepted / {item.participatingCpty}{" "}
                Participating
              </p>
            </Tooltip.Content>
          </Tooltip>
        </div>
      );
    },
  },
  {
    id: "change",
    header: "Change",
    align: "center",
    cell: (item) => {
      const index = data.findIndex((o) => o.operationId === item.operationId);
      const nextRow = data[index + 1];
      if (!nextRow) return null;

      const currentAmount = item.totalAmtAccepted;
      const previousAmount = nextRow.totalAmtAccepted;

      if (currentAmount > previousAmount) {
        return <span className="text-success">↑</span>;
      }
      if (currentAmount < previousAmount) {
        return <span className="text-danger">↓</span>;
      }
      return <span className="text-muted">→</span>;
    },
  },
];
