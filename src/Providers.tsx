import { ChakraProvider } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider, setLogger } from "react-query";

export const queryClient = new QueryClient();

setLogger({
	log: () => { },
	warn: () => { },
	error: () => { },
});

const Providers: React.FC = ({ children }) => (
	<QueryClientProvider client={queryClient}>
		<ChakraProvider>
			{children}
		</ChakraProvider>
	</QueryClientProvider>
)

export default Providers;
