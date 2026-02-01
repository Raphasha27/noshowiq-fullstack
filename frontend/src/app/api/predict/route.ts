import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Connect directly to the ML Engine (Python)
    const pythonServiceUrl = 'http://localhost:8001/predict';
    
    const response = await fetch(pythonServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`ML Engine returned ${response.status}`);
    }

    const prediction = await response.json();
    return NextResponse.json(prediction);
    
  } catch (error) {
    console.error('ML API Error:', error);
    // Fallback to mock data if ML engine is offline so the demo doesn't break
    return NextResponse.json({
      error: 'ML Engine Offline',
      no_show_probability: 0.5,
      risk_level: 'medium',
      recommendation: 'Standard (Fallback)',
      intervention_type: 'SMS'
    });
  }
}
