# Daily and hourly entities

## Implementation details

- inspired by uniswap daily and hourly pool entities
- The implementation required 4 new entities
    - DailyPoolData
    - DailyTemplateData
    - HourlyPoolData
    - HourlyTemplateData
- It is possible to directly retrieve from both Pool and Template the respective historical data, removing the need to do multiple queries to fetch all the related snapshots and compute them in the frontend
- Those entities are created/updated after any event that change a pool similarly to the snapshots
- because of implementation complexity and performance, there isn’t a generation of entities for days/hours without any operations; this means that to plot a chart we need to fill the empty days with the previous day value

## Cost in entities compared to snapshots for a single pool

### Worst case scenario

- daily entities worst case scenario is if we have exactly one operation in a day increasing the number of entities generated from 1 to 3 (1 snapshot, 1 daily pool and 1 daily template)
- hourly entities worst case scenario is if we have exactly one operation every hour increasing the number of entities generated from 24 to 72 (24 snapshots, 24 hourly pools and 24 hourly templates)
- Combined cost of the daily entities worst case scenario will be from 1 to 5 (1 snapshot, 1 daily pool, 1 daily template, 1 hourly pool and 1 hourly template)
- Combined cost of the hourly entities worst case scenario will be from 24 to 74 (24 snapshots, 24 hourly pools, 24 hourly templates, 1 daily pool and 1 daily template)

Basically both scenarios are a +300% increase compared to the snapshots compared but the numbers are different, making the hourly entities considerably heavier than the daily entities in extremely unoptimized scenarios

### Other scenarios

Because all the options settlements happens at 8 UTC we will often have a spike of operations there; keeping in mind this spike and considering that a certain percentage of operations will tend to happen at that time (with the rest spread evenly on every hour) we have the following costs in entities

| % of operations at 8 UTC | 0 | 25 | 50 | 75 | 100 |
| --- | --- | --- | --- | --- | --- |
| 24 operations | 74 | 54 | 52 | 40 | 28 |
| 48 operations | 98 | 98 | 98 | 98 | 52 |
| 96 operations | 146 | 146 | 146 | 146 | 100 |
| 144 operations | 194 | 194 | 194 | 194 | 148 |
| 192 operations | 242 | 242 | 242 | 242 | 196 |
- the cost of daily entities (a flat 2) is always negligible
- the cost of hourly entities (a flat 48) of the worst case scenario became less significant with the more operations we do
- the best case scenario is the same as daily entities so basically negligible