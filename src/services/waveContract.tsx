import { useMutation } from "react-query";
import { ethers, Contract } from 'ethers';
import WavePortalAbi from '../abi/WavePortal.abi.json';

const contractAddress = "0xc423CBc51733CC668CB48bee2990F3Cd7786982F";

export function useWave() {
	return useMutation<void, any, string, any>(
		async (message: string) => {
			const { ethereum } = window as any;

			if (!ethereum) throw new Error('Ethereum provider not found!');

			const provider = new ethers.providers.Web3Provider(ethereum);

			const signer = provider.getSigner();

			const wavePortalContract = new Contract(contractAddress, WavePortalAbi as any, signer);

			const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 });

			await waveTxn.wait();
		},
	)
}
