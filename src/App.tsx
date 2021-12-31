import React from 'react';
import {Button, Container, Heading, Text, VStack} from "@chakra-ui/react";
import {animated, useSpring} from "react-spring";
import Moralis from 'moralis';

function App() {
	const styles = useSpring({
		loop: true,
		from: {rotateZ: 0},
		to: {rotateZ: 360}
	})

	console.log(Moralis.applicationId);

	return (
		<Container mt={'40'}>
			<VStack>
				<animated.div style={{...styles}}>
					<Text fontSize={'3xl'}>🤠</Text>
				</animated.div>
				<Heading>👋 Hey there!</Heading>
				<Text textAlign={'center'}>I'm Lucas, one of the luxy.io builders :) <br/>Wave at me please :(</Text>
				<Button w={'100%'}>Wave</Button>
			</VStack>
		</Container>
	);
}

export default App;
