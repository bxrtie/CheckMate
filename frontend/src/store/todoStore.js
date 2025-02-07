import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { db } from '../firebase'
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { differenceInDays } from 'date-fns'

const TASK_AUTO_DELETE_DAYS = 7

const checkNotificationPermission = async () => {
  if (!('Notification' in window)) return false
  
  if (Notification.permission === 'granted') return true
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }
  
  return false
}

const scheduleNotification = async (task) => {
  if (!task.dueDate || !await checkNotificationPermission()) return

  const now = new Date()
  const dueDate = new Date(task.dueDate)
  const timeUntilDue = dueDate.getTime() - now.getTime()

  if (timeUntilDue <= 0) return

  // Schedule notification for 1 hour before due date
  const notificationTime = timeUntilDue - (60 * 60 * 1000)
  if (notificationTime > 0) {
    setTimeout(() => {
      new Notification('Task Due Soon', {
        body: `The task "${task.title}" is due in 1 hour`,
        icon: '/favicon.ico'
      })
    }, notificationTime)
  }
}

const syncWithGoogleCalendar = async (task) => {
  if (!task.completed || !window.gapi?.client?.calendar) return

  try {
    const event = {
      summary: `Completed: ${task.title}`,
      description: `Task completed on ${new Date().toLocaleDateString()}`,
      start: {
        dateTime: new Date().toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: new Date(Date.now() + 30 * 60000).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    }

    await window.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event
    })
  } catch (error) {
    console.error('Error syncing with Google Calendar:', error)
  }
}

const cleanupCompletedTasks = (tasks) => {
  const now = new Date()
  return tasks.filter(task => {
    if (!task.completed) return true
    const completedDate = new Date(task.completedAt || now)
    return differenceInDays(now, completedDate) < TASK_AUTO_DELETE_DAYS
  })
}

const useTodoStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      darkMode: false,
      autoDeleteEnabled: true,
      googleCalendarSync: false,
      addTask: async (task) => {
        const newTask = { 
          ...task, 
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }

        set((state) => ({
          tasks: [...state.tasks, newTask],
        }))

        if (task.dueDate) scheduleNotification(newTask)

        // Sync with Firestore if user is authenticated
        try {
          const user = get().user
          if (user) {
            await addDoc(collection(db, `users/${user.uid}/tasks`), newTask)
          }
        } catch (error) {
          console.error('Error adding task to Firestore:', error)
        }
      },
      updateTask: async (id, updatedFields) => {
        set((state) => {
          const updatedTasks = state.tasks.map((task) => {
            if (task.id === id) {
              const updatedTask = { 
                ...task, 
                ...updatedFields,
                ...(updatedFields.completed && !task.completed 
                  ? { completedAt: new Date().toISOString() } 
                  : {})
              }
              
              if (updatedFields.dueDate) scheduleNotification(updatedTask)
              if (updatedFields.completed && state.googleCalendarSync) {
                syncWithGoogleCalendar(updatedTask)
              }
              
              return updatedTask
            }
            return task
          })

          // Clean up old completed tasks if enabled
          const finalTasks = state.autoDeleteEnabled 
            ? cleanupCompletedTasks(updatedTasks)
            : updatedTasks

          return { tasks: finalTasks }
        })

        // Sync with Firestore if user is authenticated
        try {
          const user = get().user
          if (user) {
            const taskRef = doc(db, `users/${user.uid}/tasks/${id}`)
            await updateDoc(taskRef, updatedFields)
          }
        } catch (error) {
          console.error('Error updating task in Firestore:', error)
        }
      },
      deleteTask: async (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }))

        // Delete from Firestore if user is authenticated
        try {
          const user = get().user
          if (user) {
            const taskRef = doc(db, `users/${user.uid}/tasks/${id}`)
            await deleteDoc(taskRef)
          }
        } catch (error) {
          console.error('Error deleting task from Firestore:', error)
        }
      },
      reorderTasks: (tasks) => set({ tasks }),
      toggleDarkMode: () =>
        set((state) => ({
          darkMode: !state.darkMode,
        })),
      toggleAutoDelete: () =>
        set((state) => ({
          autoDeleteEnabled: !state.autoDeleteEnabled,
        })),
      toggleGoogleCalendarSync: () =>
        set((state) => ({
          googleCalendarSync: !state.googleCalendarSync,
        })),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'todo-storage',
    }
  )
)

export default useTodoStore
