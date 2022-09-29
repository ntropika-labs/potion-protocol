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
  const dayTimestamp = getDayTimestamp(timestamp);
  log.info("updating the info for pool {} at {}", [
    pool.id,
    dayTimestamp.toString(),
  ]);
  const id = pool.id + dayTimestamp.toString();
  let dailyPool = DailyPoolData.load(id);
  if (dailyPool == null) {
    log.info("pool {} didn't have operations at {}, creating new entity", [
      pool.id,
      dayTimestamp.toString(),
    ]);
    dailyPool = new DailyPoolData(id);
    dailyPool.timestamp = dayTimestamp;
    dailyPool.pool = pool.id;
  }
  dailyPool.liquidity = pool.size;
  dailyPool.pnl = pool.pnlPercentage;
  dailyPool.utilization = pool.utilization;
  dailyPool.save();
}

function updateHourlyPoolData(pool: Pool, timestamp: BigInt): void {
  const hourTimestamp = getHourTimestamp(timestamp);
  log.info("updating the info for pool {} at {}", [
    pool.id,
    hourTimestamp.toString(),
  ]);
  const id = pool.id + hourTimestamp.toString();
  let hourlyPool = HourlyPoolData.load(id);
  if (hourlyPool == null) {
    log.info("pool {} didn't have operations at {}, creating new entity", [
      pool.id,
      hourTimestamp.toString(),
    ]);
    hourlyPool = new HourlyPoolData(id);
    hourlyPool.timestamp = hourTimestamp;
    hourlyPool.pool = pool.id;
  }
  hourlyPool.liquidity = pool.size;
  hourlyPool.pnl = pool.pnlPercentage;
  hourlyPool.utilization = pool.utilization;
  hourlyPool.save();
}

function updateHistoricalPoolData(pool: Pool, timestamp: BigInt): void {
  updateDailyPoolData(pool, timestamp);
  updateHourlyPoolData(pool, timestamp);
}

function updateDailyTemplateData(template: Template, timestamp: BigInt): void {
  const dayTimestamp = getDayTimestamp(timestamp);
  log.info("updating the info for template {} at {}", [
    template.id,
    dayTimestamp.toString(),
  ]);
  const id = template.id + dayTimestamp.toString();
  let dailyTemplate = DailyTemplateData.load(id);
  if (dailyTemplate == null) {
    log.info("template {} didn't have operations at {}, creating new entity", [
      template.id,
      dayTimestamp.toString(),
    ]);
    dailyTemplate = new DailyTemplateData(id);
    dailyTemplate.timestamp = dayTimestamp;
    dailyTemplate.template = template.id;
  }
  dailyTemplate.liquidity = template.size;
  dailyTemplate.pnl = template.pnlPercentage;
  dailyTemplate.utilization = template.utilization;
  dailyTemplate.save();
}

function updateHourlyTemplateData(template: Template, timestamp: BigInt): void {
  const hourTimestamp = getHourTimestamp(timestamp);
  log.info("updating the info for template {} at {}", [
    template.id,
    hourTimestamp.toString(),
  ]);
  const id = template.id + hourTimestamp.toString();
  let hourlyTemplate = HourlyTemplateData.load(id);
  if (hourlyTemplate == null) {
    log.info("template {} didn't have operations at {}, creating new entity", [
      template.id,
      hourTimestamp.toString(),
    ]);
    hourlyTemplate = new HourlyTemplateData(id);
    hourlyTemplate.timestamp = hourTimestamp;
    hourlyTemplate.template = template.id;
  }
  hourlyTemplate.liquidity = template.size;
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
