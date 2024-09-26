// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const config = require('../src/config.json')

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

async function main() {
  console.log(`Fetching accounts & network...\n`)

  const accounts = await ethers.getSigners()
  const deployer = accounts[0]
  const minter1 = accounts[1]
  const minter2 = accounts[2]

  let transaction

  // Fetch network
  const { chainId } = await ethers.provider.getNetwork()

  // Fetch deployed nft
  const nft = await ethers.getContractAt('NFT', config[chainId].nft.address)
  console.log(`NFT fetched: ${nft.address}\n`)

  // Add to whitelist the first mitner
  transaction = await nft.addToWhitelist(minter1.address)
  await transaction.wait()

  console.log(`Finished.\n`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
