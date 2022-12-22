# Hedging Vault Security And Operation Notes

# Uniswap V3 and Oracle Pricing

At this moment the Potion Buy action contract is using the Oracle to price the hedged asset. However, when swapping it for USDC through Uniswap V3, the asset could be priced differently. This discrepancy in price must be considered to understand if it can lead to an issue.

Also the premium calculation in USDC is currently done with the Oracle price, which can be misleading for the same reason.

# Uniswap V3 and Routing

The Uniswap Route calculation needs the amount of assets that will be swapped in order to get the route. For the enter position this means that no deposits can be made once the operator starts calculating the route (this is not implemented but it is considered in the roadmap for the back-to-back operation).

Then, in the exit position, the problem is that the payout cannot be known until the expiration date is reached. This imposes a restriction in the system for the back-to-back operation: the operator needs to wait for the expiration timestamp, request the payout and then prepare the route as fast as possible. However the assets will be uncovered for a few blocks while the route is calculated and the transaction is mined. Then if the transaction would fail, the assets would be uncovered for even more time.

# Cycle Duration and time calculation

When the action contract is deployed, it initializes its cycle start taking into account the deployment block timestamp. This means that we DON’T control when a vault cycle starts, only the duration and the start is determined by the deployment. If we’d like to control the start of the cycle we need to pass this information to the contract

# Opyn AddressBook addresses update

Currently the addresses are fetched every time, so they are kept up to date. However we could save gas by caching them, but then we need a mechanism to update them. This however breaks the fact that PotionProtocolHelper has all internal functions and no public ones. If we add a public one then we need to inherit from RolesManager, complicating the architecture

# Quick Notes

- Check attack surface of the contracts
- Consider reentrancies
- Consider adding fuzzy testing
- Add property testing where needed
- Re-check all fixed-point number usage
- Run Slither Analysis

Author Roberto Cano (robercano)