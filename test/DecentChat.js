const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
  // 1.000000000000000000 Ether = 1000000000000000000 Wei
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

    // Creating Channel
    const transaction = await decentchat.connect(deployer).createChannel("general", tokens(1))
    await transaction.wait()
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

  describe("Creating Channels", () => {
    it("Returns total channels", async () => {
      const result = await decentchat.totalChannels()
      expect(result).to.be.equal(1)
    })

    it("Returns channel attributes", async () => {
      const channel = await decentchat.getChannel(1)
      expect(channel.id).to.be.equal(1)
      expect(channel.name).to.be.equal("general")
      expect(channel.cost).to.be.equal(tokens(1))
    })
  })

  describe("Joining Channels", () => {
    const ID = 1
    const AMOUNT = ethers.utils.parseUnits("1", "ether")

    beforeEach(async () => {
      const transaction = await decentchat.connect(user).mint(ID, { value: AMOUNT })
      await transaction.wait()
    })

    it("User joins", async () => {
      const result = await decentchat.hasJoined(ID, user.address)
      expect(result).to.be.equal(true)
    })

    it("Increasing the total supply", async () => {
      const result = await decentchat.totalSupply()
      expect(result).to.be.equal(ID)
    })

    it("Updating the contract balance", async () => {
      const result = await ethers.provider.getBalance(decentchat.address)
      expect(result).to.be.equal(AMOUNT)
    })
  })

  describe("Withdrawing", () => {
    const ID = 1
    const AMOUNT = ethers.utils.parseUnits("10", "ether")
    let balanceBefore

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address)

      let transaction = await decentchat.connect(user).mint(ID, { value: AMOUNT })
      await transaction.wait()

      transaction = await decentchat.connect(deployer).withdraw()
      await transaction.wait()
    })

    it("Updating the owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    it("Updating the contract balance", async () => {
      const result = await ethers.provider.getBalance(decentchat.address)
      expect(result).to.equal(0)
    })
  })
})