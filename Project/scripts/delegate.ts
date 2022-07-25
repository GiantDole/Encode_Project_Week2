import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as tokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
// eslint-disable-next-line node/no-missing-import
import { MyToken } from "../typechain";

const EXPOSED_KEY =
    "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

async function main() {
    if (process.argv.length < 2) throw new Error("No token contract address specified.");
    const tokenAddress = process.argv[2];

    if (process.argv.length < 3) throw new Error("No wallet delegatee specified.");
    let walletDelegatee = process.argv[3];    

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

    const tokenContract : MyToken = new Contract(
        tokenAddress,
        tokenJson.abi,
        signer
    ) as MyToken;

    const preMintVotePower = await tokenContract.getVotes(
        walletDelegatee
      );    
    console.log(`Vote power before delegate: ${Number(ethers.utils.formatEther(preMintVotePower))}`);
    const delegateTx = await tokenContract.delegate(walletDelegatee);   
    console.log("Awaiting confirmation..."); 
    await delegateTx.wait();
    console.log(`Successfully delegated voting power to ${walletDelegatee}`);
    const postMintVotePower = await tokenContract.getVotes(
        walletDelegatee
      );
    console.log(`Vote power after delegate: ${Number(ethers.utils.formatEther(postMintVotePower))}`);
    console.log(`Transaction Hash: ${delegateTx.hash}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });