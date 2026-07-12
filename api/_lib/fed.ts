interface FedOperation {
  lastUpdated: string;
  operationDate: string;
  totalAmtAccepted: number;
}

interface FedMarketsResponse {
  repo: {
    operations: FedOperation[];
  };
}

const FED_MARKETS_API_BASE =
  "https://markets.newyorkfed.org/api/rp/reverserepo/all/results";

export const getLatestFedOperation = async (): Promise<FedOperation | null> => {
  const response = await fetch(`${FED_MARKETS_API_BASE}/lastTwoWeeks.json`);
  if (!response.ok) {
    throw new Error(`Fed API request failed: ${response.status}`);
  }

  const data = (await response.json()) as FedMarketsResponse;
  return data.repo.operations[0] ?? null;
};

export const createPushPayload = (operation: FedOperation) => {
  const amount = new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    style: "currency",
  }).format(operation.totalAmtAccepted);
  const operationDate = new Date(operation.operationDate).toLocaleDateString(
    "en-US",
    { day: "numeric", month: "short", weekday: "short" },
  );

  return {
    body: `${amount} accepted on ${operationDate}`,
    tag: `fed-operation-${operation.lastUpdated}`,
    title: "New Fed Reverse Repo Data",
    url: "/dashboard",
  };
};
