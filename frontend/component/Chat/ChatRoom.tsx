import { useState, KeyboardEvent } from 'react';
import useChat from '@/libs/chat/useChat';

interface ChatProps {
    roomId: string;
}

function ChatBox({ roomId }: ChatProps) {
    const [input, setInput] = useState<string>('');
    const { messages, loading, error, sendMessage } = useChat(roomId);

    const handleSend = async (): Promise<void> => {
        if (!input.trim()) return;
        await sendMessage(input);
        setInput('');
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') handleSend();
    };

    if (loading) return <p>Loading messages...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            {messages.map((msg) => (
                <p key={msg._id}>
                    <b>{msg.user.name}:</b> {msg.text}
                </p>
            ))}
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
}

export default ChatBox;