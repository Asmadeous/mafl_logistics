// Browser-compatible ActionCable implementation with JWT authentication
import { createConsumer as railsCreateConsumer } from "@rails/actioncable"

// Define types for our implementation
interface Subscription {
  unsubscribe: () => void
  perform?: (action: string, data?: any) => void
  received?: (callback: any) => void
}

interface Consumer {
  subscriptions: {
    create: (channel: string | Record<string, any>, callbacks?: Record<string, any>) => Subscription
  }
  disconnect: () => void
}

// Create ActionCable consumer with JWT authentication
export function createConsumer(url?: string): Consumer {
  // Get the JWT token from localStorage
  const token = localStorage.getItem("authToken")
  const guestToken = localStorage.getItem("guestToken")

  // Create the WebSocket URL with the token
  const wsUrl = url || process.env.NEXT_PUBLIC_CABLE_URL || "/cable"
  let wsUrlWithToken = wsUrl

  // Add authentication token if available
  if (token) {
    wsUrlWithToken = `${wsUrl}?jwt=${token}`
  } else if (guestToken) {
    wsUrlWithToken = `${wsUrl}?guest_token=${guestToken}`
  }

  // Create the consumer
  return railsCreateConsumer(wsUrlWithToken)
}

// Create a channel with the given name and options
export function createChannel(channelName: string, options: Record<string, any> = {}) {
  const consumer = createConsumer()

  // Create a subscription with the channel name and options combined
  const channel = consumer.subscriptions.create({ channel: channelName, ...options }, {})

  return channel
}

// Disconnect all subscriptions and the consumer
export function disconnectActionCable() {
  console.log("Disconnecting all ActionCable connections")
  // In a real implementation, this would disconnect the WebSocket
  if (consumerInstance) {
    consumerInstance.disconnect()
    consumerInstance = null
  }
}

// Create a singleton consumer instance
let consumerInstance: Consumer | null = null

export function getConsumer(): Consumer {
  if (!consumerInstance) {
    consumerInstance = createConsumer()
  }
  return consumerInstance
}

// Export default object with all functions
export default {
  createConsumer,
  createChannel,
  disconnectActionCable,
  getConsumer,
}
