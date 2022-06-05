import { useQueries } from "react-query";
import { ethers, Contract } from 'ethers';

async function fetchContractData(contractAddress: string, abi: string, method: string) {
	const provider = new ethers.providers.JsonRpcProvider('https://matic-mumbai.chainstacklabs.com/');

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
