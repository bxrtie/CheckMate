import React, { useState } from 'react'
import { TrashIcon, PencilIcon, CalendarIcon } from '@heroicons/react/24/outline'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import useTodoStore from '../store/todoStore'

const priorityColors = {
  high: 'bg-priority-high-bg',
  medium: 'bg-priority-medium-bg',
  low: 'bg-priority-low-bg',
}

const TaskItem = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const { updateTask, deleteTask } = useTodoStore()
  const [editedTitle, setEditedTitle] = useState(task.title)

  const handleUpdate = () => {
    if (editedTitle.trim()) {
      updateTask(task.id, { title: editedTitle })
      setIsEditing(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUpdate()
    } else if (e.key === 'Escape') {
      setEditedTitle(task.title)
      setIsEditing(false)
    }
  }

  const handleDateChange = (date) => {
    updateTask(task.id, { dueDate: date })
    setShowDatePicker(false)
  }

  const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div
      className={`task-card ${priorityColors[task.priority]} ${
        task.completed ? 'opacity-75' : ''
      }`}
      onDoubleClick={() => !isEditing && setIsEditing(true)}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center flex-1 min-w-0">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => updateTask(task.id, { completed: !task.completed })}
            className="w-5 h-5 mr-3 rounded border-gray-300 text-blue-600 
                     focus:ring-blue-500 cursor-pointer"
          />
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleUpdate}
              onKeyDown={handleKeyPress}
              className="flex-1 bg-transparent border-b border-gray-300 
                       focus:border-blue-500 focus:outline-none px-1"
              autoFocus
            />
          ) : (
            <div className="flex-1 min-w-0">
              <span
                className={`block truncate ${
                  task.completed ? 'line-through text-gray-500' : ''
                }`}
              >
                {task.title}
              </span>
              {task.dueDate && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Due: {formatDate(task.dueDate)}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
                     text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <CalendarIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
                     text-gray-500 hover:text-blue-500"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
                     text-gray-500 hover:text-red-500"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {showDatePicker && (
        <div className="absolute z-10 mt-2">
          <DatePicker
            selected={task.dueDate ? new Date(task.dueDate) : null}
            onChange={handleDateChange}
            dateFormat="MMM d, yyyy"
            minDate={new Date()}
            inline
          />
        </div>
      )}
    </div>
  )
}

export default TaskItem
