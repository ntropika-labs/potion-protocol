# Anti-Tampering Research

# Introduction

This document analyzes the need of having a Trust model in the Hedging Vault product for all the Routes that are used in the purchasing of Potions in the Potion Protocol, and the Swap Route for the Uniswap protocol. A research has been conducted to find what the state-of-the-art Solutions are, with focus on how the Trust model is affected by these Solutions.

Each Solution, or Solution Group in case of solutions offered by more than one protocol, is presented in its own section. Each section contains:

- **Summary** of how the Solution works
- **Operation** section in which the specific steps involved in the Solution are presented
- **Benefits**, with a list of the benefits that the Solution can bring to the table
- **Drawbacks**, with a list of drawbacks that the Solution has
- **Risks**, with a distilled list of items specifying the risks of implementing the Solution
- **Protocols**, a list of the Protocols that could be used to implement the Solution

# Assumptions

The following sections assume that the following statements are true:

- The MEV that the Operator could benefit from is limited by:
    - the Maximum Premium configuration set in the vault
    - the Swap Slippage configuration set in the vault
- If any bond is required to the Operator, this is greater or equal than the MEV that the Operator could obtain by foul play

# UMA + Delayed Fees (Optimistic Oracle)

An Optimistic Oracle is a system in which information is proposed as truthful with an attached bond. Members of the network can then challenge this proposal and dispute it by attaching another bond. If enough members dispute the result and it turns out to be untruthful, the original proposer loses the bond and the disputers earn a reward. If the proposal is instead considered truthful, the disputers are then penalized by losing their bond, and the proposer is rewarded.

The main caveat of this system is incentivizing the network to look at the proposals and the availability of an off-chain tool that helps validate the truthfulness of the proposal.

UMA could be used as a dispute system in which the Operator proposes the route to be used for the block at expiration date. The Operator, as a proposer, also pays a bond to UMA that will be kept until the dispute period is over. The UMA token holders can then dispute the proposal. To do that, they need a tool to verify the route. This should be some kind of command-line tool, or independent website that is able to route for past blocks. The disputers would run the tool and confirm whether the route is correct or not, and then dispute or confirm the route.

