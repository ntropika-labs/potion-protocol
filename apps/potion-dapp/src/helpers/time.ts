const SECONDS_TO_8AM = 28800;
const SECONDS_IN_DAY = 86400;
export const createValidExpiry = (now: number, days: number): number => {
  const multiplier = (now - SECONDS_TO_8AM) / SECONDS_IN_DAY;
  return (
    Number(multiplier.toFixed(0)) * SECONDS_IN_DAY +
    days * SECONDS_IN_DAY +
    SECONDS_TO_8AM
  );
};
