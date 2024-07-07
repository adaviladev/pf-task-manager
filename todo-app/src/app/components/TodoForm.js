import React, { useState } from 'react';


function TodoForm({ addTodo }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTodo({
      id: Date.now(),
      title,
      completed: false
    });
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="my-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="py-2 px-3 border border-gray-300 rounded-lg mr-2"
        placeholder="Add a new todo..."
      />
      <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-lg">Add Todo</button>
    </form>
  );
}

export default TodoForm;
