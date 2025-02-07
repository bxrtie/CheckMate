import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { motion } from 'framer-motion'
import useTodoStore from '../store/todoStore'
import TaskItem from './TaskItem'

const TaskList = () => {
  const tasks = useTodoStore((state) => state.tasks)

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8 text-gray-500 dark:text-gray-400"
      >
        No tasks found
      </motion.div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <Draggable key={task.id} draggableId={task.id} index={index}>
          {(provided, snapshot) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={{
                ...provided.draggableProps.style,
                transform: snapshot.isDragging
                  ? provided.draggableProps.style?.transform
                  : 'none',
              }}
            >
              <TaskItem task={task} />
            </motion.div>
          )}
        </Draggable>
      ))}
    </div>
  )
}

export default TaskList
