import React from 'react';

function TodoItem({ todo }) {
  return (
    <li className="py-2">
      <input type="checkbox" className="mr-2" checked={todo.completed} />
      <span className={todo.completed ? 'line-through text-gray-500' : 'text-black'}>
        {todo.title}
      </span>
      <button className="ml-4 text-red-500">Delete</button>
    </li>
  );
}

export default TodoItem;
