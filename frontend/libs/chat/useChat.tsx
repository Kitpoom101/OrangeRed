import { useEffect, useState, useCallback } from 'react';
import Pusher from 'pusher-js';

export interface User {
  _id?: string;
  name?: string;
  profilePicture?: string | null;
}

export interface HistoryEntry {
    text: string;
    editedAt: string;
}

export interface Message {
    _id: string;
    text: string;
    user: User;
    createdAt: string;
    editedAt?: string;
    history?: HistoryEntry[];
    deleted?: boolean;
    room: string;
}

export interface UseChatReturn {
    messages: Message[];
    loading: boolean;
    error: string | null;
    sendMessage: (text: string) => Promise<void>;
    editMessage: (id: string, text: string) => Promise<void>;
    deleteMessage: (id: string) => Promise<void>;
}

export default function useChat(roomId: string, token?:string, currentUser?: User): UseChatReturn {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId || !token) {
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

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string
    });
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

    channel.bind('messageUpdated', (updatedMsg: Message) => {
    setMessages(prev =>
        prev.map(m => m._id === updatedMsg._id ? updatedMsg : m)
      );
    });

    channel.bind('messageDeleted', ({ _id }: { _id: string }) => {
      setMessages(prev => prev.map(m => m._id === _id ? { ...m, deleted: true } : m));
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(roomId);
      pusher.disconnect();
    };
  }, [roomId, token]);

  const sendMessage = useCallback(async (text: string): Promise<void> => {
    const optimisticMsg: Message = {
        _id: `temp-${Date.now()}`,
        text,
        user: { _id: currentUser?._id, name: currentUser?.name, profilePicture: currentUser?.profilePicture },
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

  const editMessage = async (id: string, text: string) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg._id !== id) return msg;
        return {
          ...msg,
          text,
          editedAt: new Date().toISOString(),
          history: [
            ...(msg.history || []),
            { text: msg.text, editedAt: msg.editedAt || msg.createdAt }
          ]
        };
      })
    );

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/messages/${id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({ text })
    });
    const data = res.json();
  };

  const deleteMessage = async (id: string) => {
    setMessages(prev => prev.map(m => m._id === id ? { ...m, deleted: true } : m));
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/messages/${id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      credentials: 'include'
    });
  };

  return { messages, loading, error, sendMessage, editMessage, deleteMessage };
}