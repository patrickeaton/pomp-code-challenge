import { getDatabase } from './database';

export const markAsComplete = async ({ id }: {id: string}) => {
  const db = await getDatabase();

  return await db('todos')
    .update({ status: 'complete'})
    .where({ id })
    .then();
}