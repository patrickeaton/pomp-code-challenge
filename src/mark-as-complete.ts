import { getDatabase } from './database';

export const markAsComplete = async ({ id }: {id: string}) => {
  console.log('markAsComplete')
  const db = await getDatabase();

  return await db('todos')
    .update({status: 'complete'})
    .where({id}).then();
}