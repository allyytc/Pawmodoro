import { useState } from 'react';
import TodoList from './todo_list';
import WebsiteManager from './WebsiteManager';


// allows for switching between todo list and website manager

const SettingsPanel: React.FC = () => {
    const [activeView, setActiveView] = useState('todos');

    const toggleView = () => {
        setActiveView(activeView === 'todos' ? 'websites' : 'todos');
    };

    return (
        <div >
            <button 
            className='px-5 py 1 font-bold bg-white/20 text-white rounded r hover:bg-white/30'
            onClick={toggleView}>
                {activeView === 'todos' ? 'Next -->' : '<-- Back'}
                </button>

            <div className="mt-4">
                {activeView === 'todos' ? <TodoList /> : <WebsiteManager />}
            </div>



        </div>
    );
}

export default SettingsPanel;
