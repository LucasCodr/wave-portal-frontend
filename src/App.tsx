import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import {
	Button,
	Container,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	Heading,
	Input,
	Text,
	Tooltip,
	VStack
} from "@chakra-ui/react";
import { animated, useSpring } from "react-spring";
import WavePortalAbi from './abi/WavePortal.abi.json';
import { useWave } from './services/waveContract';
import { useReadContract } from './services/readContract.';
import { queryClient } from './Providers';
import { ethers } from 'ethers';
import { setupNetwork } from './utils/wallet';

function App() {

	const [currentAccount, setCurrentAccount] = useState();
	const [message, setMessage] = useState('');

	const contractAddress = "0xc423CBc51733CC668CB48bee2990F3Cd7786982F";

	const checkIfWalletIsConnected = useCallback(async () => {
		const { ethereum } = window as any

		if (!ethereum)
			alert('Make sure you have MetaMask!')

		const accounts = await ethereum.request({ method: 'eth_accounts' })

		if (accounts.length) {
			const account = accounts[0];
			console.log("Found an authorized account: ", account)
			setCurrentAccount(account)
		} else {
			console.log("No authorized account found")
		}
	}, [])

	const connectWallet = useCallback(async () => {
		try {
			const { ethereum } = window as any;

			if (!ethereum) {
				alert('Get metamask!')
				return;
			}

			const chain = await ethereum.request({ method: 'eth_chainId' })

			console.log(chain);

			const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

			console.log("Connected", accounts[0])
		} catch (e) {
			console.log(e)
		}
	}, [])

	const wave = useWave();

	const [getTotalWaves, getAllWaves] = useReadContract(
		contractAddress,
		WavePortalAbi as any,
		['getTotalWaves', 'getAllWaves']
	)

	const handleWave = useCallback(async (e: FormEvent) => {
		e.preventDefault();

		if (!currentAccount) {
			await connectWallet();
		}

		const { ethereum } = window as any;

		const provider = new ethers.providers.Web3Provider(ethereum);

		const network = await provider.getNetwork();

		if (network.chainId !== 80001) {
			await setupNetwork();
		}

		await wave.mutateAsync(message, {
			onSuccess: async () => {
				await queryClient.invalidateQueries('getTotalWaves')
				await queryClient.invalidateQueries('getAllWaves')
			}
		});

	}, [currentAccount, wave, connectWallet, message])

	useEffect(() => {
		checkIfWalletIsConnected();
	}, [checkIfWalletIsConnected])

	console.log(wave.error);

	const styles = useSpring({
		loop: true,
		from: { rotateZ: 0 },
		to: { rotateZ: 360 },
		config: {
			velocity: 0.01
		}
	});

	return (
		<Container mt={'40'}>
			<VStack>
				<animated.div style={{ ...styles }}>
					<Text fontSize={'3xl'}>🤠</Text>
				</animated.div>
				<Heading>👋 Hey there!</Heading>

				<Text textAlign={'center'}>I'm Lucas, one of the luxy.io builders :) <br />Wave at me please :(</Text>

				<VStack as='form' onSubmit={handleWave} w='100%'>
					<FormControl isInvalid={wave.isError}>
						<FormLabel htmlFor='message'>Message</FormLabel>
						<Input type='text' id='message' required onChange={(e) => setMessage(e.currentTarget.value)} />
						<FormErrorMessage>Error! Try again.</FormErrorMessage>
						<FormHelperText>Send me a cool message 😘😍</FormHelperText>
					</FormControl>
					<Button w={'100%'} isLoading={wave.isLoading} type='submit'>Wave</Button>
				</VStack>

				<Text>Total waves: {getTotalWaves.data?.toString()}</Text>
				{
					getAllWaves.data?.map(([address, message, timestamp]: any[]) => (
						<VStack key={timestamp * 1000} w='100%'>
							<VStack w='100%' alignItems={'start'} borderRadius={'5px'} border={'1px solid #efefef'} p='5'>
								<Tooltip label={address} hasArrow placement='right'>
									<Text fontWeight={'semibold'}>
										User address: {address.substr(0, 4)}...{address.substr(-6)}
									</Text>
								</Tooltip>

								<Text>{message}</Text>

								<Text alignSelf={'flex-end'}>
									{new Intl.DateTimeFormat(
										'en-US',
										{ dateStyle: 'short', timeStyle: 'medium' }
									)
										.format(new Date(timestamp * 1000))}
								</Text>
							</VStack>
						</VStack>
					))
				}
			</VStack>
		</Container>
	);
}

export default App;
