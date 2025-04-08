"use client"

import * as React from "react"

export type ToastProps = {
  id?: string
  title: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive" | "success"
}

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 3000

type ToasterToast = ToastProps & {
  id: string
  createdAt: number
}

type ToasterState = {
  toasts: ToasterToast[]
}

let count = 0

function generateId() {
  return `toast-${count++}`
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: ToasterState, action: any): ToasterState => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toastId ? { ...t, ...action.toast } : t)),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      }
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }

    default:
      return state
  }
}

const listeners: Array<(state: ToasterState) => void> = []

let memoryState: ToasterState = { toasts: [] }

function dispatch(action: any) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id" | "createdAt">

function toast({ ...props }: Toast) {
  const id = props.id || generateId()

  const update = (props: ToastProps) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props },
      toastId: id,
    })

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      createdAt: Date.now(),
    },
  })

  // For client-side only code, create a simple visual toast
  if (typeof window !== "undefined") {
    const toastEl = document.createElement("div")
    toastEl.id = id
    toastEl.className = `fixed bottom-4 right-4 p-4 rounded-md shadow-lg z-50 ${
      props.variant === "destructive" ? "bg-red-600" : props.variant === "success" ? "bg-green-600" : "bg-slate-800"
    } text-white max-w-md animate-in fade-in slide-in-from-bottom-5`

    toastEl.innerHTML = `
      <h3 class="font-medium">${props.title}</h3>
      ${props.description ? `<p class="text-sm opacity-90">${props.description}</p>` : ""}
    `

    document.body.appendChild(toastEl)

    // Remove after delay
    setTimeout(() => {
      toastEl.classList.add("opacity-0", "transition-opacity", "duration-300")
      setTimeout(() => {
        if (document.body.contains(toastEl)) {
          document.body.removeChild(toastEl)
        }
      }, 300)
    }, TOAST_REMOVE_DELAY)
  }

  return {
    id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<ToasterState>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }

