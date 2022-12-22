# Correcting Factor for Synthetic Call Strategy

# Motivation

The current implementation of the Hedging Vault tries to protect the full amount of the Principal that is available to the Vault at the start of the Round. However, part of this principal is used to pay for the Premium when purchasing Potions. After paying the Premium, the effective amount of Principal that must be hedged will be smaller, which means the vault is currently over-collateralizing the Principal.

In order to prevent this and be more accurate on the actual amount to be hedged, the Vault must estimate how much Premium will be paid, and then calculate the final remaining amount of Principal.

This was found through Analytics simulation on the behavior of the Vault.

# Proposal

Calculating the expected Premium and the final amount to be hedged is not trivial, as the two quantities are interrelated:

- If the Premium is higher, the amount of Principal to be protected is smaller
- But the smaller the amount of Principal, also smaller the amount of Premium we should pay

Due to this it would require an iterative process in which we would asymptotically approach the correct values for Premium and Amount to be protected. This is computationally costly, particularly in the Contracts, so we will do just a 1 step iteration to approach the right quantities

# Formula

![Untitled](Correcting%20Factor%20for%20Synthetic%20Call%20Strategy/Untitled.png)

The formula above assumes a Hedging Rate (${h_r}$) that is the inverse of the Hedging Rate used in the Vault. To get the correct formula we assume:

$$
h_r = {C \over S_v^f}
$$

which yields the following formula:

$$
N_{puts} = {S_v^i * h_r  \over Strike_\$ + h_r * P_{put}(S_v^i)}
$$

where:

- ${S_v^f}$ is the initial size of the vault, this is, the full principal available in the vault in USDC
- ${h_r}$ is the hedging rate, this is, the percentage of the principal that will be hedged
- ${Strike_\$}$ is the strike price in USDC used when purchasing the potions
- ${P_{put}}$ is the estimated premium per put, based on the initial size of the vault (${S_v^i}$)
- ${N_{puts}}$ is the number of potions to be purchased (i.e. the order size)

Both the Potion Buy Action and the Operator must use the above formula to calculate the order size for the Potion Buy, so we are not over-collateralizing the vault.

# Obtaining the different parameters

- ${S_v^i}$ can be obtained by looking at the vault size, which is the **Balance** of the hedged asset for the **Potion Buy Action** account, plus the expected **Payout** for the current round, that can be retrieved from the **Potion Buy Action** with **`calculateCurrentPayout`**
- ${h_r}$ or **Hedging Rate** is a configuration parameter that can be obtained from the **Potion Buy Action**
- ${Strike_\$}$ can be calculated from the **Strike Percent**, which is a **Potion Buy Action** configuration parameter, and the **spot price**
- ${P_{put}}$ will be calculated by running the Potion Router for the initial size of the vault (${S_v^i}$) to get the expected premium for the original size, that will be used to estimate the expected premium

# Life-Cycle and Factor calculation

All the above proposal assumes that the Operator will be able to obtain the different parameters to then run the Router with the resulting ${N_{puts}}$. This implies that the **Payout** is available, which means that the **Potions** have already expired.

This means that there would be an extra delay for entering the new position, as the Operator now has to run the Potion Router twice before going for the next round.

## Mitigation Proposals

- Optimize the Router so it can execute very fast. It could then be run once the Potion had expired while still minimizing the unprotected period
- Run the Router before the Potion expires, but using the spot price at that moment to estimate the **Payout**
- Run the Router before the Potion expires, using the trend of the spot price for the latest minutes/hours, to estimate the **Payout**

# Further Simplification

PR or $H_r$ is defined as:

$$
\begin{equation}
H_r = \frac{N_p}{N_A^f}
\end{equation}


$$

where:

- $N_p$ is the number of puts purchased
- $N_A^f$ is the number of underlying assets present in the vault after paying the premium.

And in the original paper it is stated that $N_A^f$ can be further decomposed into:

$$
\begin{equation}
N_A^f = N_A^i - N_p\cdot P_\% \cdot S_\%
\end{equation}


$$

Substituting Eq.(2) in Eq.(1) we find that:

