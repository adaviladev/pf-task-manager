// Home.js

import { useClient } from 'next/dist/client';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

export default function Home() {
  useClient(); // Marking the component as client-side rendered

  // Example useState usage
  const [todos, setTodos] = useState([]);

  const addTodo = (newTodo) => {
    setTodos([...todos, newTodo]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold">To-do App</h1>
      <p className="mt-4 text-lg">Use this app to plan your tasks.</p>
      <div className="bg-slate-600">
        <TodoForm addTodo={addTodo} />
        <TodoList todos={todos} />
      </div>
    </main>
  );
}
