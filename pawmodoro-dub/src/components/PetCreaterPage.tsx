// First-run page: wraps PetCreator. After the user saves a pet, the page reloads into the main App view.
import PetCreator from './PetCreator';

export default function PetPage(){
    return(
    <div className="bg-white/90 rounded-lg p-6 shadow-xl mb-6">
        <PetCreator />
    </div>
    );
}