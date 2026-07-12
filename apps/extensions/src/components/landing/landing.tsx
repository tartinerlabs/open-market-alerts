import { ComposedChart, LineChart } from "@heroui-pro/react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  Check,
  Clock3,
  DollarSign,
  ExternalLink,
  Percent,
  Puzzle,
  ShieldCheck,
  Table2,
  TrendingUp,
  X,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import {
  getLatestReverseRepo,
  getRecentReverseRepoTrend,
} from "@/services/reverse-repo";
import type { Operation } from "@/types/reverse-repo";

const FALLBACK_OPERATION = {
  operationDate: "2026-07-10",
  maturityDate: "2026-07-13",
  term: "Overnight",
  operationMethod: "Fixed Rate",
  totalAmtSubmitted: 545_000_000,
  totalAmtAccepted: 545_000_000,
  participatingCpty: 3,
  acceptedCpty: 3,
  settlementType: "Same Day",
  details: [{ percentAwardRate: 3.5 }],
} as Operation;

const FALLBACK_TREND = [
  { date: "Jun 29", amount: 3.5, rate: 3.5 },
  { date: "Jun 30", amount: 26.9, rate: 3.5 },
  { date: "Jul 1", amount: 1, rate: 3.5 },
  { date: "Jul 2", amount: 2.2, rate: 3.5 },
  { date: "Jul 6", amount: 2.7, rate: 3.5 },
  { date: "Jul 7", amount: 4.5, rate: 3.5 },
  { date: "Jul 8", amount: 3.3, rate: 3.5 },
  { date: "Jul 9", amount: 5.8, rate: 3.5 },
  { date: "Jul 10", amount: 0.545, rate: 3.5 },
];

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const formatCompactCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 0,
  }).format(amount);

const formatOperationDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

interface MarketPreviewProps {
  operation: Operation;
  chartData: { date: string; amount: number; rate: number }[];
  compact?: boolean;
}

