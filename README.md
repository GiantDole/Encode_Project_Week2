# Group 2
## Encode Solidity Bootcamp Week 2 Project
These keys are compromised. This was done intentionally to allow our team to test the project with short setup time. :)
### Initialize the project
<pre><code>cd Project
yarn install
yarn hardhat compile
</code></pre>

### Instructions:
* Structure scripts to
  * Deploy everything :white_check_mark:
  * Interact with the ballot factory
  * Query proposals for each ballot
  * Operate scripts
* Publish the project in Github
* Run the scripts with a few set of proposals, play around with token balances, cast and delegate votes, create ballots from snapshots, interact with the ballots and inspect results
* Write a report detailing the addresses, transaction hashes, description of the operation script being executed and console output from script execution for each step

## Commands:

### Deploy contracts:

This script will first deploy a token contract, mint some tokens, and then use that contract as input to deploying the ballot contract. Substitute the [] with proposal names!
<pre><code>yarn run ts-node --files ./scripts/deploy.ts [No1] [No2] [No3]
</code></pre>

### Mint tokens:

### Vote:

### Delegate:

### Determine winner: