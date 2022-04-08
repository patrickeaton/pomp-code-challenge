import axios from 'axios';
import listTodosQuery from './list-todos.graphql'

const client = (query, variables) =>
  axios({
    data: { query, variables },
    headers: {
      'x-api-key': 'da2-qb7o2w5pcfd6nb4ukjcqcwhzoi'
    },
    method: 'POST',
    url: 'https://rasa6uelpbbt7foehdldidsvhm.appsync-api.us-west-2.amazonaws.com/graphql'
  })
    .then(response => response.data)
    .catch(error => {
      console.log(error)
    });

export const listTodos = () => client(`query listTodos($status: String){
listTodos(status: $status) {
        id
        title
        status
  }
}`, {});
