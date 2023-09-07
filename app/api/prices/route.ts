import { NextResponse } from "next/server";

export async function GET (req: Request) {
    try {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd");
        const data = await res.json();
    
        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        return new NextResponse(error, { status: 500 });
    }
}