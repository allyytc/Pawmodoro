export default function TodoList() {
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">To-Do List</h2>
            <ul className="space-y-2">
                <li className="flex items-center justify-between bg-white p-2 rounded shadow"></li>
            </ul>
            <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mt-4"
                placeholder="Add a new task..."
            />


        </div>
    );
}