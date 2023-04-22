const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("DecentChat", function () {
  let deployer, user
  let decentchat

  const NAME = "DecentChat"
  const SYMBOL = "DC"

  beforeEach(async () => {
    // Account setup
    [deployer, user] = await ethers.getSigners()

    // Deploying Contract
    const DecentChat = await ethers.getContractFactory("DecentChat")
    decentchat = await DecentChat.deploy(NAME, SYMBOL)
  })

  describe("Deployment", function () {
    it("Sets the name", async () => {
      // Fetching name
      let result = await decentchat.name()
      // Checking name
      expect(result).to.equal(NAME)
    })

    it("Sets the symbol", async () => {
      // Fetching symbol
      let result = await decentchat.symbol()
      // Checking symbol
      expect(result).to.equal(SYMBOL)
    })

    it("Sets the owner", async () => {
      const result = await decentchat.owner()
      expect(result).to.equal(deployer.address)
    })
  })
})