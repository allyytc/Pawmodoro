import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Timer from './components/timer'
import TodoList from './components/todo_list'

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <StrictMode>
        <h1 className="text-3xl font-bold mb-6">Pawmodoro</h1>
        <Timer />
        <div className="mt-6">
          <TodoList />
        </div>
    </StrictMode>
  )
}
