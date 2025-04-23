// lib/action-cable.ts
import { createConsumer } from "@rails/actioncable";

let consumerInstance

export default function getConsumer(token) {
  if (!consumerInstance) {
    const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:3000/cable";
    const url = token ? `${wsUrl}?token=${encodeURIComponent(token)}` : wsUrl;
    consumerInstance = createConsumer(url);
  }
  return consumerInstance;
}

export function resetConsumer() {
  if (consumerInstance) {
    // Disconnect the entire consumer which will clean up all subscriptions
    consumerInstance.disconnect();
    consumerInstance = null;
  }
}