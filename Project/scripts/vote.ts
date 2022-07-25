import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as ballotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
// eslint-disable-next-line node/no-missing-import
import { CustomBallot } from "../typechain";

const EXPOSED_KEY =
    "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

async function main() {
    if (process.argv.length < 2) throw new Error("No ballot contract address specified.");
    const ballotAddress = process.argv[2];

    if (process.argv.length < 3) throw new Error("No proposal index specified.");
    let proposalIndex = process.argv[3];

    if (process.argv.length < 4) throw new Error("No vote amount specified.");
    let voteAmount = ethers.BigNumber.from(process.argv[4]);

    const provider = new ethers.providers.AlchemyProvider('rinkeby', process.env.API_KEY);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);
    console.log(`Using address ${wallet.address}`);
    const signer = wallet.connect(provider);
    const balanceBN = await signer.getBalance();
    const balance = Number(ethers.utils.formatEther(balanceBN));
    console.log(`Wallet balance ${balance}`);
    if (balance < 0.01) {
        throw new Error("Not enough ether");
    }   

    const ballotContract : CustomBallot = new Contract(
        ballotAddress,
        ballotJson.abi,
        signer
    ) as CustomBallot;

    const votingPower = await ballotContract.votingPower();
    if (votingPower < voteAmount) throw new Error(`You only have ${votingPower} votes left while specifying ${voteAmount} votes!`)

    
    const proposal = await ballotContract.proposals(proposalIndex);        
    const voteTx = await ballotContract.vote(proposalIndex, Number(voteAmount));
    console.log("Awaiting voting confirmation..."); 
    await voteTx.wait();
    console.log(`Successfully vote to "${ethers.utils.parseBytes32String(proposal.name)}" with ${voteAmount} votes`);    
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });