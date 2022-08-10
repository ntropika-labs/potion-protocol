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

export { mockPool, mockCriteria };
