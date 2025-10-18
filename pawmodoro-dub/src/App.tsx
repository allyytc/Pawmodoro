import Timer from './components/timer';
import TodoList from './components/todo_list';

function App() {

  return (
    <main className='w-80 p-4 bg-slate-50'>
      <div>
        <Timer />
      </div>
      <div>
        <TodoList />
      </div>
    </main>
  )
}

export default App