$$
\begin{equation}
{H_r} = \frac{{N_p}}{N_A^i - {N_p}\cdot{P_\%}\cdot{S_\%} }
\end{equation}
$$

where:

- $N_A^i$ is the number of assets present in the vault before paying the premium
- $S_\%$ is the strike of the puts as a percentage
- $P_\% = \frac{\text{Total premium \$ spent in puts}}{\text{total collateral \$ locked in puts}}$ is the price per put relative to the collateralized total.

Which is the same formula that we found after our brainstorming for the value of the effective hedging rate $\bar{H_r}$

$$
\bar{H_r} = \frac{\hat{N_p}}{N_A^i - \hat{N_p}\cdot\bar{P_\%}\cdot{S_\%} }
$$

Now, let’s try to redefine the Eq.(3) in terms of the actual premium being paid, which is something that we can access in the contract.

First let’s define the **Total Collateral in $** as:

$$
\begin{equation}
T_\$^c = S_\$^{price} \cdot N_p
\end{equation}
$$

where:

- $S_\$^{price}$ is the strike price in dollars
- $N_p$ is the number of purchased puts

And now redefine the **Premium Percentage** ($P_\%$) used in Eq.(3) by using Eq.(4):

$$
\begin{equation}
P_\% = \frac {T_\$^p} {T_\$^c}
\end{equation}
$$

where:

- $T_\$^p$ is the total premium paid in $
- $T_\$^c$ is the value defined in Eq.(4)

Substituting Eq.(4) in Eq.(5):

$$
\begin{equation}
P_\% = \frac {T_\$^p} {S_\$^{price} \cdot N_p}
\end{equation}
$$

Let’s also define **Strike Price** ($S_\$^{price}$) further as:

$$
\begin{equation}
S_\$^{price} = S_\% \cdot {Spot}_\$
\end{equation}
$$

where:

- $S_\%$ is the strike percentage
- ${Spot}_\$$ is the spot price in dollars

Solving for ${S_\%}$ in Eq.(7) we get:

$$
\begin{equation}
S_\% = \frac {S_\$^{price}} {{Spot}_\$}
\end{equation}
$$

Substituting Eq.(6) and Eq.(8) in Eq.(2) we obtain:

$$
N_A^f = N_A^i - N_p\cdot \frac {T_\$^p} {S_\$^{price} \cdot N_p} \cdot \frac {S_\$^{price}} {{Spot}_\$}
$$

and simplifying:

$$
N_A^f = N_A^i - \cancel {N_p}\cdot \frac {T_\$^p} {\cancel{S_\$^{price}} \cdot \cancel{N_p}} \cdot \frac {\cancel{S_\$^{price}}} {{Spot}_\$}
$$

it yields:

$$
\begin{equation}
N_A^f = N_A^i - \frac {T_\$^p} {{Spot}_\$}
\end{equation}
$$

We can further define:

$$
\begin{equation}
T_A^p = \frac {T_\$^p} {{Spot}_\$}
\end{equation}
$$

where $T_A^p$ is the **Total Premium in Assets**, and substituting Eq.(10) in Eq.(9) we get:

$$
\begin{equation}
N_A^f = N_A^i - T_A^p
\end{equation}
$$

If now we substitute Eq.(11) in Eq.(1) we find:

$$
H_r = \frac{N_p}{N_A^i - T_A^p}


$$

where:

- $N_p$ is the number of puts purchased
- $N_A^i$ is the number of assets present in the vault before paying the premium
- $T_A^p$ is the total premium spent in puts denominated in assets

By using the same nomenclature as in our brainstorm, we can define:

$$
\begin{equation}
\bar H_r = \frac{\hat N_p}{N_A^i - \bar T_A^p}
\end{equation}
$$

where:

- $\hat N_p$ is the actual number of puts purchased, which is calculated through the counterparties
- $N_A^i$ is the number of assets present in the vault before paying the premium, which is known at the beginning of the round
- $\bar T_A^p$ is the actual premium paid in the Potion Protocol, which is known after purchasing the puts

Author Roberto Cano (robercano)
