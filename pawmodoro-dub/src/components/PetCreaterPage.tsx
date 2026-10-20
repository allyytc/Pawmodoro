// Side-panel first run. Saving a pet reloads the page so App can show the study view.
import PetCreator from './PetCreator';

export default function PetPage(){
    return(
    <div className="bg-white/90 rounded-lg p-6 shadow-xl mb-6">
        <PetCreator />
    </div>
    );
}