/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async () => {
	const { ethereum } = window as any;
	const provider = ethereum;

	if (provider) {
		try {
			await provider.request({
				method: 'wallet_addEthereumChain',
				params: [
					{
						chainId: `0x${Number(80001).toString(16)}`,
						chainName: 'Polygon Testnet',
						nativeCurrency: {
							name: 'MATIC',
							symbol: 'MATIC',
							decimals: 18,
							iconUrls: [`https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png`],
						},
						rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
						blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
					},
				],
			});
			return true;
		} catch (error) {
			console.error('Failed to setup the network in Metamask:', error);
			return false;
		}
	} else {
		console.error("Can't setup the BSC network on metamask because window.ethereum is undefined");
		return false;
	}
};
