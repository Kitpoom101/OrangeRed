import { useState, KeyboardEvent } from 'react';
import useChat from '@/libs/chat/useChat';
import { useSession } from 'next-auth/react';
import ChatBox from './ChatBox';

interface ChatProps {
    roomId: string;
}

function ChatRoom({ roomId }: ChatProps) {
    const [input, setInput] = useState<string>('');
		const { data:session } = useSession();
    const { messages, loading, error, sendMessage, editMessage, deleteMessage } = useChat(roomId, session?.user.token, {_id:session?.user._id, name:session?.user.name});

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
    <div className="flex flex-col h-full">
			<div className="flex-1 overflow-y-auto p-2">
				{messages.map((msg) => (
					<ChatBox key={msg._id} msg={msg} editMessage={editMessage} deleteMessage={deleteMessage} uid={session?.user._id}/>
				))}
			</div>
			<div className="p-2 border-t border-gray-200 flex gap-2">
				<input
				className="flex-1 border rounded px-2 py-1 text-sm"
				value={input}
				onChange={e => setInput(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Type a message..."
				/>
				<button className="bg-blue-500 text-white px-3 py-1 rounded text-sm" onClick={handleSend}>
					Send
				</button>
			</div>
    </div>
    );
}

export default ChatRoom;