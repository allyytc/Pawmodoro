import { useState, useEffect } from 'react';
import Timer from './components/twentyfive-timer';
import { BreakPhase } from './components/phase';
import { StudyPhase } from './components/phase';
import PetPage from './components/PetCreaterPage';
import PetDisplay from './components/PetDisplay';
import SettingsPanel from './components/switchButton';

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const view = urlParams.get('view');
  const isSidePanel = view === 'sidepanel';
  const [hasPet, setHasPet] = useState(false);
  const [activeTimer, setActiveTimer] = useState<'study' | 'break'>('study'); // Track which timer is active
  
  useEffect(()=>{
    chrome.storage.local.get(['pet'], (result)=>{
      if (result.pet){
        setHasPet(true);
      }
      else{
        setHasPet(false);
      }
    })
  },[]
  )
  // SIDE PANEL VIEW 
  if (isSidePanel) {
    if (hasPet===false){
      return <PetPage />;
    }
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
          {activeTimer === 'study' ? <StudyPhase /> : <BreakPhase />}
          <Timer onTimerChange={(timerType) => setActiveTimer(timerType)} />
        </div>

        <div >
          <PetDisplay />
        </div>

        <div >
          <SettingsPanel />
        </div>
          <span className="text-white">Pawmodoro</span>
      </div>
    );
  }
  // POPUP VIEW
  import('../public/popup.css');
  
  return (
    <main className='w-80 p-4 bg-transparent'>
      <div>
        {activeTimer === 'study' ? <StudyPhase /> : <BreakPhase />}
        <Timer layout='vertical' onTimerChange={(timerType) => setActiveTimer(timerType)} />
        <div className='scale-75 relative top-[-25]'><PetDisplay /></div>
        <span className="text-white">Pawmodoro</span>
      </div>
    </main>
  );

}
export default App;
