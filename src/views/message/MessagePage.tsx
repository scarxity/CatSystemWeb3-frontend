"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, MoreVertical, Paperclip, Send, Smile, Phone, Video, Info } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  time: string;
}

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Dr. Sarah Vet",
    avatar: "https://i.pravatar.cc/150?u=1",
    lastMessage: "Of course, here it is...",
    time: "10:42 AM",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Michael (Cat Sitter)",
    avatar: "https://i.pravatar.cc/150?u=2",
    lastMessage: "Luna ate all her food this morning!",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: "3",
    name: "MeowMart Support",
    avatar: "https://i.pravatar.cc/150?u=3",
    lastMessage: "Your order has been shipped.",
    time: "Tuesday",
    unread: 0,
    online: true,
  },
  {
    id: "4",
    name: "Alice (Breeder)",
    avatar: "https://i.pravatar.cc/150?u=4",
    lastMessage: "Here are the photos of the kittens.",
    time: "Monday",
    unread: 0,
    online: false,
  },
];

const mockMessages: Record<string, Message[]> = {
  "1": [
    { id: "m1", text: "Hello! I have the results from Luna's recent health checkup.", senderId: "1", time: "10:30 AM" },
    { id: "m2", text: "Great, how is she doing?", senderId: "me", time: "10:32 AM" },
    { id: "m3", text: "Everything looks perfectly normal. Her blood type is confirmed as Type A, and no genetic anomalies were found.", senderId: "1", time: "10:35 AM" },
    { id: "m4", text: "That's such a relief to hear! Thank you Dr. Sarah.", senderId: "me", time: "10:36 AM" },
    { id: "m5", text: "You're very welcome. Let me know if you need any dietary recommendations.", senderId: "1", time: "10:38 AM" },
    { id: "m6", text: "Actually, could you send me a link to that premium salmon mix you mentioned last time?", senderId: "me", time: "10:40 AM" },
    { id: "m7", text: "Of course, here it is...", senderId: "1", time: "10:42 AM" },
  ]
};

export default function MessagePage() {
  const [activeContactId, setActiveContactId] = useState<string>("1");
  const [newMessage, setNewMessage] = useState("");

  const activeContact = mockContacts.find(c => c.id === activeContactId);
  const activeMessages = mockMessages[activeContactId] || [];

  return (
    <div className="flex w-full bg-white shadow-sm overflow-hidden md:rounded-2xl border border-gray-100 h-full">
      {/* Left Sidebar - Contact List */}
      <div className={`w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-gray-200 flex flex-col bg-gray-50/50 ${activeContactId ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Messages</h2>
          <button type="button" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
            <MoreVertical size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 bg-white">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>
        </div>

        {/* Contacts */}
        <div className="flex-1 overflow-y-auto">
          {mockContacts.map(contact => (
            <button 
              type="button"
              key={contact.id}
              onClick={() => setActiveContactId(contact.id)}
              className={`flex w-full text-left items-center p-4 cursor-pointer transition-colors border-b border-gray-100 last:border-0 ${activeContactId === contact.id ? 'bg-blue-50' : 'hover:bg-gray-100 bg-white'}`}
            >
              <div className="relative flex-shrink-0 mr-4">
                <Image src={contact.avatar} alt={contact.name} width={48} height={48} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                {contact.online && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{contact.name}</h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{contact.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className={`text-sm truncate ${contact.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    {contact.lastMessage}
                  </p>
                  {contact.unread > 0 && (
                    <span className="ml-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Content - Chat Window */}
      {activeContact ? (
        <div className={`flex-1 flex flex-col bg-[#F8F9FA] relative ${!activeContactId ? 'hidden md:flex' : 'flex'}`}>
          {/* Chat Header */}
          <div className="h-16 px-4 flex justify-between items-center bg-white border-b border-gray-200 shadow-sm z-10 flex-shrink-0">
            <div className="flex items-center">
              <button 
                type="button"
                className="md:hidden mr-3 text-gray-500 hover:text-gray-700"
                onClick={() => setActiveContactId("")}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><title>Close</title><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div className="relative mr-3">
                <Image src={activeContact.avatar} alt={activeContact.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
                {activeContact.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">{activeContact.name}</h3>
                <p className="text-xs text-green-600 font-medium">{activeContact.online ? 'Online' : 'Offline'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <button type="button" className="p-2 hover:bg-gray-100 rounded-full transition"><Phone size={18} /></button>
              <button type="button" className="p-2 hover:bg-gray-100 rounded-full transition"><Video size={18} /></button>
              <button type="button" className="p-2 hover:bg-gray-100 rounded-full transition"><Info size={18} /></button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex justify-center my-4">
              <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Today</span>
            </div>
            
            {activeMessages.length > 0 ? activeMessages.map(msg => {
              const isMe = msg.senderId === "me";
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {!isMe && (
                    <Image src={activeContact.avatar} alt={activeContact.name} width={32} height={32} className="w-8 h-8 rounded-full mr-2 self-end mb-1" />
                  )}
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                    <div 
                      className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                        isMe 
                          ? 'bg-blue-600 text-white rounded-br-sm' 
                          : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[11px] text-gray-400 mt-1 px-1">{msg.time}</span>
                  </div>
                </div>
              );
            }) : (
              <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                No messages yet. Send a message to start the conversation!
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-end bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all p-1 shadow-inner">
              <button type="button" className="p-3 text-gray-400 hover:text-gray-600 transition flex-shrink-0">
                <Smile size={20} />
              </button>
              <button type="button" className="p-3 text-gray-400 hover:text-gray-600 transition flex-shrink-0">
                <Paperclip size={20} />
              </button>
              <textarea 
                rows={1}
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full bg-transparent py-3 px-2 text-sm outline-none resize-none max-h-32 text-gray-700"
                style={{ minHeight: '44px' }}
              />
              <button 
                type="button"
                className={`p-3 m-1 rounded-xl flex-shrink-0 transition-colors ${
                  newMessage.trim() ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-400'
                }`}
              >
                <Send size={18} className={newMessage.trim() ? 'translate-x-0.5' : ''} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#F8F9FA] text-gray-400 hidden md:flex">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
            <svg className="w-10 h-10 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <title>Chat Icon</title>
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-600">Your Messages</h3>
          <p className="text-sm">Select a chat to view conversations</p>
        </div>
      )}
    </div>
  );
}
