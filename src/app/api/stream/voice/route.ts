import { JsonResponse, processAudioStream } from '@/lib/api';
import { speechToText } from '@/lib/ai';


export async function POST(request: Request) {
  return processAudioStream(request, async (audioFile) => {
    const stt = await speechToText({ blob: audioFile.blob });
    return JsonResponse(stt);
  });
}

// Keep the GET method for testing
export async function GET() {
  return new Response('Endpoint /api/stream/voice is working!');
}
