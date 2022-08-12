// Functions used to create mocked result of queries

const mockPool = ({
  id = "",
  poolId = 0,
  curve = { a: "1", b: "1", c: "1", d: "1", maxUtil: "1" },
  criterias = [],
}) => {
  return {
    pool: {
      id,
      poolId,
      template: {
        curve,
        criteriaSet: {
          criterias,
        },
      },
    },
  };
};

const mockPoolTemplate = ({
  id = "",
  creator = "",
  curve = { a: "1", b: "1", c: "1", d: "1", maxUtil: "1" },
  criterias = [],
}) => {
  return {
    template: {
      id,
      creator,
      curve,
      criteriaSet: {
        criterias,
      },
    },
  };
};

const mockCriteria = (
  address: string,
  maxStrikePercent: string,
  maxDurationInDays: string
) => {
  return {
    criteria: {
      underlyingAsset: {
        address,
      },
      maxStrikePercent,
      maxDurationInDays,
    },
  };
};

const mockCriterias = (
  set: {
    templates?: number[];
    maxStrikePercent?: number;
    maxDurationInDays?: number;
  }[]
) => {
  return {
    criterias: set.map(
      ({ templates, maxStrikePercent, maxDurationInDays }) => ({
        criteriaSets: [
          {
            criteriaSet: { templates },
          },
        ],
        maxStrikePercent,
        maxDurationInDays,
      })
    ),
  };
};

const mockOtoken = (
  tokenAddress: string,
  strikePrice: number,
  expiry: number,
  underlyingAddress: string
) => ({
  otoken: {
    tokenAddress,
    underlyingAsset: {
      symbol: "foo",
      name: "bar",
      address: underlyingAddress,
      decimals: 18,
    },
    expiry,
    strikePrice,
  },
});

const mockPotionOrders = (
  orders: {
    id: string;
    premium: string;
    timestamp: string;
    otokens: string;
  }[]
) => {
  return {
    orderBookEntries: orders.map((o) => ({
      id: o.id,
      premium: o.premium,
      timestamp: o.timestamp,
      numberOfOTokens: o.otokens,
    })),
  };
};

interface mockSnapshotParams {
  pnl?: string;
  size?: string;
  templatePnl?: string;
  templateSize?: string;
  templateUtilization?: string;
  timestamp: string;
  utilization?: string;
}

const mockSnapshots = (snapshots: mockSnapshotParams[]) => {
  return {
    poolSnapshots: snapshots.map(
      ({
        pnl = "0",
        size = "0",
        templatePnl = "0",
        templateSize = "0",
        templateUtilization = "0",
        timestamp,
        utilization = "0",
      }) => ({
        actionType: "MOCKED_SNAPSHOT",
        pnlPercentage: pnl,
        size: size,
        templatePnlPercentage: templatePnl,
        templateSize: templateSize,
        templateUtilization: templateUtilization,
        timestamp: timestamp,
        utilization: utilization,
      })
    ),
  };
};

export {
  mockPool,
  mockPoolTemplate,
  mockCriteria,
  mockOtoken,
  mockCriterias,
  mockPotionOrders,
  mockSnapshots,
};
