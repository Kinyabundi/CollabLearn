const useAuthLiveblocks = () => {
	const authenticate = async (walletAddress: string) => {
		const response = await fetch("http://localhost:4411/liveblocks/auth", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ walletAddress }),
		});

		if (!response.ok) {
			throw new Error("Failed to authenticate");
		}

		const data = await response.json();
		return data;
	};

	return {
		authenticate,
	};
};

export default useAuthLiveblocks;
