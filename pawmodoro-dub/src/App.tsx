import Timer from './components/timer';
import '../public/popup.css';
import Phase from './components/phase';

function App() {

  return (
    <main className='w-80 p-4 bg-transparent-50'>
      <div>
        <Phase />
        <Timer />
      </div>
    </main>
  )
}

export default App
