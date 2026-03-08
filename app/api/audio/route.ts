// Audio is handled client-side using the Web Speech API (speechSynthesis)
// This allows native Catalan voice support without any API cost.
// This route is kept as a placeholder.
import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { message: 'Audio is handled client-side via Web Speech API' },
    { status: 200 }
  )
}
