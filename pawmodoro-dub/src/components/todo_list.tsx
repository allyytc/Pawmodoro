import{ useState } from "react";
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
// function to add new task
    const handleAddTask = () => {
        if (inputText.trim() === "") return;

        const newTask: Task = {
            id: Date.now(),
            text: inputText,
            completed: false,
        };
// update tasks and clear input
        setTasks([...tasks, newTask]);
        setInputText('');
    };
// function to toggle task completion
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
// function to enter key press
    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            handleAddTask();
        }
    };

// ui for todo list plus functions
    return (
        <div className="p-0 bg-white/20 rounded-lg">
            <h2 className="text-2xl text-white font-bold mb-4">To-Do List</h2>
            
            <div className="mb-4 flex text-white"> 
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a new task..."
                    className="flex-grow p-2 border border-gray-300 rounded-l"
                />
                <button
                    onClick={handleAddTask}
                    className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
                >
                    Add
                </button>
            </div>

            <ul className="space-y-2">
                {tasks.map(task => (
                    <li 
                    key = {task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className="flex items-center justify-between bg-white p-2 rounded shadow"
                    >
                        <input 
                            type="checkbox"
                            readOnly
                            checked={task.completed}
                            className="mr-2 h-5 w-5 accent-amber-300"
                        />
                        <span className={task.completed ? "line-through text-gray-500" : ""}>
                            {task.text}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}