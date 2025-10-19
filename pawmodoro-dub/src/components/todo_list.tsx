import{ useState } from "react";

interface Task {
    id: number;
    text: string;
    completed: boolean;

}

export default function TodoList() {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [inputText, setInputText] = useState("");

    const handleAddTask = () => {
        if (inputText.trim() === "") return;

        const newTask: Task = {
            id: Date.now(),
            text: inputText,
            completed: false,
        };

        setTasks([...tasks, newTask]);
        setInputText('');
    };
    const handleToggleTask = (id: number) => {
        setTasks(
            tasks.map(task => 
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            handleAddTask();
        }
    };


    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">To-Do List</h2>
            
            <div className="mb-4 flex"> 
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