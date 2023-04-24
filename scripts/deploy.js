const { ethers } = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  // Setting up accounts & variables
  const [deployer] = await ethers.getSigners()
  const NAME = "DecentChat"
  const SYMBOL = "DC"

  // Deploying the Contract
  const DecentChat = await ethers.getContractFactory("DecentChat")
  const decentchat = await DecentChat.deploy(NAME, SYMBOL)
  await decentchat.deployed()
  console.log(`Deployed DecentChat Contract at : ${decentchat.address}\n`)

  // Creating 3 channels
  const CHANNEL_NAMES = ["general", "intro", "chill"]
  const COSTS = [tokens(1), tokens(0), tokens(0.25)]
  for (var i = 0; i < 3; i++) {
    const transaction = await decentchat.connect(deployer).createChannel(CHANNEL_NAMES[i], COSTS[i])
    await transaction.wait()
    console.log(`Created text channel #${CHANNEL_NAMES[i]}`)
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});