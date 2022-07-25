import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as ballotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
// eslint-disable-next-line node/no-missing-import
import { CustomBallot } from "../typechain";


async function main() {
    if (process.argv.length < 2) throw new Error("No contract address specified.");
    const ballotAddress = process.argv[2];

    if (process.argv.length < 3) throw new Error("No proposal index specified.");
    let index = process.argv[3];


    const provider = new ethers.providers.AlchemyProvider('rinkeby', process.env.API_KEY);

    const ballotContract : CustomBallot = new Contract(
        ballotAddress,
        ballotJson.abi,
        provider
    ) as CustomBallot;


    const proposal = await ballotContract.proposals(index);
    console.log(`The proposal "${ethers.utils.parseBytes32String(proposal.name)}" with index ${index} has ${proposal.voteCount} votes.`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });