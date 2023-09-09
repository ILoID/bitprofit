"use client";

import { cn, fetcher, formattedPrice } from "@/lib/utils";
import { useState } from "react";
import useSWR from "swr";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { CopyIcon, MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/Button";

const LivePrices = () => {
    const { data, error } = useSWR("/api/prices", fetcher, { refreshInterval: 20000 });

    const [selectedCoin, setSelectedCoin] = useState<string>("bitcoin"); // ["bitcoin", "ethereum", "custom"]
    const [customPrice, setCustomPrice] = useState<number>(0);
    const [takeProfitPercent, setTakeProfitPercent] = useState<number>(0.4);
    const [stopLossPercent, setStopLossPercent] = useState<number>(0.4);
    const [tradingDirection, setTradingDirection] = useState<"long" | "short">("long"); // ["long", "short"]

    const [percentageBase, setPercentageBase] = useState<number>(1);
    const [applyTo, setApplyTo] = useState({ tp: true, sl: true });
    const [tpTooltipVisible, setTpTooltipVisible] = useState<boolean>(false);
    const [slTooltipVisible, setSlTooltipVisible] = useState<boolean>(false);

    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>

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

    const handlePercentageClick = (percentage: number) => {
        if (applyTo.tp) setTakeProfitPercent(percentage);
        if (applyTo.sl) setStopLossPercent(percentage);
    }

    const toggleApplyTo = (type: "tp" | "sl") => {
        setApplyTo(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const onTpCopy = (price: number) => {
        navigator.clipboard.writeText(price.toFixed(2));
        setTpTooltipVisible(true);
        setTimeout(() => setTpTooltipVisible(false), 2000);
    };

    const onSlCopy = (price: number) => {
        navigator.clipboard.writeText(price.toFixed(2));
        setSlTooltipVisible(true);
        setTimeout(() => setSlTooltipVisible(false), 2000);
    };

    const incrementBase = () => {
        if (percentageBase < 100) setPercentageBase(percentageBase * 10);
    };

    const decrementBase = () => {
        if (percentageBase > 1) setPercentageBase(percentageBase / 10);
    };

    return (
        <section className="md:px-16 lg:px-32 xl:px-48 flex items-center justify-between">
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


            <div className="flex items-center space-x-4">
                <div className="flex flex-col items-center justify-between space-y-16">
                    <div className="flex justify-center space-x-8">
                        <Button onClick={() => setTradingDirection("long")} variant="outline" className={cn("py-6", tradingDirection === "long" && "bg-primary hover:bg-green-600")}>
                            LONG
                        </Button>
                        <Button onClick={() => setTradingDirection("short")} variant="outline" className={cn("py-6", tradingDirection === "short" && "bg-red-500 hover:bg-red-600")}>
                            SHORT
                        </Button>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Button variant="outline" onClick={incrementBase}>
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Increment Base
                        </Button>
                        <Button variant="outline" onClick={decrementBase}>
                            <MinusIcon className="w-4 h-4 mr-2" />
                            Decrement Base
                        </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" onClick={() => toggleApplyTo("tp")} className={applyTo.tp ? "bg-blue-500 hover:bg-blue-600" : ""}>
                            Apply on TP
                        </Button>
                        <Button variant="ghost" onClick={() => toggleApplyTo("sl")} className={applyTo.sl ? "bg-blue-500 hover:bg-blue-600" : ""}>
                            Apply on SL
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col space-y-1">
                    {Array.from({ length: 10 }).map((_, index) => {
                        const value = Number(((index + 1) * 0.1 * percentageBase).toFixed(1).replace(/\.0$/, ""));
                        return (
                            <Button variant="outline" key={value} onClick={() => handlePercentageClick(value)} className="w-[100px]">
                                {value}%
                            </Button>
                        );
                    })}
                </div>

                <div className="flex flex-col items-center justify-between space-y-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                {tradingDirection === "long" ? "Take Profit" : "Stop Loss"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-6 text-xl">
                            <Input type="number" step={0.1} value={takeProfitPercent} onChange={(e) => setTakeProfitPercent(Number(e.target.value))} />
                            %
                        </CardContent>
                        <CardFooter className="flex items-center justify-between text-2xl font-bold">
                            <p className={tradingDirection === "long" ? "text-primary" : "text-red-500"}>
                                {formattedPrice(takeProfitPrice)}
                            </p>
                            <Button className="relative" onClick={() => onTpCopy(takeProfitPrice)} variant="outline">
                                <CopyIcon className="w-6 h-6" />
                                {tpTooltipVisible && (
                                    <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-10 bg-primary text-white px-2 py-1 rounded-md text-xs font-bold">
                                        Copied!
                                    </span>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                {tradingDirection === "long" ? "Stop Loss" : "Take Profit"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-6 text-xl">
                            <Input type="number" step={0.1} value={stopLossPercent} onChange={(e) => setStopLossPercent(Number(e.target.value))} />
                            %
                        </CardContent>
                        <CardFooter className="flex items-center justify-between text-2xl font-bold">
                            <p className={tradingDirection === "short" ? "text-primary" : "text-red-500"}>
                                {formattedPrice(stopLossPrice)}
                            </p>
                            <Button className="relative" onClick={() => onSlCopy(stopLossPrice)} variant="outline">
                                <CopyIcon className="w-6 h-6" />
                                {slTooltipVisible && (
                                    <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-10 bg-primary text-white px-2 py-1 rounded-md text-xs font-bold">
                                        Copied!
                                    </span>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default LivePrices;