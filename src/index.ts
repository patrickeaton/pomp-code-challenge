import { createTodo } from './create-todo';
import { listTodos } from './list-todos';
import { markAsComplete } from './mark-as-complete';

module.exports.handler = async ({
                           arguments: data,
                           info: { fieldName }}:
                           { arguments: any, info: {fieldName: string}}
) => {

  switch (fieldName) {
    case 'createTodo':
      return createTodo(data);
    case 'listTodos':
      return listTodos(data);
    case 'markTodoAsComplete':
      return markAsComplete(data);
  }

  return null;
}