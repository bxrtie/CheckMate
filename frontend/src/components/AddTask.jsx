import React, { useState } from 'react'
import useTodoStore from '../store/todoStore'

const AddTask = () => {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const addTask = useTodoStore((state) => state.addTask)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim()) {
      addTask({
        title: title.trim(),
        priority,
        completed: false,
      })
      setTitle('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!title.trim()}
        >
          Add
        </button>
      </div>
    </form>
  )
}

export default AddTask
