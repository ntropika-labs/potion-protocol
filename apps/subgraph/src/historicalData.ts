import { BigInt, log } from "@graphprotocol/graph-ts";
import {
  DailyPoolData,
  DailyTemplateData,
  HourlyPoolData,
  HourlyTemplateData,
  Pool,
  Template,
} from "../generated/schema";

function getDayTimestamp(timestamp: BigInt): i32 {
  // create the date approximating the timestamp to the beginning of the day
  return (timestamp.toI32() / 86400) * 86400;
}

function getHourTimestamp(timestamp: BigInt): i32 {
  // create the date approximating the timestamp to the beginning of the hour
  return (timestamp.toI32() / 3600) * 3600;
}

function updateDailyPoolData(pool: Pool, timestamp: BigInt): void {
  const date = getDayTimestamp(timestamp);
  log.info("updating the info for pool {} in the date {}", [
    pool.id,
    date.toString(),
  ]);
  const id = pool.id + date.toString();
  let dailyPool = DailyPoolData.load(id);
  if (dailyPool == null) {
    log.info(
      "pool {} didn't have operations in the date {}, creating new entity",
      [pool.id, date.toString()]
    );
    dailyPool = new DailyPoolData(id);
    dailyPool.date = date;
    dailyPool.pool = pool.id;
  }
  dailyPool.liquidity = pool.liquidityAtTrades;
  dailyPool.pnl = pool.pnlPercentage;
  dailyPool.utilization = pool.utilization;
  dailyPool.save();
}

function updateHourlyPoolData(pool: Pool, timestamp: BigInt): void {
  const date = getHourTimestamp(timestamp);
  log.info("updating the info for pool {} in the date {}", [
    pool.id,
    date.toString(),
  ]);
  const id = pool.id + date.toString();
  let hourlyPool = HourlyPoolData.load(id);
  if (hourlyPool == null) {
    log.info(
      "pool {} didn't have operations in the date {}, creating new entity",
      [pool.id, date.toString()]
    );
    hourlyPool = new HourlyPoolData(id);
    hourlyPool.date = date;
    hourlyPool.pool = pool.id;
  }
  hourlyPool.liquidity = pool.liquidityAtTrades;
  hourlyPool.pnl = pool.pnlPercentage;
  hourlyPool.utilization = pool.utilization;
  hourlyPool.save();
}

function updateHistoricalPoolData(pool: Pool, timestamp: BigInt): void {
  updateDailyPoolData(pool, timestamp);
  updateHourlyPoolData(pool, timestamp);
}

function updateDailyTemplateData(template: Template, timestamp: BigInt): void {
  const date = getDayTimestamp(timestamp);
  log.info("updating the info for template {} in the date {}", [
    template.id,
    date.toString(),
  ]);
  const id = template.id + date.toString();
  let dailyTemplate = DailyTemplateData.load(id);
  if (dailyTemplate == null) {
    log.info(
      "template {} didn't have operations in the date {}, creating new entity",
      [template.id, date.toString()]
    );
    dailyTemplate = new DailyTemplateData(id);
    dailyTemplate.date = date;
    dailyTemplate.template = template.id;
  }
  dailyTemplate.liquidity = template.liquidityAtTrades;
  dailyTemplate.pnl = template.pnlPercentage;
  dailyTemplate.utilization = template.utilization;
  dailyTemplate.save();
}

function updateHourlyTemplateData(template: Template, timestamp: BigInt): void {
  const date = getHourTimestamp(timestamp);
  log.info("updating the info for template {} in the date {}", [
    template.id,
    date.toString(),
  ]);
  const id = template.id + date.toString();
  let hourlyTemplate = HourlyTemplateData.load(id);
  if (hourlyTemplate == null) {
    log.info(
      "template {} didn't have operations in the date {}, creating new entity",
      [template.id, date.toString()]
    );
    hourlyTemplate = new HourlyTemplateData(id);
    hourlyTemplate.date = date;
    hourlyTemplate.template = template.id;
  }
  hourlyTemplate.liquidity = template.liquidityAtTrades;
  hourlyTemplate.pnl = template.pnlPercentage;
  hourlyTemplate.utilization = template.utilization;
  hourlyTemplate.save();
}

function updateHistoricalTemplateData(
  template: Template,
  timestamp: BigInt
): void {
  updateDailyTemplateData(template, timestamp);
  updateHourlyTemplateData(template, timestamp);
}

export {
  updateDailyPoolData,
  updateDailyTemplateData,
  updateHistoricalPoolData,
  updateHistoricalTemplateData,
  updateHourlyPoolData,
  updateHourlyTemplateData,
};