This solution relies on Subgraph being able to provide historical data so we can calculate the route for a block in the past, which can be done with [Time Travel Queries](https://thegraph.com/docs/en/querying/graphql-api/#time-travel-queries).

In this model what keeps the Operator trustful is the bond that they pay and that could be lost if the disputers find a foul route.

An extra security measure would be coupling the previous proposal with keeping the management/performance fees of the Operator for several cycles. When the Operator wants to retrieve the fees:

- At least a number of N cycles (configurable) must have passed
- The proposals for the last N cycles must have been accepted by the community

With this the Operator would not only lose the bond but also the fees

## Operation

- Operator triggers the Vault to request a route in UMA
- Operator generates a Route and answers it in UMA
- Operator indicates to the Vault that the answer has been given in UMA
- The Vault cycles to the next Round using that Route
- Community calculates the same Route by using a special tool to calculate Routes from historic data (available in subgraph)
- If Community finds a disparity, they can Dispute the Route
- Once the disputing period is resolved, a true answer is set in UMA
    - Depending on the result, the Operator may lose their bond
- The Operator starts the cycle again to move to the next Round
- The Vault checks if the answer was correct last time
    - If it is not, the fees are NOT send to the Operator
    - It is correct the fees are sent (or kept for N cycles and then sent)
- Operation repeats again

## Benefits

- Routes are validated by the Community to keep the Operator trustful

## Drawbacks

- Difficult to setup and a bit convoluted in the operation
- The tool to validate the Routes is key to the success of the solution
- The Route is first used and then validated, leading to unoptimized or foul Routes being used
- Learning how to use UMA and integrating with it may take time

## Risks

- Community needs to step-in and check the routes for every vault and every Round
- The Operator could decide to not operate the vault anymore and the Admin should step-in to change the Operator
- The Potion Router, both the normal one and the historical, should be audited to make sure that the results are always consistent, so a bug in the tool does not end up making the Operator lose a Bond

## Protocols

- [UMA](https://www.notion.so/Anti-Tampering-Research-4a68b607607f421eb1a9dc9c1722f6aa)

# Customizable Oracle

A Customizable Oracle is a network of Nodes that can execute arbitrary code to retrieve data from the off-chain world. Typically a Smart Contract initiates the request by publishing it on-chain. Then the Nodes retrieve the request, resolve it, agree on it, and finally publish it on-chain again. Then the Smart Contract can retrieve this on-chain verified data and use it.

In this kind of system the incentive is built-in, and the Nodes are only driven by these incentives, and not by the nature of the request. Requests are taken from a pool, resolved, and served, and the only motivation is the size of the incentive.

On the other side of the coin, these systems have typically a larger latency (up to 10 minutes) and can be unsuitable for short-lived data.

## Pesimistic Route Fetching

### Operation

- Community votes and decides to setup several online services to calculate the Vault routes. This are the Sources from where the Customizable Oracle will get their data
- The Operator triggers the Vault to request the Route with enough time in advance (max. 10 minutes)
- The Customizable Oracle resolves the query through their network of validators and publishes the result on-chain
- Once the answer is on-chain, the Operator indicates the Vault to move to the next Round
- The Vault fetches the Route information from the Oracle and moves to the next Round
- Fees are sent to the Operator
- Operation repeats again

### Benefits

- Makes use of the available infrastructure for Customizable Oracles
- Operation happens fully on-chain, and the off-chain part is executed blindly by the network validators
- Anybody could trigger the Vault in case the Operator does not step-up, and even collect the fees (there could be like a time-frame in which only the Operator can trigger, and otherwise anybody can trigger, for example)

### Drawbacks

- The Route may be 10 minutes old when it is used, and perhaps it does not reflect the latest state of the Potion Protocol
- Needing to understand which of the Customizable Oracle services should be used, learning about the service and integrating it may take time
- There are two transactions per Round: one to request the Route and the other to actually move to the next Round

### Risks

- The Route could be too old, meaning that the utilization for the given LPs could have changed, making the premium to increase beyond the Maximum Premium configured in the vault, and thus reverting the transaction to enter the next Round. If this happens then the whole cycle should be repeated again, increasing the exposure of the assets in the Vault

## Optimistic Route Fetching

### Operation

- Community votes and decides to setup several online services to calculate the Vault routes. This are the Sources from where the Customizable Oracle will get their data
- The Operator calculates the Route and sets it in the Vault, along a bond
- The Vault also requests the Route to the Oracle and moves to the next Round using the Route that the Operator configured
- The Customizable Oracle resolves the query through their network of validators and publishes the result on-chain
- When the Round finishes, the Operator configures a new Route
- The Vault then fetches the Route information for the previous Round from the Oracle and validates whether the Route was correct or not
    - If it was NOT correct, the Round Fees and the Bond are kept from the Operator
    - If it was correct, the Round Fees are sent to the Operator and the Bond is released
- Operation repeats again

### Benefits

- Makes use of the available infrastructure for Customizable Oracles
- Operation happens fully on-chain, and the off-chain part is executed blindly by the network validators
- Validation is easy to track as all information is on-chain
- There is no delay in the execution of the next Round and the Route is freshly calculated
- Only one transaction to move to the next Round
- The Operator role could be open to anybody: anybody that sets the route and the requested bond can trigger the operation

### Drawbacks

- Needing to understand which of the Customizable Oracle services should be used, learning about the service and integrating it may take time
- The Route used by the Vault may be wrong or tampered with and the Vault won’t know until the end of the Round
- Bond must be enough to offset the benefits that the Operator is getting

### Risks

- The Route could be wrong and thus leading to the Vault paying more Premium than needed. This could be mitigated by requesting the Operator to add the Maximum Premium as a bond, for example

## Protocols

### [WitNet](https://www.notion.so/Anti-Tampering-Research-4a68b607607f421eb1a9dc9c1722f6aa)

The Witness Network has a service that allows a Smart Contract to do API queries in a decentralized way. The way this works is that a Query to several sources is prepared in JS and compiled into Solidity with a special tool. This query can then be broadcast to the Witnet from the Smart Contract. In a maximum of 10 minutes the answer is published on-chain and the Smart Contract can access it and use it for execution.

In our case, the 10 minutes time span could be too long, as the liquidity could move quickly. The protocol does not seem to allow for a configurable time span and only guarantees that the time is less or equal to 10 minutes.

### [Band Protocol](https://www.notion.so/Anti-Tampering-Research-4a68b607607f421eb1a9dc9c1722f6aa)

Seems to follow a similar approach as WitNet and offers around 3 seconds query resolution. However it seems quite convoluted to use, and there is no documentation about how to query the custom data from a Smart Contract (at least no explicitly)

### [Tellor](https://www.notion.so/Anti-Tampering-Research-4a68b607607f421eb1a9dc9c1722f6aa)

It’s yet another Oracle but seems to be very basic and not very mature

### [Paralink](https://www.notion.so/Anti-Tampering-Research-4a68b607607f421eb1a9dc9c1722f6aa)

It has the same customizable Oracles, but it runs currently on Polkadot. Community is developing an Ethereum <> Polkadot bridge, but it is still not deployed.

# Off-Chain Voting + Delayed Fees

In this approach a proposal is made off-chain with an attached payload to be executed on-chain once the proposal is approved. The proposal is voted on, and after a period of time, the answer proposal period starts. In this period the community members will propose which answer was given during the voting period. To do so they also send a bond along the answer. This answer can then be approved or disputed while the answering period lasts. Each new dispute will also send a higher bond to back-up their claims. At the end of the period the answer with the highest bond is accepted as valid and if the answer was to execute the payload, then it can be automatically executed by anybody in the community. All the bonds of people that answered correctly are returned and all bonds that are answered incorrectly are removed from their proposers.

## Snapshot

Snapshot plus Reality.eth can be used for proposing routes. The route should be proposed, and immediately answered by the Operator, staking a bond at the same time. Then the community could dispute the proposal to validate it or not. The problem here is that the proposal creation would be either manual (by the Operator) or automatic (by a bot in a centralized server), and also it would be difficult to understand which proposals are actually valid and which ones could be fake. The community would need to go check the contracts in Etherscan and see the latest route to understand if the proposal belongs to that route or not.

This solution could work if using a bot in which the bot would fetch the routes (maybe even sign them), create a proposal, and set in the contract the routes + proposal ID. People could validate that the proposal was created by the right account (the bot account) and that the route was set in the contract for that exact proposal ID. The community could easily verify that the proposal is the one set in the contract, but they would still need to validate the route against the route in the proposal, which could be difficult due to the nature of serialization of Solidity. A special tool would be needed to validate the data, that the community would need to learn to use.

### Snapshot + UMA

Snapshot is integrating UMA into SafeSnap, which could help automating the proposal creation. In the end it would work the same as in the solution using Reality.eth, but the proposal is created in UMA with the bond, and then voted on Snapshot. This use case complicates the flow and it would be better to just use UMA

### Snapshot X

Will offer the same functionality as Snapshot but fully on-chain. However the project is still being audited and still not out there, so it is not considered in the operation flow.

## Operation (Snapshot + Delayed Fees)

- Operator creates proposal for Route in Snapshot and sets the Route and the proposal ID in the contract, along a bond that will be kept in the Vault
- The Vault cycles to the next Round using that Route
- The proposal in Snapshot is linked to a SafeSnap that will execute one of two transaction after the proposal resolution:
    - If the Route is approved, then the bond is released to the Operator
    - If the Route is rejected, the bond is kept and can be sent to the Community treasury, or shared among the voters that correctly identified the foul Route
- Community calculates the same Route by using a special tool to calculate Routes from historic data (available in subgraph)
- Community then votes the proposal to accept/reject the Route
- The Operator starts the cycle again to move to the next Round
- The Vault checks if the answer was correct last time:
    - If it is not, the fees are NOT send to the Operator and the bond is NOT released
    - It is correct the fees are sent (or kept for N cycles and then sent) and the last bond is released
- Operation repeats again

## Benefits

- Routes are validated by the Community to keep the Operator trustful

## Drawbacks

- Difficult to setup and a bit convoluted in the operation
- The tool to validate the Routes is key to the success of the solution
- The Route is first used and then validated, leading to unoptimized or foul Routes being used
- Learning how to use Snapshot and integrating with it may take time

## Risks

- Community needs to step-in and check the routes for every vault and every Round
- The Operator could decide to not operate the vault anymore and the Admin should step-in to change the Operator
- The Potion Router, both the normal one and the historical, should be audited to make sure that the results are always consistent, so a bug in the tool does not end up making the Operator lose a Bond

## Protocols

- [Snapshot](https://snapshot.org/)

# Signed Routes

In this model the Routing component would be centralized and deployed in a server with access to signing keys. The Operator would request the route from this server that would basically generate the route and sign it. The Operator would pass both the route and the signature to the Hedging Vault that would validate them, and if valid, use them for the next Round.

## Operation

- Community votes and decides to deploy the Router in a centralized server with some Signing Keys controlled by the Community and available to the Router
- The Operator would retrieve the Route from the centralized server and send it to the contract during the next Round transaction
- The Vault would verify that the Route is correct and coming from the trusted source
- The Vault would use the Route to go to the next Round
- Operation repeats again

## Benefits

- Easy to setup and use
- Operator cannot tamper with the Route
- Operator could be further simplified and included in the centralized server that would calculate the Route, sign it and send the next Round transaction to the Vault

## Drawbacks

- Service is centralized
- If service is compromised and the keys are stolen/leaked, an attacker could use them to trigger the vault with a foul Route. However the MEV would be the Maximum Premium configuration in the Vault
- Single source of truth. If the Router tool is buggy or somebody with privileged access tampers with it, it would be more difficult for the Community to audit it

## Risks

- If keys are leaked/stolen, anybody could sign the Routes
- Single source of truth means that the Router tool must be bug-free and make sure nobody can tamper with it

# Predefined Set of Pools

In this model the routing disappears altogether and a set of predefined pools is used. In the Hedging Vault contract a simple algorithm could be used to choose the best fit among the pools (maybe even a combination of the pools) to minimize the premium paid on each cycle.

The advantage of this is that the solution is completely decentralized and that the Operator role would be greatly simplified to a simple `nextRound()` transaction with no parameters.

The disadvantage is that the transaction would need more gas to choose from the right pools. In a first approach we could just use a single pool that would be exclusively used for the Hedging Vault (this is not supported in the Potion Protocol yet)

## [ChainLink Automation](https://www.notion.so/Anti-Tampering-Research-4a68b607607f421eb1a9dc9c1722f6aa) (aka Keeper Network)

Using a predefined set of pools would enable the use of an automation network like ChainLink. In this model, an Upkeep contract would be registered in the network that would execute the next cycle when the time arrives.

This may, however, introduce some latency in the execution of the next round, as it will depend on the Automation network running the transaction on time, the network congestion and gas fees.

## Operation

- Strategist/Admin configures the set of pools to be used for the Vault
- The Operator, or even anybody, could trigger the next Round transaction (only when the time frame is correct)
- The Vault would select the right pool or pools, and use them to transition to the next Round
- Operation repeats again

## Benefits

- The easiest solution to implement
- Trusted source of truth on-chain
- Strategist/Admin could always adjust this over time if needed
- The role of Strategist could be given to a Multi-Sig controlled by the Community, so the setting of the Routes could always comes from consensus
- Anybody could trigger the next Round, and collect the fees, which means that if Operation gets interrupted for any reason, Users of the Vault could still use it (as far as the Routes set in the vault are valid)
- Easy to automate through Chainlink Automation or OZ Defender

## Drawbacks

- Limited set of pools would mean that the premium is not as optimized as it could and it could affect the performance of the Vault
- LPs whose pools are set in the Vault could decide to boycott the Vault by removing liquidity (ideally the pools should have a strong agreement to stay in the Protocol, so they cannot disappear from one block to the next)
- Health of the set of Pools must be monitored to ensure the correct operation of the Vault
- Need to trigger returning the Collateral to the LPs before the next Round, to ensure that the utilization is lower before purchasing the Puts (this may be true even for our current solution)

## Risks

- Exposure is concentrated in a few LPs which could lead to this LPs modifying their bonding curves and making the operation more expensive
- LPs suddenly removing liquidity and making the Vault not being able to move to the next Round could increase the Vault’s assets exposure
- High premiums due to over-utilization of the LPs

# Conclusion

Having a look at the different solutions, it seems that three of them are the most interesting.

## Selected Solutions

### Customizable Oracle - Optimistic Route Fetching

The Optimistic Route Fetching is very interesting because it is almost fully decentralized, except for the data sources that must be setup in a centralized server. However decentralization can be achieved by setting up more of these data sources. It would easily allow more Community members to setup their own data sources and it would open up the Operation to anybody interested in doing it. However the setting up of data sources would NOT be incentivized and there is a risk of only being 1 data source in total for the Operation.

In this model the Trust comes from the different data sources that are available and that must match in their answers for the validator network to validate the data and set it on-chain. Because setting up new sources is NOT incentivized, there is a risk that only one data-source exists, in which case we have a very complex architecture that is effectively implemented a solution similar to the Signed Routes one, but without the signing and with a lot more complexity in between.

If we would manage to incentivize setting up the Routing services, then it could be an interesting approach.

### Signed Routes

The Signed Routes approach is a simpler one to implement, although it is fully centralized. In this case the Trust comes from the people that sets up the service, and because it is an off-chain service, it would be difficult to apply governance to it, meaning that anybody in the Trusted group could tamper with the Routing tool.

### Predefined Set of Pools

This is by far the simplest to implement solution, although there are some upkeep concerns that must be addressed, in case a pool disappears or becomes unusable due to utilization. Also the LPs could increase their premiums due to increased exposure, as every downside of the asset would be suffered by the same LPs. Aside of this, the gas consumption would also increase so it is needed to keep an eye on the amount of gas used for the `nextRound` transaction.

## Final Recommendation

It is very difficult to choose a solution without exactly knowing the Governance model that the Community wants to implement and the Trust model that they could pursue.

Being the simplest of all of them, the recommended Solution is the **Predefined Set of Pools** for the time being, and then having conversations with the Community to see what would suit their Governance model. However this approach, when using single Pools can lead to degraded performance and illiquidity risks. In order to solve this issues it is needed to add Aggregated Pools to the Potion Protocol, where more than one LP can participate in the Pool. The Hedging Vault could then use a selection of this Aggregated Pools for its operation.

If going for the proposed model, it is also needed to provide some tools for the Community to be able to reassess the choice of LPs on every cycle in case they want to change it in a Governance vote through Snapshot + SafeSnap.

# References

[1] [Oracles in Ethereum](https://ethereum.org/en/developers/docs/oracles/): [https://ethereum.org/en/developers/docs/oracles/](https://ethereum.org/en/developers/docs/oracles/)

[2] [UMA](https://umaproject.org/): [https://umaproject.org/](https://umaproject.org/)

[3] [WitNet](https://witnet.io/): [https://witnet.io/](https://witnet.io/)

[4] [Band Protocol](https://bandprotocol.com/): [https://bandprotocol.com/](https://bandprotocol.com/)

[5] [Tellor](https://tellor.io/): [https://tellor.io/](https://tellor.io/)

[6] [Paralink](https://paralink.network/): [https://paralink.network/](https://paralink.network/)

[7] [Chainlink Automation](https://chain.link/automation): [https://chain.link/automation](https://chain.link/automation)

Author Roberto Cano (robercano)