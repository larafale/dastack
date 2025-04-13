import { OpenAI } from 'openai';
import { Chrono } from '@/lib/utils';
import { CallShape, nope, ok } from '@/lib/errors';
import { DEFAULT_LLM, LLMString, getModel } from './llms';
import { generateObject, generateText, streamText } from 'ai';
import { type ZodSchema } from 'zod';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const withStats = (obj: any, stats: any = {}) => {
  obj.ai = { ...stats };
  return obj;
};

export async function speechToText({
  blob,
  llm = 'openai:whisper',
}: {
  blob: Blob;
  llm?: LLMString;
}): Promise<CallShape> {
  try {
    if (!blob) throw new Error('No file provided');

    const arrayBuffer = await blob.arrayBuffer();
    const fileExtension = blob.type.includes('mp4')
      ? 'mp4'
      : blob.type.includes('webm')
        ? 'webm'
        : 'm4a';

    const audioFile = new File(
      [new Uint8Array(arrayBuffer)],
      `audio.${fileExtension}`,
      { type: blob.type }
    );

    let chrono = Chrono.start();

    const { text } = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      // language: "en",
    });

    chrono = Chrono.end(chrono);
    const result = withStats({ text }, { llm, ...chrono });
    return ok(result);
  } catch (err) {
    console.error('Transcription error:', err);
    return nope('Transcription error');
  }
}

interface TTOOptions<T> {
  llm?: LLMString;
  system?: string;
  prompt: string;
  schema: ZodSchema<T>;
}

// Text to Object
export async function textToObject<T>({
  llm = DEFAULT_LLM,
  system = 'You are a helpful Text to JSON Object converter.',
  prompt,
  schema,
}: TTOOptions<T>): Promise<any> {
  let chrono = Chrono.start();

  const res = await generateObject({
    model: getModel(llm),
    system,
    prompt,
    schema,
  });

  chrono = Chrono.end(chrono);

  const result = withStats({ object: res.object }, { llm, ...chrono });
  return ok(result);
}

const fileToTextPrompt = `
- Your task is to extract ALL text from the document.
- keep the exact words, don't change anything.
- organize the text in a way that is easy to read and understand.
- for tabular text parts, use markdown table format
- your only output has to the extracted text, nothing else, unless document is an image.
- if document is image or photo, give a detailed description of the image.
- if image and you see human, describe the human, include gender, age, hair, eyes, facial expression, etc.
- if you see a relevant hand sign, maybe count how many fingers are shown
`;

export async function fileToText({
  blob,
  llm = 'anthropic:3.5-sonnet',
  prompt = fileToTextPrompt,
}: {
  blob: Blob;
  llm?: LLMString;
  prompt?: string;
}): Promise<CallShape> {
  try {
    if (!blob) throw new Error('No file provided');

    const fileType = blob.type.startsWith('image/') ? 'image' : 'file';
    const arrayBuffer = await blob.arrayBuffer();
    const fileContent =
      fileType === 'image'
        ? { type: 'image', image: arrayBuffer }
        : { type: 'file', data: arrayBuffer, mimeType: blob.type };


    let chrono = Chrono.start();
    // console.log('fileToText', prompt, fileType);

    const stream = streamText({
      model: getModel(llm),
      messages: [
        {
          role: 'user',
          content: [{ type: 'text', text: prompt }, fileContent],
        },
      ],
    });

    let text = '';
    for await (const textPart of stream.textStream) {
      text += textPart;
    }

    chrono = Chrono.end(chrono);
    const result = withStats({ text }, { llm, ...chrono });
    return ok(result);
  } catch (err) {
    console.error('File to text error:', err);
    return nope('File to text error');
  }
}

export async function textToChat({
  llm = 'openai:4o-mini',
  system = 'You are a helpful assistant.',
  prompt,
}: {
  llm?: LLMString;
  system?: string;
  prompt: string;
}): Promise<CallShape> {
  try {
    let chrono = Chrono.start();

    const { text } = await generateText({
      model: getModel(llm),
      system,
      prompt,
    });

    chrono = Chrono.end(chrono);
    const result = withStats(
      { question: prompt, answer: text },
      { llm, ...chrono }
    );
    return ok(result);
  } catch (err) {
    console.error('Text to chat error:', err);
    return nope('Text to chat error');
  }
}