const MarketPreview = ({
  operation,
  chartData,
  compact = false,
}: MarketPreviewProps) => {
  const awardRate = operation.details[0]?.percentAwardRate ?? 0;

  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-white text-[#181818] shadow-[0_18px_55px_rgba(0,0,0,0.16)]">
      <div className="flex items-center gap-2 border-b border-black/10 px-4 py-3">
        <img src="/icon.svg" alt="" className="size-7 rounded-md" />
        <span className="text-sm font-bold">Fed Open Market Alerts</span>
      </div>

      <div className="border-b border-black/10 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Building2 className="size-4" aria-hidden="true" />
          Latest Reverse Repo Operation
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-4">
        {[
          ["Operation date", formatOperationDate(operation.operationDate)],
          ["Maturity date", formatOperationDate(operation.maturityDate)],
          ["Term", operation.term],
          ["Method", operation.operationMethod],
        ].map(([label, value]) => (
          <div key={label} className="rounded-md bg-[#f2f2f2] p-3">
            <p className="text-[10px] text-[#696969]">{label}</p>
            <p className="mt-1 truncate text-xs font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 px-4 pb-4">
        <div className="rounded-md bg-[#f2f2f2] p-3">
          <p className="text-[10px] text-[#696969]">Total submitted</p>
          <p className="mt-1 text-sm font-bold tabular-nums">
            {formatCurrency(operation.totalAmtSubmitted)}
          </p>
        </div>
        <div className="rounded-md bg-[#f2f2f2] p-3">
          <p className="text-[10px] text-[#696969]">Total accepted</p>
          <p className="mt-1 text-sm font-bold tabular-nums">
            {formatCurrency(operation.totalAmtAccepted)}
          </p>
        </div>
        <div className="rounded-md bg-[#f2f2f2] p-3">
          <p className="text-[10px] text-[#696969]">Award rate</p>
          <p className="mt-1 text-sm font-bold tabular-nums">
            {awardRate.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="border-t border-black/10 px-4 py-3">
        <div className="mb-2 flex items-center gap-2 text-xs font-bold">
          <TrendingUp className="size-4" aria-hidden="true" />
          Recent reverse repo operations trend
        </div>
        <div className={compact ? "" : "grid gap-3 sm:grid-cols-2"}>
          <div>
            {!compact ? (
              <p className="mb-1 text-[10px] font-semibold text-[#696969]">
                Amount accepted trend
              </p>
            ) : null}
            <LineChart data={chartData} height={compact ? 110 : 135}>
              <LineChart.Grid vertical={false} />
              <LineChart.XAxis dataKey="date" tickMargin={6} />
              <LineChart.YAxis
                width={38}
                tickFormatter={(value: number) => `$${value.toFixed(0)}B`}
              />
              <LineChart.Line
                dataKey="amount"
                name="Accepted"
                stroke="var(--chart-3)"
                strokeWidth={2}
                type="monotone"
                dot={false}
              />
            </LineChart>
          </div>

          {!compact ? (
            <div className="hidden sm:block">
              <p className="mb-1 text-[10px] font-semibold text-[#696969]">
                Amount vs award rate
              </p>
              <ComposedChart data={chartData} height={135}>
                <ComposedChart.Grid vertical={false} />
                <ComposedChart.XAxis dataKey="date" tickMargin={6} />
                <ComposedChart.YAxis
                  yAxisId="left"
                  width={38}
                  tickFormatter={(value: number) => `$${value.toFixed(0)}B`}
                />
                <ComposedChart.YAxis
                  yAxisId="right"
                  orientation="right"
                  width={34}
                  tickFormatter={(value: number) => `${value.toFixed(1)}%`}
                />
                <ComposedChart.Bar
                  yAxisId="left"
                  dataKey="amount"
                  name="Amount"
                  fill="var(--chart-3)"
                  radius={[2, 2, 0, 0]}
                  barSize={8}
                />
                <ComposedChart.Line
                  yAxisId="right"
                  dataKey="rate"
                  name="Award rate"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  type="monotone"
                  dot={false}
                />
              </ComposedChart>
            </div>
          ) : null}
        </div>
      </div>

      {!compact ? (
        <div className="hidden border-t border-black/10 px-4 py-3 sm:block">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold">
            <Table2 className="size-4" aria-hidden="true" />
            Detailed operations
          </div>
          <table className="w-full table-fixed text-left text-[10px]">
            <thead className="text-[#696969]">
              <tr>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Term</th>
                <th className="pb-2 font-medium">Amount accepted</th>
                <th className="pb-2 font-medium">Award rate</th>
              </tr>
            </thead>
            <tbody>
              {chartData
                .slice(-5)
                .reverse()
                .map((item) => (
                  <tr key={item.date} className="border-t border-black/8">
                    <td className="py-2">{item.date}</td>
                    <td className="py-2">Overnight</td>
                    <td className="py-2 tabular-nums">
                      {formatCurrency(item.amount * 1_000_000_000)}
                    </td>
                    <td className="py-2 tabular-nums">
                      {item.rate.toFixed(2)}%
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

interface BrowserAlertPreviewProps {
  operation: Operation;
}

const BrowserAlertPreview = ({ operation }: BrowserAlertPreviewProps) => (
  <div className="rounded-xl border border-black/10 bg-white p-4 text-[#181818] shadow-[0_20px_50px_rgba(0,0,0,0.22)]">
    <div className="flex items-start gap-3">
      <img src="/icon.svg" alt="" className="size-11 rounded-lg" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold">Fed Open Market Alerts</p>
            <p className="mt-1 text-sm">New reverse repo data published.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#696969]">
            <span>1:20 PM</span>
            <X className="size-4" aria-hidden="true" />
          </div>
        </div>
        <p className="mt-1 text-sm text-[#555] tabular-nums">
          {formatOperationDate(operation.operationDate)} ·{" "}
          {formatCurrency(operation.totalAmtAccepted)} ·{" "}
          {(operation.details[0]?.percentAwardRate ?? 0).toFixed(2)}%
        </p>
      </div>
    </div>
  </div>
);

interface CtaLinksProps {
  dark?: boolean;
}

const CtaLinks = ({ dark = false }: CtaLinksProps) => (
  <div className="flex flex-col gap-3 sm:flex-row">
    <Link
      to="/extension"
      target="_blank"
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-6 text-sm font-semibold transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 ${
        dark
          ? "bg-white text-[#181818] focus-visible:outline-white"
          : "bg-accent text-accent-foreground focus-visible:outline-accent"
      }`}
    >
      <Puzzle className="size-5" aria-hidden="true" />
      Add to Chrome
    </Link>
    <Link
      to="/dashboard"
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-md border px-6 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${
        dark
          ? "border-white/25 text-white hover:bg-white/10 focus-visible:outline-white"
          : "border-border text-foreground hover:bg-default focus-visible:outline-accent"
      }`}
    >
      <BarChart3 className="size-5" aria-hidden="true" />
      View live dashboard
    </Link>
  </div>
);

const LandingHeader = () => (
  <header className="border-b border-border bg-surface">
    <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
      <Link
        to="/"
        className="flex items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <img src="/icon.svg" alt="" className="size-9 rounded-lg" />
        <span className="text-base font-bold text-foreground sm:text-lg">
          Fed Open Market Alerts
        </span>
      </Link>
      <Link
        to="/extension"
        target="_blank"
        className="hidden min-h-11 items-center gap-2 rounded-md bg-accent px-5 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:inline-flex"
      >
        <Puzzle className="size-4" aria-hidden="true" />
        Add to Chrome
      </Link>
    </div>
  </header>
);

export const Landing = () => {
  const reduceMotion = useReducedMotion();
  const { data: latestOperation } = useQuery({
    queryKey: ["latest-reverse-repo"],
    queryFn: getLatestReverseRepo,
  });
  const { data: recentOperations } = useQuery({
    queryKey: ["reverse-repo-trend"],
    queryFn: getRecentReverseRepoTrend,
  });

  const operation = latestOperation ?? FALLBACK_OPERATION;
  const awardRate = operation.details[0]?.percentAwardRate ?? 0;
  const chartData = recentOperations?.length
    ? recentOperations
        .slice()
        .reverse()
        .map((item) => ({
          date: new Date(item.operationDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          amount: item.totalAmtAccepted / 1_000_000_000,
          rate: item.details[0]?.percentAwardRate ?? 0,
        }))
    : FALLBACK_TREND;

  const motionProps = reduceMotion
    ? {}
    : {
        initial: "hidden" as const,
        animate: "visible" as const,
        variants: reveal,
        transition: { duration: 0.55, ease: "easeOut" as const },
      };

  return (
    <>
      <Helmet>
        <title>Fed Open Market Alerts — The signal, without the noise</title>
        <meta
          name="description"
          content="Get a quiet Chrome alert when new Federal Reserve reverse repo data lands, then inspect the full operation in seconds."
        />
        <meta
          name="keywords"
          content="Federal Reserve, reverse repo, open market operations, Chrome alerts, Fed data"
        />
        <meta property="og:title" content="Fed Open Market Alerts" />
        <meta
          property="og:description"
          content="The Fed signal you watch, delivered as a quiet browser alert."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <LandingHeader />

        <main>
          <section className="overflow-hidden bg-[#171717] text-white">
            <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:py-24">
              <motion.div {...motionProps}>
                <p className="text-xs font-semibold tracking-[0.2em] text-white/65 uppercase">
                  Latest operation · {formatOperationDate(operation.operationDate)}
                </p>
                <p className="mt-7 text-6xl leading-none font-bold tracking-[-0.055em] tabular-nums sm:text-7xl lg:text-8xl">
                  {formatCompactCurrency(operation.totalAmtAccepted)}
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                  accepted
                </p>

                <div className="my-6 w-full max-w-sm" aria-hidden="true">
                  <LineChart data={chartData} height={68}>
                    <LineChart.Line
                      dataKey="amount"
                      name="Accepted"
                      stroke="rgba(255,255,255,0.82)"
                      strokeWidth={2}
                      type="monotone"
                      dot={false}
                    />
                  </LineChart>
                </div>

                <h1 className="max-w-lg text-4xl leading-[1.04] font-bold tracking-[-0.035em] sm:text-5xl">
                  The signal,
                  <br />
                  without the noise.
                </h1>
                <p className="mt-6 max-w-lg text-base leading-7 text-white/68 sm:text-lg">
                  Get a quiet browser alert when new reverse repo data lands—then
                  inspect the full operation in seconds.
                </p>

                <div className="mt-8">
                  <CtaLinks dark />
                </div>

                <ul className="mt-8 space-y-3 text-sm text-white/72">
                  {[
                    "Weekday alerts at 1:20 PM EST",
                    "No account or email required",
                    "Free forever",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="size-4 text-success" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                className="relative mx-auto w-full max-w-2xl pb-20 lg:pb-16"
                {...motionProps}
                transition={{ duration: 0.65, delay: 0.12 }}
              >
                <MarketPreview
                  operation={operation}
                  chartData={chartData}
                  compact
                />
                <div className="absolute right-0 bottom-0 w-[92%] max-w-lg sm:right-5">
                  <BrowserAlertPreview operation={operation} />
                </div>
              </motion.div>
            </div>
          </section>

          <section className="border-b border-border bg-surface">
            <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 sm:px-8 lg:grid-cols-4">
              {[
                {
                  icon: CalendarDays,
                  label: "Latest operation",
                  value: formatOperationDate(operation.operationDate),
                },
                {
                  icon: DollarSign,
                  label: "Amount accepted",
                  value: formatCurrency(operation.totalAmtAccepted),
                },
                {
                  icon: Percent,
                  label: "Award rate",
                  value: `${awardRate.toFixed(2)}%`,
                },
                {
                  icon: Clock3,
                  label: "Updated at",
                  value: "1:20 PM EST",
                },
              ].map(({ icon: Icon, label, value }, index) => (
                <div
                  key={label}
                  className={`py-7 sm:py-9 ${
                    index % 2 === 0 ? "pr-5" : "border-l border-border pl-5"
                  } ${
                    index > 1 ? "border-t border-border lg:border-t-0" : ""
                  } lg:border-l lg:px-7 lg:first:border-l-0 lg:first:pl-0`}
                >
                  <p className="flex items-center gap-2 text-xs text-muted">
                    <Icon className="size-4" aria-hidden="true" />
                    {label}
                  </p>
                  <p className="mt-2 text-lg font-bold tracking-[-0.02em] tabular-nums sm:text-2xl">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-background py-20 sm:py-28">
            <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1.22fr_0.78fr] lg:items-center">
              <motion.div {...motionProps}>
                <MarketPreview operation={operation} chartData={chartData} />
              </motion.div>

              <motion.div {...motionProps}>
                <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">
                  The full dashboard
                </p>
                <h2 className="mt-4 text-4xl leading-tight font-bold tracking-[-0.035em] sm:text-5xl">
                  Complete history.
                  <br />
                  Clear trends.
                </h2>
                <p className="mt-5 max-w-md text-base leading-7 text-muted">
                  Inspect every reverse repo operation with full details, trends,
                  and daily history.
                </p>

                <div className="mt-10 space-y-7">
                  {[
                    {
                      icon: TrendingUp,
                      title: "Daily trends",
                      description:
                        "Visualize amount accepted and award rate over time.",
                    },
                    {
                      icon: Table2,
                      title: "Complete history",
                      description:
                        "Browse detailed operations with counterparties and changes.",
                    },
                    {
                      icon: Building2,
                      title: "Official source",
                      description:
                        "All data comes directly from the Federal Reserve Bank of New York.",
                    },
                  ].map(({ icon: Icon, title, description }) => (
                    <div key={title} className="flex gap-4">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-md border border-border bg-surface">
                        <Icon className="size-5" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{title}</h3>
                        <p className="mt-1 max-w-sm text-sm leading-6 text-muted">
                          {description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  to="/dashboard"
                  className="mt-9 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  Open dashboard
                  <ExternalLink className="size-4" aria-hidden="true" />
                </Link>
              </motion.div>
            </div>
          </section>

          <section className="border-y border-border bg-surface py-18 sm:py-22">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <div className="text-center">
                <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">
                  From publication to browser
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em]">
                  How it works
                </h2>
              </div>

              <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-0">
                {[
                  {
                    icon: Puzzle,
                    step: "1",
                    title: "Install",
                    description:
                      "Add the extension from the Chrome Web Store in seconds.",
                  },
                  {
                    icon: Bell,
                    step: "2",
                    title: "Enable alerts",
                    description:
                      "Turn on browser alerts. No account or email needed.",
                  },
                  {
                    icon: TrendingUp,
                    step: "3",
                    title: "Stay informed",
                    description:
                      "Get a quiet alert, then inspect the full operation.",
                  },
                ].map(({ icon: Icon, step, title, description }, index) => (
                  <div
                    key={title}
                    className={`relative flex gap-5 md:px-8 ${
                      index > 0 ? "md:border-l md:border-border" : "md:pl-0"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                        {step}
                      </span>
                      <Icon className="mt-0.5 size-10 shrink-0 stroke-[1.4]" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-background py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <div className="rounded-xl border border-border bg-surface p-6 sm:p-10">
                <div className="grid gap-8 md:grid-cols-2 md:gap-0">
                  <div className="flex gap-5 md:pr-10">
                    <ShieldCheck className="size-12 shrink-0 stroke-[1.4]" aria-hidden="true" />
                    <div>
                      <h2 className="text-xl font-bold">Private by design</h2>
                      <p className="mt-2 max-w-md text-sm leading-6 text-muted">
                        We don’t collect personal data. No accounts, no emails, no
                        tracking—just the information you need, when you need it.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-5 border-t border-border pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-10">
                    <Building2 className="size-12 shrink-0 stroke-[1.4]" aria-hidden="true" />
                    <div>
                      <h2 className="text-xl font-bold">Official NY Fed data</h2>
                      <p className="mt-2 max-w-md text-sm leading-6 text-muted">
                        Every operation is sourced directly from the Federal Reserve
                        Bank of New York.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-9 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 lg:flex-row">
                  <div>
                    <p className="text-2xl font-bold tracking-[-0.025em]">
                      Cut through the noise. Follow the signal.
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      Free to install · No account required · Official data
                    </p>
                  </div>
                  <CtaLinks />
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};
