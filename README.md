# FABRIC Synthetics Web dApp

[![Netlify Status](https://api.netlify.com/api/v1/badges/47018a0f-c1e9-4e57-b931-55293be48516/deploy-status)](https://app.netlify.com/sites/eloquent-montalcini-abe9c5/deploys)

## How to use

Download the example [or clone the repo](https://github.com/fabric-foundation/synths-dapp):

Install it and run:

```sh
npm install
npm start
```

# Done
- [x] ZAP: Create copy for home page for ZAP
- [x] Update assets created on notion page
- [x] Synths: Update liquidator wrt latest SDK changes 
- [x] Synths: Set up liquidator for mainnet and devnet to run 
- [x] Synths: Update all scripts to new Anchor version syntax
- [x] Prepare mainnet launch announcement teaser
- [x] Synths: Update SDK for support for mainnet
- [x] Prepare initial synths announcement
- [x] Synths: Update init contract method with oracle type
- [x] Synths: Prepare mainnet deployment script
- [x] Synths: Add error parser 
- [x] Synths: Hide faucet icon if network is mainnet
- [x] Reached out to Orca and Pyth to let them know we're going live with Switchboard with the intention to switch to a Pyth feed ASAP
- [x] Synths: Add APR/APY
- [x] Synths: Publish latest SDK version
- [x] Synths: Update dapp to use latest SDK version
- [x] Synths: Load dapp network from ENV variable
- [x] Synths: Check ENVs are set up correctly
- [x] Synths: Set up production dapp
- [x] Synths: Deploy program to mainnet
- [x] Synths: Update SDK with mainnet program id
- [x] Synths: Update SDK with FAB mint for mainnet
- [x] Synths: Publish new SDK version
- [x] Synths: Triple check migration script
- [x] Synths: Run migration script
- [x] Synths: Post 1 hour notice tweet
- [x] Synths: Set up production dapp DNS record for domain
- [x] Synths: Update production dapp with latest SDK
- [x] Synths: Test production dapp
- [x] Synths: Update DAO links
- [x] Synths: Fix incorrect mint decimals bug in contract
- [x] Synths: Fix incorrect calculation in amount withdrawing debt wise
- [x] Synths: Fix bug where decimals are not being shown correctly in swap panel
- [x] Synths: Mainnet launch announcement
- [x] Update optimal c ratio to minimum c ratio
- [x] Add mainnet synthetics to SPL token list
- [x] Request egg to create a walkthrough video
- [x] Prepare documentation to accompany mainnet launch announcement
- [x] Set up claimer script for mainnet

- [x] Synths: Fix incorrect APR/APY
- [x] Create script to load user data
- [x] Create script to update all users
- [x] Synths: Investigate bug with next epoch rewards appearing in dapp
- [x] Investigate bug with Bambams account 
- [x] Synths: Add logging to liquidator ix
- [x] Synths: Update SDK
- [x] Synths: Reenable oracle price feed staleness validation
- [x] Synths: Publish new SDK version
- [x] Synths: Update dapp with new SDK version and publish
- [x] Synths: Fix bug where new accounts cant swap fUSD if they already have it 
- [x] Synths: Disable burn button if debt is 0
- [x] Synths: Set up liqudiator for mainnet
- [x] Synths: Fix phantom mobile support
- [x] Twitter post for total TVL 
- [x] Synths: Update menu so tooltip appears displaying link name
- [x] Synths: Fix UI issue where text was not spaced correctly under tokens deposited
- [x] Synths: Fix tooltip appearing over wallet dialog
- [x] Synths: Fix ability to enter negative values
- [x] Synths: Add preview for c ratio change in mint/burn panel
- [x] Create basic discord bot to show each synths market cap/supply
- [x] Create basic discord bot to show collateral staked
- [~] Synths: Fix liquidator script
- [x] Update documentation with updated images
- [x] Fix discord bots not showing TVL for FAB and supply for fJPY
- [x] Twitter announcement for SPY and QQQ proposal
- [x] Synths: Fix error with incorrect rewards due to mint decimals mismatch
- [x] Synths: Resolve all accounts that claimed 10% rewards only
- [x] Discuss with Marc from Pyth re: how to handle oracles when they are out of trading hours (like SPY)
- [x] Reach out to Siong about Jupiter integration -> confirmed, will be added to backlog
- [x] Speak to Raydium about multiple venues
- [x] Research on how to restore fUSD price if below peg
- [x] Created v2 liquidator
- [x] Synths: Fix liquidator script
- [x] Posted new fUSD pool coming  

- [x] Create CLI tool for protocol
- [x] Prepare and post new pool launch announcement 
- [x] Investigate and manually claimed rewards for users - not all the txs by the claimer didnt go through, will add retry logic in
- [x] Synths: Prepare mainnet launch medium post
- [x] Synths: Create documentation for debt shares 
- [x] Synths: Fix claimer script
- [x] Zap: Update order of menu to match design
- [x] Discuss with pyth re: technical implementation of failover when oracles dont update
- [x] Publish mainnet article
- [x] Zap: Fix documentation link

- [x] Prepare proposal three passing
- [x] Chase verts for icons
- [x] Work on how to track volume data for the protocol
- [x] Complete coingecko application for fUSD listing
- [x] Create proposal to reduce fees

# In Progress
- [x] Synths: Fix bug where claimable rewards do not update correctly at the end of an epoch 
- [x] Synths: Reorder claimable and withdrawable tokens
- [x] Synths: Fix bug with fJPY price not correct
- [x] Create basic discord bot to show current epoch slots remaining and ETA
- [x] Synths: Working on logic update to liquidate ix

# Fucking do it
- [~] Create documentation glossary 
- [ ] Upgrade royalties distribution to include fUSD also

- [ ] Synths: Fix bug where a new user cannot deposit FAB 
- [ ] Synths: Fix bug where fEUR to fUSD price tag switches to 1 -> 1
- [ ] Synths: Fix bug where c ratio decreases when burning 
- [ ] Update documentation ƒor SDK
- [ ] Synths: Add real fee based on synths to swap
- [ ] Synths: Add c ratio change in deposit
- [ ] Synths: Update SDK to show price, price impact and fee
- [ ] Synths: Fix bug where balances dont update
- [ ] Synths: Fix bug where "able to mint" amount does not update after 1st mint
- [ ] Synths: Fix bug where debt overview panel doesnt update after 1st mint
- [ ] Synths: Update max withdrawable based on c ratio
- [ ] Synths: Add realtime support to prices
- [ ] Synths v2: Support for longing and shorting synths

- [ ] Move liquidator to standalone repo
- [ ] Prepare liquidator release annoucement
- [ ] Update documentation ƒor liquidator
- [ ] Prepare Zap SDK release annoucement
- [ ] Update documentation images for Zap and Synths

- [ ] Set up Discourse forum
- [ ] Staking: Cap input to 0
- [ ] Core: Migrate API to standalone service -> https://vercel.com/docs/runtimes

## Medium
- [~] Working on copy for social media assets list shared with Vivid
- [ ] Update Tribeca UI messages
- [ ] Update price feeder script to use Logger class
- [ ] Draft designs for trader focused platform

## Low
- [ ] Synths: Update all errors to new error macro
- [ ] Synths: Add RPC switcher to dapp
- [ ] Staking: Add zap to pools
- [ ] Draft DAO social post - maybe medium?
- [ ] ZAP: Add Saber support
- [ ] ZAP: Update SDK readme
- [ ] ZAP: Style wallet connector
- [ ] Synths: Debug why accounts holding fresh fUSD (no protocol account) can't swap on the protocol
- [ ] Add tokeneconomics page to documentation space with chart
- [ ] ZAP: Add LP panels
- [ ] Staking: Begin rewrite of staking contract

# To do
- [ ] Synths: Plan approach to new dapp
- [ ] Synths: Look into compounding - claiming and staking of rewards
- [ ] Synths: Look into multi lockup periods with boosted yield
- [ ] Staking: Begin UI rehaul
- [ ] Staking: Look into adding ZAP
- [ ] Staking: Look into multi lockup periods with boosted yield

- [ ] Create CLI to manage protocol
- [ ] ZAP: Create slippage component
- [ ] ZAP: Create slippage settings button on swap modal header 
- [ ] ZAP: Create modal dialog 
- [ ] ZAP: Add icons based on route info
- [ ] ZAP: Update SDK obfuscation if possible 
- [ ] ZAP: Create token picker 
    - [ ] ZAP: Add balances for all tokens and order by balance and then alphabetically
        1. Get token accounts for owner (getTokenAccountsByOwner - https://spl.solana.com/token)
        2. Map token accounts to all mints, set mint not found balance to 0
- [~] ZAP: Fix storybook
- [~] ZAP: Support for SOL - create example of failed swap for jupiter team
- [~] ZAP: Support for SOL - speaking with JUP
- [ ] Synths: Create Sonar adapter

# Non-urgent
- [ ] Update litepaper
- [ ] Update liquidator
    - [ ] Abstract logic to check if user is liquidatable to SDK method
    - [ ] Abstract logic to check how much and what asset can be liquidated to SDK 
- [ ] Synths: Create documentation pages:
    - [ ] Supported collateral and synthetics 
    - [ ] Protocol configuration and deployment address
    - [ ] Whats a synthetic, how does it track the underlying price, why should I trade it?
    - [ ] Process overview: Staking
    - [ ] Process overview: Minting and burning
    - [ ] Process overview: Swapping
    - [ ] Process overview: Liquidation
    - [ ] Process overview: Rewards
    - [ ] SDK - how to use
    - [ ] Bug bounty program
    - [ ] Development bounty program
    - [ ] DAO control
    - [ ] Fees
- [ ] Implement swap fee discount for FAB holders
    https://github.com/Synthetify/synthetify-protocol/blob/b9233659f25e5922cf79343eb75eb3f76f860cd8/programs/exchange/src/lib.rs#L539
- [ ] Jot some notes on apys/prices/tvl
- [ ] Create rewards UI in component kit
- [ ] Review account documentation
- [ ] Introduce a per-user USD cap on collateral

# Backlog
- [ ] Create price info widget in component kit
- [ ] Create price info panel in component kit
- [ ] Create balances table in component kit
- [ ] Create risk component in component kit
- [ ] Create balances overview in component kit
- [ ] Draft bountry program - see Drift bounty program
- [ ] Add tests for invalid oracle data
    - [ ] Less than 3 quoters
    - [ ] Has stale price
    - [ ] Has negative price
    - [ ] Has conf > 20% of price
    - [ ] Has price > 50% from TWAP
- [ ] Expand rust tests
- [~] Work on v2 protocol, support for expiratory synthetics
- [~] Work plan for new dev, plan for additional devs
    - [x] Review list of tasks/projects
        - [ ] Web dev
            - [ ] Synthetics dapp
                - [ ] Split SDK into normal and admin SDK
                - [ ] Add test to liquidation tests to liquidate two collaterals
                - [ ] Add test for swap fee wrt debt shares
                - [ ] Add test for change in user and global debt shares when swapping
                - [ ] Add test for burning all fUSD with bad c ratio
            - [ ] Analytics page
            - [ ] Admin dashboard
                - [ ] Staking pools info
                - [ ] Synths info
                - [ ] Repeated tasks for the day
                - [ ] Monitor for crankers
                - [ ] Pool management
                - [ ] Synths management
            - [ ] Staking dapp
                - [ ] Fix staking page success modal on mobile (phantom)
        - [ ] Rust dev
            - [ ] Rewrite staking contract
            - [ ] Add switchboard support
        - [ ] TS/JS dev
            - [ ] Rewrite JS functions API to TS standalone API
            - [ ] Create SDK for staking contract
            - [ ] Add SDK method to get collateral balance for a single token
            - [ ] Add SDK method to get mintable amount per synthetics
            - [ ] Fix APY not generating for staking
        - [ ] DevOps
            - [ ] Migrate dapp to vercel
            - [ ] Grafana dashboard
                - [ ] Price
                - [ ] Staking pool TVL
                - [ ] APY
                - [ ] Number of stakers

# Ideas
- [x] Cranker
- [x] Access control modifiers
- [ ] Zero copy + loader
- [ ] CPI - transfer, mint, burn
- [ ] Instruction macro
- [ ] Migration scripts
- [ ] Getting started
- [ ] Upgrading contracts
- [ ] Expand anchor code
- [ ] Program id
- [ ] Flip game example 
- [ ] Staking example 