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

    if (process.argv.length < 3) throw new Error("No wallet to mint tokens specified.");
    let addressToMint = process.argv[3];

    if (process.argv.length < 4) throw new Error("No tokens to mint specified.");
    let tokensToMint = process.argv[4];

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


    const mintTx = await tokenContract.mint(addressToMint, tokensToMint);   
    console.log("Awaiting confirmation..."); 
    await mintTx.wait();
    console.log(`Successfully minted ${tokensToMint} tokens to ${addressToMint}`);
    console.log(`Transaction Hash: ${mintTx.hash}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });