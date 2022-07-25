import { ethers } from "ethers";
import "dotenv/config";
import * as ballotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import * as tokenJson from "../artifacts/contracts/Token.sol/MyToken.json";

const EXPOSED_KEY =
    "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}

function setupProvider() {
    const infuraOptions = process.env.INFURA_API_KEY
        ? process.env.INFURA_API_SECRET
            ? {
                projectId: process.env.INFURA_API_KEY,
                projectSecret: process.env.INFURA_API_SECRET,
            }
            : process.env.INFURA_API_KEY
        : "";
    const options = {
        alchemy: process.env.ALCHEMY_API_KEY,
        infura: infuraOptions,
    };
    const provider = ethers.providers.getDefaultProvider("rinkeby", options);
    return provider;
}

async function main() {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);
    console.log(`Using address ${wallet.address}`);
    const provider = setupProvider();
    const signer = wallet.connect(provider);
    const balanceBN = await signer.getBalance();
    const balance = Number(ethers.utils.formatEther(balanceBN));
    console.log(`Wallet balance ${balance}`);
    if (balance < 0.01) {
        throw new Error("Not enough ether");
    }

    const proposals = process.argv.slice(2);
    if (proposals.length < 2) throw new Error("Not enough proposals provided");
    proposals.forEach((element, index) => {
        console.log(`Proposal N. ${index + 1}: ${element}`);
    });


    // No need to reploy token once already deployed

    // console.log("Deploying Token contract");
    // const tokenFactory = new ethers.ContractFactory(
    //     tokenJson.abi,
    //     tokenJson.bytecode,
    //     signer
    // );
    // const tokenContract = await tokenFactory.deploy();
    // await tokenContract.deployed();
    // console.log("Success: Deployed token contract");
    // console.log(`Token contract deployed at ${tokenContract.address}`);
    // console.log("Minting some tokens...");
    // const mintTx = await tokenContract.mint(wallet.address, 100);
    // await mintTx.wait();
    // console.log("Successfully minted 100 tokens");

    console.log("Deploying Ballot contract");
    const ballotFactory = new ethers.ContractFactory(
        ballotJson.abi,
        ballotJson.bytecode,
        signer
    );
    const ballotContract = await ballotFactory.deploy(
        convertStringArrayToBytes32(proposals),
        "0xCC3Be7FD561127ECD540A69572ba33Bcb6392760" // Token adress
    );
    console.log("Awaiting confirmations");
    await ballotContract.deployed();
    console.log("Completed");
    console.log(`Ballot contract deployed at ${ballotContract.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});