import React, { useState } from 'react';
import { Student } from '../types';
import { X, Send, ShieldAlert } from 'lucide-react';

interface MessagePrototypeModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'peer';
  text: string;
  time: string;
}

export const MessagePrototypeModal: React.FC<MessagePrototypeModalProps> = ({
  student,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !student) return null;

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'peer',
      text: `Hey Alex! Glad we connected on CampusConnect. Are you free this week to compare lecture notes or work through problem sets?`,
      time: '10:24 AM',
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    // Simulated peer reply after 800ms
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: 'peer',
          text: `Awesome, that sounds great! Let's meet at the library 2nd floor whiteboard tables. See you then!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 900);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="message-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={student.avatar}
              alt={student.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-slate-300"
            />
            <div>
              <h3 id="message-modal-title" className="text-sm font-bold text-slate-900 leading-tight">
                {student.name}
              </h3>
              <p className="text-[11px] text-slate-500">
                {student.major} · {student.year.split(',')[0]}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close conversation"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prototype notice pill */}
        <div className="bg-amber-50/80 px-4 py-2 border-b border-amber-200/60 flex items-center gap-2 text-[11px] text-amber-900">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Interactive Prototype: Messages are simulated in local session memory.</span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 px-1 font-mono">
                {m.time}
              </span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${student.name.split(' ')[0]}...`}
            className="flex-1 px-3 py-2 text-xs bg-slate-100 rounded-lg border border-slate-200 focus:bg-white focus:border-blue-500 focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-lg transition-colors"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
