'use server';

import prisma from '@/lib/prisma';
import { Doc } from '@/generated/prisma';
import { find, update, create, get, remove } from './crud';
import { fileToText} from '@/lib/ai';
import { type LLMString } from '@/lib/llms';
import { getFileCategory } from '@/components/app/docs/utils';
import { CallShape, nope } from '@/lib/errors';


export async function getDocs(props: any) {
  return find<Doc>('doc', {
    searchKeys: ['ref', 'title'],
    ...props,
  });
}

export async function getDoc(id: string, options?: any) {
  return get('doc', id, options);
}

export async function getFile(id: string, options?: any) {
  return get('file', id, options);
}

export async function createDoc(data?: Partial<Doc>) {
  return create('doc', data);
}

export async function editDoc(id: string, updateData: Partial<Doc>) {
  return update('doc', id, updateData);
}

export async function deleteDoc(id: string) {
  try {
    // First get the document to check if it has a file
    const { err, data: doc } = await getDoc(id, { select: { fileId: true } });
    if (err) throw err;

    // If the document has an associated file, delete it first
    if (doc?.fileId) await remove('file', doc.fileId);
    // Then delete the document
    return await remove('doc', id);
  } catch (error) {
    console.error('Error deleting document and file:', error);
    throw error;
  }
}

export async function uploadFiles(files: File[], llm?: LLMString) {
  try {
    const results = [];

  for (const file of files) {
    try {
      const fileName = file.name;
      const lastDotIndex = fileName.lastIndexOf('.');
      const ext =
        lastDotIndex !== -1 ? fileName.substring(lastDotIndex + 1) : '';
      const buffer = Buffer.from(await file.arrayBuffer());
      const meta = {
        ext,
        category: getFileCategory(ext),
        originalName: fileName,
        type: file.type,
        size: file.size,
      };

      // First create a File entry
      const newFile = await prisma.file.create({
        data: {
          meta,
          data: buffer,
        },
      });

      // Then create the Doc with a reference to the file
      const newDoc = await prisma.doc.create({
        data: {
          title: fileName,
          meta,
          fileId: newFile.id,
        },
      });

      if (!newDoc) {
        throw new Error('Document creation failed');
      }

      results.push(newDoc);
    } catch (error) {
      console.error('Error processing file:', file.name, error);
    }
  }

    return results;
  } catch (err) {
    return nope(err);
  }
}


export const processText = async ({
  id,
  llm,
  prompt,
}: {
  id: string;
  llm?: LLMString;
  prompt?: string;
}) => {
  try {
    if (!id) throw new Error('id is required');
    let call: CallShape;
    let doc: any;

    call = await getDoc(id, { select: { file: true } });
    if (call.err) throw call.err;
    doc = call.data;

    if (!doc?.file?.data) throw new Error('Doc file not found');
    const blob = new Blob([doc.file.data], { type: doc.file.meta.type });

    call = await fileToText({ blob, llm, prompt });
    if (call.err) throw call.err;
    if (!call.data?.text) throw new Error('No text returned');

    call = await editDoc(id, { text: call.data.text });
    return call;
  } catch (err) {
    return nope(err);
  }
};
