import axios from 'axios';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest, res: Response) {
  const direction = req.nextUrl.searchParams.get('direction');

  // const response =

  return new Response(
    (
      await axios.post('https://api-meshmali.eu1.pitunnel.com/control', {
        direction,
      })
    ).data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}
