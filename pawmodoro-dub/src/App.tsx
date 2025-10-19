import { useState, useEffect } from 'react';
import Timer from './components/timer';
import '../public/popup.css';

import { ShortBreakPhase } from './components/phase';
import PetPage from './components/PetCreaterPage';
import PetDisplay from './components/PetDisplay';
import SettingsPanel from './components/switchButton';

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const view = urlParams.get('view');
  const isSidePanel = view === 'sidepanel';
  const [hasPet, setHasPet] = useState(false);
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
  
  return (
    <main className='w-80 p-4 bg-transparent'>
      <div>
        <ShortBreakPhase />
        <Timer />
        <PetDisplay />
      </div>
    </main>
  );

}
export default App;
