// src/components/timer.tsx
// A simple timer component for the Pawmodoro extension

export default function Timer() {
    return (
        <div className="text-center p-4 bg-gray-100 rounded-lg">
            <h1 className="text-6xl font-bold mb-4">25:00</h1>
            <div className="flex justify-center space-x-4 mt-4">
                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Start</button>
                <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Stop</button>
            </div>
        </div>
    );
}