import Timer from './components/timer';

// import TodoList from './components/todo_list';
// import WebsiteManager from './components/WebsiteManager';
import '../public/popup.css';
import { ShortBreakPhase } from './components/phase';
import PetDisplay from './components/PetDisplay';
import SettingsPanel from './components/switchButton';

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
        <div >
          <ShortBreakPhase />
          <Timer />
        </div>

        <div >
          <PetDisplay />
        </div>

        <div >
          <SettingsPanel />
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
        <PetDisplay />
      </div>
    </main>
  )
}

export default App
