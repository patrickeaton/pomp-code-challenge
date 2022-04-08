import { getDatabase } from './database';

export const createTodo = async ({ todo }: { todo: any }) => {
  const db = await getDatabase();
  console.log('createTodo');
  const res = await db('todos')
    .insert({ ...todo, status: 'incomplete' })
    .then();

  console.log(res);

  return res;
}