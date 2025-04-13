import { JsonResponse, processAudioStream } from "@/lib/api";


export async function POST(request: Request) {
  return processAudioStream(request, async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return JsonResponse({ message: "stream completed" });
  });
}

// Keep the GET method for testing
export async function GET() {
  return new Response('Endpoint /api/stream/test is working!');
}