# Potion V2 Write Up

In March 2020, I joined Potion Labs as the only frontend developer to help them build the Potion Protocol dApp, an amazing AMM composing on top of Opyn, running on Ethereum. I knew nothing about all the blockchain sorcery but, as a freelancer and contractor, I was used to working full-stack on projects by myself, so I started developing!

At that time, we knew the main features of the application, but we were exploring technical solutions to make the user experience to be as human-centric as possible. Based on the fact that the smart contracts were not finalized and audited yet and the designs were not ready, we decided to go for an MVP, so we could start developing as fast as we could.

## Stack

Being the only web developer in the team, I had the opportunity to pick my choices!

- Javascript: we didn’t want to “waste” time setting up a Typescript environment working with Vue2 and Vuex. This was a mistake but saved me tons of time in the early development cycles;
- Vue2: at the time, Vue3 was still in alpha 8; I felt way safer with Vue2. This was a hit or a miss: we shipped fast knowing we were using a stable framework but we lost tons of new features from Vue3 (and proper Typescript support);
- Tailwind CSS: early adoptooor here! I personally like building my own design system without relying on external component libraries. v1.2 was already released and I had a bunch of other projects in my portfolio running on Tailwind CSS - plus, our designer was working on a custom UI kit. Tailwind was a perfect choice.

## How we collected Tech Debt

Move fast, ship faster is that kind of a mantra that helps you in your early stage, so you can develop your idea and showcase your product. Most of the time though, this mantra leads you to several problems: the more you develop by only looking ahead, the more you collect bugs and bad design choices that entangle themselves in a spiral of spaghetti code. While we had the fully working MVP of the app before the contracts were even audited, our confidence in the code wasn’t great.

Going deep to find the root of our problems in a team retrospective, we found five major causes that made us go for a complete revamp of the application and code structure:

- **Design while developing** - after a month of development, I already refactored all the components to address all the changes in the design system. It was a very boring and time-consuming task, and manual testing everything to be sure the new components were working was a major hassle. The moment the team grown up, we refactored most of the components another time;
- **Missing Typescript** - Interacting with smart contracts on Ethers is not complex per se: the complexity comes from the data structure the blockchain likes and interacting in a clean way. We eventually discovered Typechain, and so we managed to do a partial refactor to add Typescript to all the business logic to be “moderately typed”. Components were not typed yet.
- **Manual testing** of every new feature, component and business logic. We spent weeks testing the components, testing user flows, testing the router, and solving little but very annoying bugs.
- **Development Experience** - Spinning-up the local dev environment was also a hassle: it was required to run lots of scripts in a specific order to make it work, and again when you needed to reset the status of the blockchain. It was really time-wasting;
- **Wallet Integration** - It was an MVP so we decided to go with Metamask to, later on, scale up with WalletConnect.

The peak of our most stressful days was between August and September when the team started preparing the code to be released. We spent the first 3 weeks cleaning the code from typos, testing the application manually, and integrating Matchstick into the subgraph. Later on, we spent another two weeks testing the Potion Router and plot charts to be sure everything was running smoothly.

## An opportunity to learn from our mistakes

In November we figured out we were going to need to build another dApp: Potion Unlock.
We didn’t want to be haunted by our past wrong choices so we set up everything with a better structure:

- Vue3
- Typechain
- Graphql Codegen
- Urql
- Typescript

We had the first MVP in less than two weeks and the app was running smooth. Still, no E2E tests but the complexity was way lower than before, so manual testing was tackled very easily.

The protocol was simpler but having multiple repositories to clone/pull every day and spin everything to start working in the morning was a bummer. While the development of the app was pretty much good in terms of experience, managing multiple repositories was not.

On top of this, we developed this new protocol with a new team member, so our coordination was not the best!

## Retrospective

It’s now March, the Potion Unlock event is done and we are exhausted… but we needed to add the multi-wallet feature to the Potion App. Ok, let’s do it: after 3+ months of not working on it, I spent a day setting up the env. Oh, did I tell you the app was running on webpack? Every time I changed a semicolon, I had to wait 4 seconds for a reload. That’s fun!

After a few days, I ended up integrating web3-onboard into the app and started harassing our CTO to let us move everything to a monorepo and port the application to Vue3.

I prepared a very high-level architecture plan and we agreed on preparing a POC to reflect it. We tried to address very few points with this POC:

- We needed an official workflow for GitHub repositories and automated versioning;
- Typescript is a must; the more you type, the better;
- You cannot simply do manual tests and opt-out from unit tests, component testing, and e2e tests;
- We needed a monorepo from the beginning;

# Starting from scratch

After the retrospective, we settled on building a better development experience for us, starting by an official development flow based on Github pull requests

### Development Workflow

![Untitled](Potion%20V2%20Write%20Up/Untitled.png)

