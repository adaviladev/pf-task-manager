import React from 'react';
import TodoItem from './TodoItem';

function TodoList({ todos }) {
    return (
      <ul className="divide-y divide-gray-300">
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    );
  }
  
  export default TodoList;