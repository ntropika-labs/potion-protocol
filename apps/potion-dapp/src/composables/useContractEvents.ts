import { BaseContract, type Event, type EventFilter } from "ethers";

const IS_DEV_ENV = import.meta.env.DEV;
type FilterCallback = (event: Event, ...params: any) => void;

/**
 *
 * @param contract The instance of the contract to listen events on
 * @param startingBlock A number corresponding to the minimum block number the events must have.
 * It's exposed as a nullable parameter to ensure it's always defined when listeners are running, as opposed to querying for it in `onMounted` which may result in it not being defined for the first couple events
 * @param debugEvents When working in a test environment, this flag can be enabled to further debug events
 * @returns
 */
export function useContractEvents(
  contract: BaseContract,
  startingBlock: number | null = null,
  debugEvents = false
) {
  const addEventListener = (filter: EventFilter, callback: FilterCallback) => {
    contract.on(filter, (...args: any) => {
      const length = args.length - 1;
      const event: Event = args[length];
      const params = args ? args.slice(0, length) : [];

      if (IS_DEV_ENV && debugEvents) {
        console.log(
          "EVENT LISTENER",
          event.event,
          startingBlock,
          event.blockNumber,
          args
        );
      }

      if (startingBlock && event.blockNumber < startingBlock) return; // TODO: CHECK

      callback(event, ...params);
    });
  };

  const removeEventListeners = (filterOrEvent?: EventFilter) => {
    contract.removeAllListeners(filterOrEvent);

    IS_DEV_ENV &&
      debugEvents &&
      console.log("DEBUG EVENTS AFTER CLEAN", getEventListeners());
  };

  const getEventListeners = (filterOrEvent?: EventFilter) => {
    return contract.listeners(filterOrEvent);
  };

  //   onUnmounted(() => {
  //     console.log("ON UNMOUNTED EVENTS", contract.listeners());
  //     removeEventListeners();
  //   });

  if (IS_DEV_ENV && debugEvents) {
    const filter: EventFilter = { topics: [] };
    contract.on(filter, (...params: any) => {
      console.log("DEBUG CATCHALL", params);
    });
  }

  return {
    addEventListener,
    removeEventListeners,
    getEventListeners,
  };
}
