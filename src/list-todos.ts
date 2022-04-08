import { getDatabase } from './database';

export const listTodos = async ({ status }: {status: string}) => {
   const db = await getDatabase();
   console.log('listTodos');
   const query = db('todos').select('*');

   if(status) {
     query.where({ status })
   }

   console.log('List', query.toSQL().toNative());

   return await query.then();
}