import Timer from './components/timer';
import '../public/popup.css';
import Phase from './components/phase';
import Petcreator from './components/PetCreator';

function App() {

  return (
    <main className='w-80 p-4 bg-transparent-50'>
      <div>
        <Phase />
        <Timer />
        <Petcreator />

      </div>
    </main>
  )
}

export default App
