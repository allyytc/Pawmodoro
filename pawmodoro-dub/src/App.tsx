import Timer from './components/timer';
import TodoList from './components/todo_list';
import { ShortBreakPhase } from './components/phase';
import '../public/popup.css';
import Phase from './components/phase';
import Petcreator from './components/PetCreator';

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const view = urlParams.get('view');
  const isSidePanel = view === 'sidepanel';

  // SIDE PANEL VIEW 
  if (isSidePanel) {
    return (
      <div 
        className="min-h-screen p-8"
        style={{
          backgroundImage: 'url("images/bedroom.png")',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      >
        <div className="bg-white/90 rounded-lg p-6 shadow-xl mb-6">
          <ShortBreakPhase />
          <Timer />
        </div>

        <div className="bg-white/90 rounded-lg p-6 shadow-xl mb-6">
          <Petcreator />
        </div>

        <div className="bg-white/90 rounded-lg p-6 shadow-xl">
          <TodoList />
        </div>
      </div>
    );
  }

  // POPUP VIEW - Compact design with cabin background
  import('../public/popup.css');
  
  return (
    <main className='w-80 p-4 bg-transparent'>
      <div>
        <ShortBreakPhase />
        <Timer />
        <Petcreator />

      </div>
    </main>
  )
}

export default App
