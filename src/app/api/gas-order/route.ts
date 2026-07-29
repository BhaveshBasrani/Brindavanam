import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const gasUrl = process.env.NEXT_PUBLIC_GAS_WEB_APP_URL || 'https://script.google.com/macros/s/AKfycbx_demo_brindavanam_script/exec';

    if (!gasUrl || gasUrl.includes('demo')) {
      return NextResponse.json({
        status: 'success',
        orders: [],
        message: 'Running in dev fallback mode. Add NEXT_PUBLIC_GAS_WEB_APP_URL in .env.local',
      });
    }

    const res = await fetch(gasUrl);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('GAS GET error:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch from Google Apps Script' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const bodyData = await request.json();
    const gasUrl = process.env.NEXT_PUBLIC_GAS_WEB_APP_URL || 'https://script.google.com/macros/s/AKfycbx_demo_brindavanam_script/exec';

    if (!gasUrl || gasUrl.includes('demo')) {
      return NextResponse.json({
        status: 'success',
        message: 'Order / status updated successfully in dev mode',
        orderId: bodyData.id || bodyData.orderId,
      });
    }

    const gasResponse = await fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });

    const result = await gasResponse.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('GAS POST error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Server error in Google Apps Script dispatch',
      },
      { status: 500 }
    );
  }
}
