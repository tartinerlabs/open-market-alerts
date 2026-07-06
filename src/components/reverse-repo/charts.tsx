import { Card } from "@heroui/react";
import { ComposedChart, LineChart } from "@heroui-pro/react";
import type { Operation } from "@/types/reverse-repo.ts";

interface ChartsProps {
  operations: Operation[];
}

export const Charts = ({ operations }: ChartsProps) => {
  const chartData = operations
    .slice()
    .reverse()
    .map((operation) => ({
      date: new Date(operation.operationDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      amountAccepted: operation.totalAmtAccepted / 1000000000,
      awardRate: operation.details[0]?.percentAwardRate ?? 0,
      counterparties: operation.acceptedCpty,
    }));

  const formatCurrency = (value: number) => `$${value.toFixed(1)}B`;
  const formatRate = (value: number) => `${value.toFixed(2)}%`;

  return (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <Card.Title>Amount Accepted Trend</Card.Title>
        </Card.Header>
        <Card.Content>
          <LineChart data={chartData} height={300}>
            <LineChart.Grid vertical={false} />
            <LineChart.XAxis dataKey="date" tickMargin={8} />
            <LineChart.YAxis
              tickFormatter={(v: number) => formatCurrency(v)}
              width={50}
            />
            <LineChart.Line
              dataKey="amountAccepted"
              name="Amount"
              stroke="var(--chart-3)"
              strokeWidth={2}
              type="monotone"
              dot={false}
            />
            <LineChart.Tooltip
              content={
                <LineChart.TooltipContent
                  valueFormatter={(v) => formatCurrency(Number(v))}
                />
              }
            />
          </LineChart>
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title>Amount vs Award Rate</Card.Title>
        </Card.Header>
        <Card.Content>
          <ComposedChart data={chartData} height={300}>
            <ComposedChart.Grid vertical={false} />
            <ComposedChart.XAxis dataKey="date" tickMargin={8} />
            <ComposedChart.YAxis
              yAxisId="left"
              tickFormatter={(v: number) => formatCurrency(v)}
              width={50}
            />
            <ComposedChart.YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(v: number) => formatRate(v)}
              width={50}
            />
            <ComposedChart.Bar
              yAxisId="left"
              dataKey="amountAccepted"
              name="Amount"
              fill="var(--chart-3)"
              radius={[4, 4, 0, 0]}
              barSize={16}
            />
            <ComposedChart.Line
              yAxisId="right"
              dataKey="awardRate"
              name="Award Rate"
              stroke="var(--chart-1)"
              strokeWidth={2}
              type="monotone"
              dot={false}
            />
            <ComposedChart.Tooltip
              content={<ComposedChart.TooltipContent indicator="line" />}
            />
          </ComposedChart>
        </Card.Content>
      </Card>
    </div>
  );
};