This is how we work now! We started by defining a Git and Github flow stating everything in a doc open to every engineer in our team. This is a slightly less strict version of [gitflow](https://danielkummer.github.io/git-flow-cheatsheet/) with a bunch of automation added to Github. 

### New Tools and Libraries

We picked up a bunch of goodies to be added to the POC:

- ViteJS, to develop in a fully native Typescript and ESM compatible environment. We improved the server reload time from 4s to 0.4s on changes;
- Yarn Berry, to manage dependencies and workspaces. PNPM had problems with The Graph;
- NX, to manage the monorepo orchestration;
- Vue3, to develop the component library and the web app;
- UnoCSS - we like atomic;
- I18n because internationalization is easy if starting early;
- Storybook, to develop components in isolation and have a library of components ready to review;
- Vitest for unit testing;
- Cypress for E2E tests and Component testing;
- Web3-onboard by Blocknative as a wallet integration library;

### Multiwallet

After developing a rudimentary multi wallet solution, we decided to settle with web3-onboard from Blocknative. Their library is framework-agnostic, uses RXJS under the hood for the reactivity system, and is “simple” yet powerful. We ended up developing a wrapper for Vue3 by publishing a very neat composable into the web3-onboard monorepo. You can install it with `npm i @web3-onboard/vue`

![Untitled](Potion%20V2%20Write%20Up/Untitled%201.png)

### Split libraries

Managing one single monolithic app is more difficult than managing multiple libraries with small api surfaces. Here’s how we organized the new monorepo:

![Untitled](Potion%20V2%20Write%20Up/Untitled%202.png)

### E2E Testing

Our app has a lot of user interactions and reactive data changes: this means that we have tons of side effects going on and a lot of edge cases to take care of.

By moving the app from Vue2 to Vue3, we started using Typescript more actively:

- We `codegen` whatever we can - from Graphql to Typechain;
- We type component Props;
- We type component Emits;
- We type helper functions, Vue Composables, and business logic;

This effort helped with Development Experience but didn’t give us the confidence we would like while refactoring: We started developing components in isolation through Storybook and tested them with Vitest running in watch mode to improve it.

This workflow added tons of confidence about the inner logic of our components but we felt we missed something: we couldn't test a complete user story, where (for example) the user could create a custom pool or add/withdraw some liquidity from it. The problem is the blockchain and the need to have a very strict and tested wallet integration in the app, that relies on external services or browser extensions to be able to sign transactions.

After the implementation of web3-onboard, something came to my mind: what if I can conditionally load a wallet from a mnemonic and use it to sign transactions? I would probably be able to write down end-to-end tests for the whole stack!

TLDR: it worked **[🤖](https://emojipedia.org/robot/)** and the solution is in 5 lines of code:

```jsx
if (mode === "test") {
  const wallet = Wallet.fromMnemonic(mnemonic);
  const provider = new JsonRpcProvider(rpcUrl);
  return wallet.connect(provider);
}

```

### Cypress

I had to choose a framework to start tinkering on, and Playwright is not officially supported under Linux, so Cypress is it.

The first test runs over the flow of creating a custom pool and asserts possible errors and gotchas and more importantly, can fire up the transaction to create a new pool!

This opens up the path of end-to-end testing for every complete user journey in a “production-like” environment where we rely on the whole stack to test edge cases and build up complex app states.

Here’s a quick demo:

[CustomPoolCreation.cy.ts.mp4](Potion%20V2%20Write%20Up/CustomPoolCreation.cy.ts.mp4)

### Orchestration

Besides the usual lint and format at pre-commit, we have a bunch of stuff going on locally on Docker and on the cloud in Github.

Let’s say that you’re a developer, and you want to start working on the Potion Protocol, here’s how smooth the DX to run everything is now:

`cp .env.example .env`

*To copy the environment file. You’ll need to fill in some keys like API secrets, for example;*

`yarn prepare-seeds`

*To copy the predefined blockchain databases to be used in the various E2E test scenarios (or in development mode);*

`yarn local-dev`

*To spin ganache, the subgraph, and the app. This command will generate all the additional files needed to run everything;*

`yarn nx run potion-dapp:test-e2e-dev`

*To run the integration tests over the app;*

What does this all means? When I start coding in the morning, I open the editor and run a command to start up the environment, locally. Then I can start working. It’s super easy and you don’t need to know how every piece of the stack works to work only on the frontend or one of the other libraries inside the monorepo. This improves the development experience greatly and it’s already paying off!

### CI/CD

By having the possibility to restore predefined blockchain seeds, we are able to start each E2E test with the data we need in the system. Everything run through Docker and custom volumes through Github Actions:

![Untitled](Potion%20V2%20Write%20Up/Untitled%203.png)

There’s way more than this!

- ESLint and Prettier will run automatically on git staged files, this way you don’t push unformatted code
- GitHub will lint, format and run tests when a PR is opened against develop, main or release branches
- When a PR is opened against the release branch, GitHub will automatically generate a changelog and set versioning based on SemVer

## Conclusions

This was a brief overview of our work after the release of the Potion Protocol to the public. Other than the rework of the app, we are providing a very professional set of automations and tools configured ad hoc to be used by public contributors. E2E testing means that we will be able to build and refactor by knowing that we are not introducing bugs in the code, and we might be the first mad lads doing this with the whole stack (blockchain, subgraph, and frontend app).