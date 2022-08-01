/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

/**
    @title TimeUtils

    @author Roberto Cano <robercano>
    
    @notice Utility library to do time calculations. Used to adjust a timestamp to the next
            timestamp that falls on 08:00 UTC.
 */
library TimeUtils {
    uint256 private constant SECONDS_IN_DAY = 86400;
    uint256 private constant SECONDS_IN_HOUR = 3600;
    uint256 private constant SECONDS_TO_0800_UTC = 8 * SECONDS_IN_HOUR;

    /**
      @notice Given a timestamp it calculates the timestamp that falls on the same day but is offset by
              the given number of seconds from 00:00 UTC of that day
      
      @param timestamp The timestamp to adjust
      @param secondsFromMidnightUTC The number of seconds from midnight UTC for the same day represented by `timestamp`

      @return The timestamp that falls on the same day but is offset by the given number of seconds from 00:00 UTC of that day
   */
    function calculateTodayWithOffset(uint256 timestamp, uint256 secondsFromMidnightUTC)
        internal
        pure
        returns (uint256)
    {
        uint256 timestampAtMidnightUTC = timestamp - (timestamp % SECONDS_IN_DAY);
        return timestampAtMidnightUTC + secondsFromMidnightUTC;
    }
}
