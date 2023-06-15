/*
  Handler function to attempt to mint an NFT from the collection
*/

// Define the interface for the transaction data to return
interface TxData {
  hash?: string
  tokenId?: number
}

// Define the function to request the minting of an NFT
export async function requestMintNFT(address, contract, provider) {
  try {
    const [name, balance, gas, gasPrice] = await Promise.all([
      contract.methods.name().call(),
      provider.getBalance(address),
      contract.methods.safeMint(address).estimateGas({ from: address }),
      provider.getGasPrice(),
    ])

    // Calculate the estimated transaction cost based on gas and gas price
    const transactionCost = gasPrice.mul(gas)

    // If the balance is less than the transaction cost, display an alert and return
    if (balance.lt(transactionCost)) {
      alert("Insufficient funds to cover the gas fee")
      return
    }

    // Send the minting transaction and listen for the transaction hash
    const receipt = await contract.methods
      .safeMint(address)
      .send({
        from: address,
        gas,
      })
      .on("transactionHash", (hash) => {})

    // Retrieve the minted tokenId from the transaction receipt events
    const tokenId = receipt?.events?.Transfer?.returnValues?.tokenId

    // Create the transaction data object with the transaction hash and tokenId
    const txData: TxData = {
      hash: receipt.transactionHash,
      tokenId,
    }

    // Return the transaction data
    return txData
  } catch (error) {
    console.error(error)
    return false
  }
}
