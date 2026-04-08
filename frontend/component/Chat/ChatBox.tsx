import { Message } from "@/libs/chat/useChat";
import { useEffect, useState, KeyboardEvent, useRef } from "react";

interface ChatBoxProps{
  editMessage: (id: string, text: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  msg: Message;
  uid?: string;
}
export default function ChatBox({msg, editMessage, deleteMessage, uid}: ChatBoxProps){
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(msg.text);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!text.trim()) return;
    await editMessage(msg._id, text);
    setIsEditing(false);
  };

  useEffect(() => {
    setText(msg.text);
  }, [msg.text]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleSave();
  };

  return (
    <div className="mb-2">
      <b>{msg.user.name}</b>:

      {isEditing ? (
        <>
          <input
            ref={inputRef}
            className="border ml-2 px-1 text-sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSave} className="ml-2 text-green-400">Save</button>
          <button onClick={() => setIsEditing(false)} className="ml-1 text-gray-400">Cancel</button>
        </>
      ) : (
        <>
          <span className="ml-2">{msg.text}</span>

          {msg.user._id === uid && (
            <>
              <button
                className="ml-2 hover:text-green-300"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                className="ml-2 hover:text-red-400"
                onClick={() => deleteMessage(msg._id)}
              >
                Delete
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}