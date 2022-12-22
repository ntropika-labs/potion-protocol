# Dapp Tech Improvements

The V2 of the Potion Dapp has been developed taking in consideration the new Composition API from Vue3, revamping existing features and the component system, consolidating the look and feels of the app and improving the user experience.

## Current version shortcomings

### Wallet Management

We added wallet support through [Web3-Onboard](https://docs.blocknative.com/onboard) and developed a Vue3 wrapper for it but we are not using all the functionalities in our application.

The current shortcomings of our wallet integration are:

- Only support one address at a time;
- Only support one wallet at a time;
- Only support one network at a time;
- We are missing the opportunity of showing user balances and allowances directly in the wallet component;
- We are missing the opportunity of showing user positions directly in the wallet component;
- We are missing the opportunity of letting the user “setup” his experience directly from the wallet component: an example is the ability to change the slippage or choose from infinite approval and limited approval for erc20 spending;

### Network reactivity system

Right now the app only supports one network at a time. If the user switches network in Metamask, the app will react only partially, creating problems and possibly calls to wrong contracts during the usage:

- the wallet will react to the network change, but the addresses will be the one configured at build time;
- the JsonRPCProviders will not react to the network change;
- the Subgraph provider (URQL) will not react to the network change;

### Deploy and build system

While we focused on the development experience for this version, we didn’t take into considerations adding new features, so we focused on having a dev and a mainnet environment.

Right now the deploy system outputs several network configurations but we don’t have a standard process and “framework” to consume the data and configure variables globally. This means that it’s difficult to adapt all the “deploy dependents” and we need to manually change build, dev and test scripts to make the stack work.

## Improvement proposals

### New reactivity system for Ethers

I’ve spent some time exploring solutions to make Ethers “reactive” to data/parameters change leveraging the Vue3 reactivity system. I’ve build a demo to check if everything was working as intended and I do think we can improve the app by start utilizing this new system.

What we can achieve with the new reactivity system:

- App can be network agnostic;
- App can be account/wallet agnostic;
- The system is memory efficient ⇒ app is going to be faster;
- Simpler, leaner and testable code;
- Reactivity granularity: every parameter is meant to be reactive - if something changes in the data chain, everything will update accordingly. From contract address to network and user accounts;
- Composability: mix small reactive functions to create reactive systems;
- Notify the user if they’re connected to a not supported network;

### User Info state storage

With the help of the new reactivity system, we can build an user state managed by Pinia.

The state manager (store) will keep the user information updated and synced inside the app:

- User balances (eth, usdc and so on);
- User preference about slippage;
- User erc20 allowances;
- Listen to balances/allowances changes;
- Network preference;

### Wallet and settings component

Considering the previous points, we can collect and centralize most of the “options” (network, account change, slippage, showing balances and so on) in a component that wraps around Web3-Onboard and the User Store. The component should have a set of minimal features to add value to the application:

- Custom modal;
- Manage the available networks;
- Manage the wallets;
- Manage the addresses (switch between addresses of the same wallet);
- Show user balances and allowances for the protocol contracts;
- Let the user switch from infinite and limited allowance;
- Let the user select his preferred slippage setting;
- Let the user modify the RPC URL, so they can set their own (privacy oriented feature);

![Untitled](Dapp%20Tech%20Improvements/Untitled.png)

![Untitled](Dapp%20Tech%20Improvements/Untitled%201.png)

![Untitled](Dapp%20Tech%20Improvements/Untitled%202.png)
