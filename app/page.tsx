import LivePrices from "@/components/LivePrices";

export default function Home() {
	return (
		<main className="h-screen">
			<h1 className="flex items-center justify-center py-24 text-5xl font-bold">
				Welcome to Bitprofit
			</h1>
				
			<LivePrices />
		</main>
	);
}