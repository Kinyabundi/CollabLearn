import { useWeb3Context } from "@/context/Web3Provider";
import { LiveblocksProvider } from "@liveblocks/react";
import { ReactNode } from "react";

interface LiveblockProviderProps {
	children: ReactNode;
}

const LiveblockProvider = ({ children }: LiveblockProviderProps) => {
	const {
		state: { address },
	} = useWeb3Context();

	return (
		<LiveblocksProvider
			authEndpoint={async () => {
				const response = await fetch("http://localhost:4411/liveblocks/auth", {
					method: "POST",
					body: JSON.stringify({ walletAddress: address }),
					headers: {
						"Content-Type": "application/json",
					},
				});
				if (!response.ok) {
					throw new Error("Failed to authenticate");
				}
				const data = await response.json();

				return data;
			}}
			resolveUsers={async ({ userIds }) => {
        console.log("userIds", userIds);
				const response = await fetch("http://localhost:4411/liveblocks/users", {
					method: "POST",
					body: JSON.stringify({ userIds }),
					headers: {
						"Content-Type": "application/json",
					},
				});
				if (!response.ok) {
					throw new Error("Failed to resolve users");
				}
				const data = await response.json();
				return data;
			}}>
			{children}
		</LiveblocksProvider>
	);
};

export default LiveblockProvider;
