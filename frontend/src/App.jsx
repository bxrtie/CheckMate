import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { motion, AnimatePresence } from 'framer-motion'
import { SunIcon, MoonIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { Menu } from '@headlessui/react'
import { Tooltip } from 'react-tooltip'
import useTodoStore from './store/todoStore'
import TaskList from './components/TaskList'
import AddTask from './components/AddTask'
import SearchBar from './components/SearchBar'
import ProgressBar from './components/ProgressBar'
import { useAuth } from './contexts/AuthContext'

function App() {
  const { darkMode, toggleDarkMode, tasks, reorderTasks } = useTodoStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('')
  const { user, signInWithGoogle, logout } = useAuth()
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setIsInstallable(false)
    }
    setDeferredPrompt(null)
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(tasks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    reorderTasks(items)
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = selectedPriority ? task.priority === selectedPriority : true
    return matchesSearch && matchesPriority
  })

  const completedTasks = tasks.filter(task => task.completed).length

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Minimalist Todo</h1>
          <div className="flex items-center space-x-4">
            {isInstallable && (
              <button
                onClick={handleInstall}
                className="btn btn-primary"
                data-tooltip-id="install-tooltip"
                data-tooltip-content="Install as app"
              >
                Install
              </button>
            )}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700
                       transition-colors duration-200"
              data-tooltip-id="theme-tooltip"
              data-tooltip-content={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <SunIcon className="w-6 h-6" />
              ) : (
                <MoonIcon className="w-6 h-6" />
              )}
            </button>
            <Menu as="div" className="relative">
              <Menu.Button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700
                                    transition-colors duration-200">
                <UserCircleIcon className="w-6 h-6" />
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                {user ? (
                  <>
                    <Menu.Item>
                      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                        {user.email}
                      </div>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Sign Out
                      </button>
                    </Menu.Item>
                  </>
                ) : (
                  <Menu.Item>
                    <button
                      onClick={signInWithGoogle}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign in with Google
                    </button>
                  </Menu.Item>
                )}
              </Menu.Items>
            </Menu>
          </div>
        </header>

        <ProgressBar completed={completedTasks} total={tasks.length} />
        
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
        />

        <AddTask />

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                className="space-y-3"
              >
                <AnimatePresence>
                  <TaskList tasks={filteredTasks} />
                </AnimatePresence>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      
      <Tooltip id="theme-tooltip" />
      <Tooltip id="install-tooltip" />
    </div>
  )
}

export default App
