'use server';

export const submitId = async (id: string) => {
  return { message: `Hello ${id}, from server!` };
};
