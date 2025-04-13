import { AudioFile } from "@/components/audio-stream/types";


export const JsonResponse = (data: any) => {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}



export async function processAudioStream(
  request: Request,
  onComplete?: (audioFile: AudioFile) => Promise<Response>
): Promise<Response> {
  try {
    const isFinalChunk = request.headers.get('X-Final-Chunk') === 'true';
    const audioBlob = await request.blob();
    const duration = parseFloat(request.headers.get('X-Audio-Duration') || '0');

    // Check if this is a final chunk notification
    if (isFinalChunk) {
      return onComplete ? await onComplete({ blob: audioBlob, duration }) : JsonResponse({
        message: "Recording completed successfully",
        timestamp: new Date().toISOString()
      });
    }

    // Regular audio chunk processing
    return JsonResponse({
      success: true,
      message: "Audio chunk received",
      size: audioBlob.size,
      contentType: audioBlob.type
    });
  } catch (error) {
    console.error("[API] Error processing audio stream:", error);

    return new Response(JSON.stringify({
      success: false,
      error: `Failed to process audio stream: ${error}`
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
