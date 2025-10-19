import Timer from './components/timer';
import TodoList from './components/todo_list';
import Petcreator from './components/petcreator';


function App() {

  return (
    <main className='w-80 p-4 bg-slate-50'>
      <div>
        <Timer />
        
      </div>
      <div>
        <TodoList />
        <Petcreator />
      </div>
    </main>
  )
}

export default App
