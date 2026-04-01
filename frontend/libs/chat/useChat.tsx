import { useEffect, useState, useCallback } from 'react';
import Pusher from 'pusher-js';

interface User {
  _id?: string;
  name?: string;
}

interface Message {
    _id: string;
    text: string;
    user: User;
    createdAt: string;
    room: string;
}

interface UseChatReturn {
    messages: Message[];
    loading: boolean;
    error: string | null;
    sendMessage: (text: string) => Promise<void>;
}

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string
});

export default function useChat(roomId: string, token?:string, currentUser?: User): UseChatReturn {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/messages/${roomId}`, {
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch messages");
        }

        setMessages(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      } finally {
        setLoading(false);
        }
    };

    fetchMessages();

    const channel = pusher.subscribe(roomId);
    channel.bind('receiveMessage', (newMessage: Message) => {
      setMessages(prev => {
        // Skip if we already have this message (by _id or temp match)
        const isDuplicate = prev.some(
            msg => msg._id === newMessage._id ||
            (msg.text === newMessage.text && msg._id.startsWith('temp-'))
        );
        if (isDuplicate) {
            // Replace the temp message with the real one from server
            return prev.map(msg =>
                msg._id.startsWith('temp-') && msg.text === newMessage.text
                    ? newMessage
                    : msg
            );
        }
        return [...prev, newMessage];
      });
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(roomId);
    };
  }, [roomId]);

  const sendMessage = useCallback(async (text: string): Promise<void> => {
    const optimisticMsg: Message = {
        _id: `temp-${Date.now()}`,
        text,
        user: { _id: 'me', name: 'You' },
        createdAt: new Date().toISOString(),
        room: roomId,
    };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/messages`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ roomId, text })
      });
    } catch (err) {
      setMessages(prev => prev.filter(msg => msg._id !== optimisticMsg._id));
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  }, [roomId]);

  return { messages, loading, error, sendMessage };
}