declare module "@rails/actioncable" {
    export interface Subscription {
      unsubscribe: () => void;
      perform: (action: string, data?: Record<string, any>) => void;
    }
  
    export interface Subscriptions {
      create: (
        channel: string | { channel: string; [key: string]: any },
        callbacks: {
          connected?: () => void;
          disconnected?: () => void;
          received: (data: any) => void;
          rejected?: () => void;
        }
      ) => Subscription;
    }
  
    export interface Consumer {
      subscriptions: Subscriptions;
      disconnect: () => void;
    }
  
    export function createConsumer(url?: string): Consumer;
  }