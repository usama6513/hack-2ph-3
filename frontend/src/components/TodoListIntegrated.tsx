import { Todo } from '../types';

interface TodoListIntegratedProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoListIntegrated: React.FC<TodoListIntegratedProps> = ({ todos, onToggle, onDelete }) => {
  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-white/60">
        <p>No tasks yet. Add your first task!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={`flex items-center justify-between p-3 rounded-xl transition-all ${
            todo.completed
              ? 'bg-green-500/20 border border-green-500/30'
              : 'bg-white/10 border border-white/20 hover:bg-white/20'
          }`}
        >
          <div className="flex items-center space-x-3 flex-1">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
              className="w-5 h-5 rounded border-white/30 bg-white/10 text-indigo-600 focus:ring-indigo-500 focus:ring-2 cursor-pointer"
            />
            <span
              className={`flex-1 text-white ${
                todo.completed ? 'line-through text-white/60' : ''
              }`}
            >
              {todo.description}
            </span>
          </div>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default TodoListIntegrated;
