// Functions used to create mocked result of queries

interface MockPoolParams {
  id?: string;
  poolId?: number;
  curve?: {
    a: string;
    b: string;
    c: string;
    d: string;
    maxUtil: string;
  };
  criterias?: {
    criteria: {
      underlyingAsset: {
        address: string;
      };
      maxStrikePercent: string;
      maxDurationInDays: string;
    };
  }[];
}

const mockPool = ({
  id = "",
  poolId = 0,
  curve = { a: "1", b: "1", c: "1", d: "1", maxUtil: "1" },
  criterias = [],
}: MockPoolParams) => {
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

const mockPools = (params: MockPoolParams[] = []) => {
  return {
    pools: params.map((p) => mockPool(p).pool),
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

export {
  mockPool,
  mockPools,
  mockPoolTemplate,
  mockCriteria,
  mockOtoken,
  mockCriterias,
  mockPotionOrders,
};
