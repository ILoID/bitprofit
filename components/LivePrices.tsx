"use client";

import { fetcher, formattedPrice } from "@/lib/utils";
import { useState } from "react";
import useSWR from "swr";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { CopyIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/Button";

const LivePrices = () => {
    const { data, error } = useSWR("/api/prices", fetcher, { refreshInterval: 20000 });
    
    const [selectedCoin, setSelectedCoin] = useState("bitcoin"); // ["bitcoin", "ethereum", "custom"
    const [customPrice, setCustomPrice] = useState(0);
    const [takeProfitPercent, setTakeProfitPercent] = useState(0.5);
    const [stopLossPercent, setStopLossPercent] = useState(0.5);

    if (error) {
        return (
            <div>
                Error
            </div>
        )
    };
    
    if (!data) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    let activePrice;
    if (selectedCoin === "bitcoin") {
        activePrice = data.bitcoin.usd;
    } else if (selectedCoin === "ethereum") {
        activePrice = data.ethereum.usd;
    } else {
        activePrice = customPrice;
    }

    const takeProfitPrice = activePrice + (activePrice * takeProfitPercent) / 100;
    const stopLossPrice = activePrice - (activePrice * stopLossPercent) / 100;

    const onCopy = (price: number) => {
        navigator.clipboard.writeText(price.toFixed(2));
    }

    return (
        <section className="px-16 flex items-center justify-between">

            <RadioGroup defaultValue="bitcoin" onValueChange={(value) => setSelectedCoin(value)}>
                <div>
                    <RadioGroupItem value="bitcoin" id="bitcoin" className="sr-only peer" />
                    <Label htmlFor="bitcoin" className="flex flex-col items-center justify-between gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <Image src="btc-icon.svg" alt="btc" width={32} height={32} />
                        <p className="text-xl font-bold">
                            Bitcoin
                        </p>
                    </Label>
                </div>
                <div>
                    <RadioGroupItem value="ethereum" id="ethereum" className="sr-only peer" />
                    <Label htmlFor="ethereum" className="flex flex-col items-center justify-between gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <Image src="eth-icon.svg" alt="eth" width={32} height={32} />
                        <p className="text-xl font-bold">
                            Ethereum
                        </p>
                    </Label>
                </div>
                <div>
                    <RadioGroupItem value="custom" id="custom" className="sr-only peer" />
                    <Label htmlFor="custom" className="flex flex-col items-center justify-between gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <Image src="dollar-icon.svg" alt="btc" width={32} height={32} />
                        <p className="text-xl font-bold">
                            Custom Value
                        </p>
                    </Label>
                </div>
            </RadioGroup>

            {selectedCoin !== "custom" ? (
                <div className="flex flex-col items-center justify-between space-y-4">
                    <h3 className="text-2xl capitalize">
                        Current Price:
                    </h3>
                    <h2 className="text-4xl font-bold font-mono">
                        {formattedPrice(activePrice)}
                    </h2>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-between space-y-4">
                    <Label className="text-2xl">
                        Enter Custom Value:
                    </Label>
                    <Input type="number" value={customPrice} onChange={(e) => setCustomPrice(Number(e.target.value))} />
                </div>
            )}

            <div className="flex flex-col items-center justify-between space-y-2">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Take Profit
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Input type="number" step={0.1} value={takeProfitPercent} onChange={(e) => setTakeProfitPercent(Number(e.target.value))} />
                    </CardContent>
                    <CardFooter className="flex items-center justify-between text-xl">
                        {formattedPrice(takeProfitPrice)}
                        <Button onClick={() => onCopy(takeProfitPrice)} variant="outline">
                            <CopyIcon className="w-6 h-6" />
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Stop Loss
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Input type="number" step={0.1} value={stopLossPercent} onChange={(e) => setStopLossPercent(Number(e.target.value))} />
                    </CardContent>
                    <CardFooter className="flex items-center justify-between text-xl">
                        {formattedPrice(stopLossPrice)}
                        <Button onClick={() => onCopy(stopLossPrice)} variant="outline">
                            <CopyIcon className="w-6 h-6" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </section>
    );
};

export default LivePrices;