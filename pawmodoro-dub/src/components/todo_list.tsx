// import react hooks
import { useState, useEffect } from "react"; 

// define task structure
interface Task {
    id: number;
    text: string;
    completed: boolean;
}

export default function TodoList() {
    // state to hold tasks and input text
    const [tasks, setTasks] = useState<Task[]>([]);
    const [inputText, setInputText] = useState("");

//logic for loading and saving tasks
    useEffect(() => {
        if (chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(['savedTasks'], (result) => {
                if (result.savedTasks) {
                    setTasks(result.savedTasks);
                }
            });
        }
    }, []); // The empty array [] means this effect runs only once

    //helper function to save tasks to storage and update the state
    const saveTasks = (newTasks: Task[]) => {
        setTasks(newTasks);
        chrome.storage.local.set({ savedTasks: newTasks });
    };

    // functions to handle adding and toggling tasks
    // add new task
    const handleAddTask = () => {
        if (inputText.trim() === "") return;

        const newTask: Task = {
            id: Date.now(),
            text: inputText,
            completed: false,
        };
        saveTasks([...tasks, newTask]);
        setInputText('');
    };
    // toggle task completion and trigger celebration if completed
    const handleToggleTask = (id: number) => {
        setTasks(
            tasks.map(task => {
                if (task.id === id && !task.completed) {
                    // Task is being completed! Trigger celebration
                    console.log("Task completed! Celebrating...");
                    chrome.storage.local.set({ celebrating: true }, () => {
                        // Auto-remove celebration flag after 3 seconds
                        setTimeout(() => {
                            chrome.storage.local.remove('celebrating');
                        }, 3000);
                    });
                }
                return task.id === id ? { ...task, completed: !task.completed } : task;
            })
        );
       
    };
    // handle enter key press in input box
    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            handleAddTask();
        }
    };

    // ui for todo list plus functions
    return (
        <div className="p-4 bg-white/20 rounded-lg">
            <h2 className="text-2xl text-white font-bold mb-4">To-Do List</h2>

            <div className="mb-4 flex">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a new task..."
                    className="flex-grow p-2 border border-gray-300 rounded-l-md text-gray-800 focus:outline-none"
                />
                <button
                    onClick={handleAddTask}
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                >
                    Add
                </button>
            </div>

            <ul className="space-y-2 max-h-40 overflow-y-auto">
                {tasks.map(task => (    
                    <li
                        key={task.id}
                        onClick={() => handleToggleTask(task.id)}
                        className="flex items-center bg-white/20 p-2 rounded-md cursor-pointer hover:bg-white/30"
                    >
                        <input
                            type="checkbox"
                            readOnly
                            checked={task.completed}
                            className="mr-3 h-5 w-5 accent-green-500"
                        />
                        <span className={task.completed ? "line-through text-gray-300" : "text-white"}>
                            {task.text}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}