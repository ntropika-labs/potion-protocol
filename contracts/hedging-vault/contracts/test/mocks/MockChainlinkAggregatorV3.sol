/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "@openzeppelin/contracts/interfaces/IERC20.sol";

import "../../interfaces/IChainlinkAggregatorV3.sol";

contract MockChainlinkAggregatorV3 is IChainlinkAggregatorV3 {
    int256 public latestAnswer = 100000000;

    constructor(int256 initialAnswer) {
        latestAnswer = initialAnswer;
    }

    function decimals() external pure returns (uint8) {
        return 8;
    }

    function description() external pure returns (string memory) {
        return "Mock Chainlink Aggregator";
    }

    function version() external pure returns (uint256) {
        return 1;
    }

    function getRoundData(uint80 _roundId)
        public
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (_roundId, latestAnswer, 0, block.timestamp, 0);
    }

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return getRoundData(uint80(0));
    }

    function setAnswer(int256 answer_) external {
        latestAnswer = answer_;
    }
}
