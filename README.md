# 🧙‍♂️ SpellForge

**SpellForge** is a turn-based, 2-player wizard dueling game where players battle using NFT spell cards. Defeat your opponent to win Shards, but beware – losing means sacrificing a spell from your collection. Use Shards to forge powerful new spells and climb the ranks in this strategic, high-stakes magical showdown.

Built using Stackr's SDK, NextJS, Web3Auth, Wagmi and Viem.

## 🧐 How Does It Work?

SpellForge is an exciting turn-based wizard dueling game that combines strategy, collection, and blockchain technology. In this 2-player game, wizards face off using their unique collection of spell cards, represented as NFTs.
Key Features:

-   **Spell Battles:** Use a variety of spell types including Attack, Defense, Healing, and Illusion to outsmart and defeat your opponent.
-   **High-Stakes Gameplay:** The loser of each match forfeits a random spell from their collection, adding tension to every duel.
-   **Shard Rewards:** Winners earn Shards (ERC-20 tokens), with the amount varying based on match difficulty.
-   **Spell Forging:** Use Shards to create new, powerful spells. The more Shards used, the more potent the spell.
-   **Trading System:** Trade Shards with other players to boost your forging capabilities.
-   **Limited Collection:** Players can hold a maximum of 5 spells, encouraging strategic choices in spell selection and forging.
-   **New Player Onboarding:** Upon account creation, new wizards choose 2 out of 3 presented spells to start their journey.

SpellForge offers a unique blend of tactical gameplay, resource management, and the thrill of collecting and forging powerful spells. Every decision matters, from spell selection in battle to managing your Shard economy.

## </> Tech Stack

-   Stackr's SDK
-   Next JS
-   Websockets (socket.io)
-   PostreSQL with Prisma
-   Web3Auth
-   Wagmi
-   Viem
-   Tailwind CSS

## Requirements

-   [Bun](https://bun.sh) - we leverage Bun's bundler to build our micro-rollups.
-   [Node (LTS)](https://nodejs.org/en/download/)
-   [Git](https://git-scm.com/downloads)

## Get Started

To quickly get started, you can clone this repository and follow the steps below:

1. Clone the repository

```bash
git clone https://github.com/rahulbarmann/SpellForge.git
```

2. Initialize the project by running the setup script

```bash
cd  SpellForge
./setup.sh
```

3. Run the project with `mprocs`

```bash
bun  dev
```

This sets up the micro-rollup and the web app to run concurrently. You can now visit `http://localhost:3000` to see the web app in action and interact with the rollup by sending actions.

By default

Rollup runs on port `3210`

Web App runs on port `3000`
