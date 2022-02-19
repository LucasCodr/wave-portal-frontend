import { useQueries } from "react-query";
import { ethers, Contract } from 'ethers';

async function fetchContractData(contractAddress: string, abi: string, method: string) {
	const { ethereum } = window as any;

	if (!ethereum) throw new Error('Ethereum provider not found!');

	const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/');

	const contract = new Contract(contractAddress, abi, provider);

	const data = await contract[method]();

	return data;
}

export function useReadContract(contractAddress: string, abi: string, readMethods: string[]) {
	return useQueries(
		readMethods.map(method => ({
			queryKey: method,
			queryFn: () => fetchContractData(contractAddress, abi, method)
		}))
	)
}
