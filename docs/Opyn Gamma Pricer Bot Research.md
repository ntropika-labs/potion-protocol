# Opyn Gamma Pricer Bot Research

# Analysis

Opyn is using Open Zeppelin Defender with an auto-task to feed the prices to their Oracle and set the price of the underlying asset at expiration time of an option. This bot script depends on:

- OpenZeppelin **Relayer** to sign and pay for the transactions
- Opyn **Addresbook** to retrieve the address of the Opyn Oracle
- Opyn **Oracle** to check if the expiry price has not been set yet and if the locking period has passed (locking period seems to be a period after the expiration of an option where the Pricer cannot update the price of the Oracle. Not sure about what they use this for)
- **ChainLinkAggregator** to calculate the round ID that will be used to feed the ChainLinkPricer
- **ChainLinkPricer** to set the price after expiry

There are two types of pricer bots: for base assets and for derived assets. The derived assets bot seems to be used only for Yearn Finance USDC, so the one we want to use is the base asset bot.

This bot seems to run once in a while (this belongs to the OZ autotask configuration that is not public). Then it checks if it is Friday (seems they only update prices on Fridays) and then if the expiration hour has passed. In Opyn all oTokens expire at 8 a.m. UTC. If these 2 conditions are met, then the bot goes onto setting the expiration price in the Oracle.

The architecture they use is the following:

![Untitled](Opyn%20Gamma%20Pricer%20Bot%20Research/Untitled.png)

The **ChainLinkPricer** is an Opyn contract that acts as an intermediary between the **Opyn** **Oracle** and the **ChainLink** **Price** **Oracle.** The ChainLinkPricer contract accepts requests from anyone to set the price after the expiry time, including the **Bot**. However if the caller is not the corresponding bot, the round data from the external price Oracle is validated before setting it in the Opyn Oracle. If the caller is the bot then it is assumed that the round ID for the price data is correct, and then the price is set in the **Opyn Oracle**, which will be consumed later on by the **MarkingCalculator.**

# Proposal

In our independent deployment we are only missing the **ChainLinkPricer**. Then we also need to setup an Open Zeppelin **Relayer** and the **Autotask**. So the steps to setup a similar system would be:

- Create a **Relayer** in Open Zeppelin Defender, and fund it. Take note of the address of this relayer
- Deploy an independent version of Opyn, including the **ChainLinkPricer.** The **ChainLinkPricer** will need the address of the relayer to be passed in the constructor as the **bot** parameter.
- Set the deployed **ChainLinkPricer** as a valid asset pricer in the **Oracle** through a call to Oracle::setAssetPricer()
- 
- Modify the base asset bot code to point to the new independent deployment’s **Addressbook, Oracle, Relayer** and **ChainkLinkAggregator.** This last one must be the aggregator for the specific asset you want the price for
- Create an **Autotask** with the modified base asset bot code. Configure it to run on Fridays after 8 a.m. UTC