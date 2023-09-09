import LivePrices from "@/components/LivePrices";
import ModeToggle from "@/components/ModeToggle";

export default function Home() {
	return (
		<main className="h-screen">
			<ModeToggle />
			<div className="flex flex-col items-center justify-between space-y-4 py-24">
				<h1 className="text-5xl font-bold">
					Welcome to Bitprofit
				</h1>
				<p className="text-xl text-muted-foreground">
					The fastest way to calculate your price targets
				</p>
			</div>
				
			<LivePrices />
		</main>
	);
}