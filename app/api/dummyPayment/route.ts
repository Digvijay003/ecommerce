import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        return NextResponse.json({ message: 'Dummy payment processed successfully', data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
}

export async function OPTIONS(req: NextRequest) {
    return new NextResponse(null, {
        headers: {
            'Allow': 'POST',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        status: 200
    });
}
