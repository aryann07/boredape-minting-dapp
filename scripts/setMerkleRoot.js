/**
 *   This script will calculate the merkle root from the whitelist array and set it to the contract
 *   using the `setMerkleRoot` function defined in BoredApe.sol contract. For this script to work your contract
 *   already should be deployed and you should have the deployed contract address. If you make a change in whitelist.js
 *   make sure you update the merkleroot in the contract using the script `scripts/setMerkleRoot.js`
 */

const hre = require('hardhat')
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const whitelist = require('./whitelist.js')

async function main() {
  const nftFactory = await hre.ethers.getContractFactory('BoredApe')
  const nftContract = await nftFactory.attach(
    '0x7Ba33aB7a5Db16BfBb97f8866cb555135D813b7d' // Deployed contract address
  )

  // Re-calculate merkle root from the whitelist array.
  const leafNodes = whitelist.map((addr) => keccak256(addr))
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
  const root = merkleTree.getRoot()

  // Set the re-calculated merkle root to the contract.
  await nftContract.setMerkleRoot(root)

  console.log('Whitelist root set to:', root)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
