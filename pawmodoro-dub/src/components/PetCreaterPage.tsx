// This is the first page users enter to create their pet, then after pressing the save button, 
// it directs users tot eh app.tsx which will become the main.
import PetCreator from './PetCreator';

export default function PetPage(){
    return(
    <div className="bg-white/90 rounded-lg p-6 shadow-xl mb-6">
        <PetCreator />
    </div>
    );
}