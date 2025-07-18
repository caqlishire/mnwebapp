'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ShareIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface CollaborationUser {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: Date;
}

interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'meeting' | 'task';
  metadata?: any;
}

interface CollaborationSession {
  id: string;
  name: string;
  participants: CollaborationUser[];
  messages: ChatMessage[];
  activeDocument?: string;
  meetingActive: boolean;
}

const mockUsers: CollaborationUser[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    role: 'Medical Director',
    avatar: '/api/placeholder/40/40',
    status: 'online',
    lastSeen: new Date()
  },
  {
    id: '2',
    name: 'Suhura Abdulahi',
    role: 'Program Manager',
    avatar: '/api/placeholder/40/40',
    status: 'online',
    lastSeen: new Date()
  },
  {
    id: '3',
    name: 'Abshir Ali',
    role: 'Care Coordinator',
    avatar: '/api/placeholder/40/40',
    status: 'away',
    lastSeen: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    id: '4',
    name: 'Lisa Rodriguez',
    role: 'Social Worker',
    avatar: '/api/placeholder/40/40',
    status: 'busy',
    lastSeen: new Date()
  }
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    userId: '1',
    content: 'Good morning team! Ready for our care plan review?',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: 'text'
  },
  {
    id: '2',
    userId: '2',
    content: 'Yes, I have the updated assessments ready for review.',
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    type: 'text'
  },
  {
    id: '3',
    userId: '3',
    content: 'Starting video call for resident care coordination',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    type: 'meeting',
    metadata: { meetingId: 'care-coordination-001' }
  }
];

export default function RealTimeCollaboration() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'meeting' | 'documents'>('chat');
  const [session] = useState<CollaborationSession>({
    id: '1',
    name: 'Care Team Collaboration',
    participants: mockUsers,
    messages: mockMessages,
    meetingActive: false
  });
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      // Simulate real-time activity
      const interval = setInterval(() => {
        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        const activities = [
          'is viewing a document',
          'joined the session',
          'updated care plan',
          'scheduled a meeting'
        ];
        
        // Randomly show typing indicator
        if (Math.random() < 0.3) {
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 2000);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        userId: 'current-user',
        content: newMessage,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Collaboration Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          boxShadow: isOpen 
            ? '0 0 30px rgba(59, 130, 246, 0.5)' 
            : '0 8px 32px rgba(59, 130, 246, 0.3)'
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <XMarkIcon className="w-8 h-8 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="collaboration"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <UserGroupIcon className="w-8 h-8 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Notification Badge */}
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-white text-xs font-bold">3</span>
        </motion.div>
      </motion.button>

      {/* Collaboration Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-24 right-6 z-40 w-96 h-[32rem] bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <UserGroupIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">Team Collaboration</h3>
                    <p className="text-sm opacity-90">
                      {session.participants.filter(p => p.status === 'online').length} online
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-gray-100/10 backdrop-blur-sm">
              {[
                { key: 'chat', label: 'Chat', icon: ChatBubbleLeftRightIcon },
                { key: 'meeting', label: 'Meeting', icon: VideoCameraIcon },
                { key: 'documents', label: 'Files', icon: DocumentTextIcon }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 p-3 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-white/20 text-white border-b-2 border-blue-400'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </div>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {activeTab === 'chat' && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full flex flex-col"
                  >
                    {/* Chat Messages */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50/5">
                      <div className="space-y-3">
                        {messages.map((message) => {
                          const user = session.participants.find(p => p.id === message.userId);
                          const isOwnMessage = message.userId === 'current-user';
                          
                          return (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-xs ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                                <div className={`p-3 rounded-lg ${
                                  isOwnMessage 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white/80 text-gray-800'
                                }`}>
                                  {!isOwnMessage && (
                                    <div className="text-xs font-medium mb-1 text-blue-600">
                                      {user?.name}
                                    </div>
                                  )}
                                  <div className="text-sm">{message.content}</div>
                                  <div className={`text-xs mt-1 ${
                                    isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                                  }`}>
                                    {formatTime(message.timestamp)}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                        
                        {/* Typing Indicator */}
                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-start"
                          >
                            <div className="bg-white/80 p-3 rounded-lg">
                              <div className="flex items-center gap-2">
                                <div className="flex space-x-1">
                                  <motion.div
                                    className="w-2 h-2 bg-gray-400 rounded-full"
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                                  />
                                  <motion.div
                                    className="w-2 h-2 bg-gray-400 rounded-full"
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                                  />
                                  <motion.div
                                    className="w-2 h-2 bg-gray-400 rounded-full"
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500">typing...</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </div>

                    {/* Message Input */}
                    <div className="p-4 bg-white/5 backdrop-blur-sm border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          placeholder="Type a message..."
                          className="flex-1 p-2 bg-white/10 rounded-lg text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:border-blue-400"
                        />
                        <motion.button
                          onClick={sendMessage}
                          className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <PaperAirplaneIcon className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'meeting' && (
                  <motion.div
                    key="meeting"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full p-4 bg-gray-50/5"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <VideoCameraIcon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">Video Meeting</h3>
                      <p className="text-gray-300 text-sm mb-6">
                        Connect with your care team for real-time collaboration
                      </p>
                      
                      <div className="space-y-3">
                        <motion.button
                          className="w-full p-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <VideoCameraIcon className="w-5 h-5" />
                            Start Video Call
                          </div>
                        </motion.button>
                        
                        <motion.button
                          className="w-full p-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <MicrophoneIcon className="w-5 h-5" />
                            Join Audio Only
                          </div>
                        </motion.button>
                      </div>
                      
                      <div className="mt-6 p-3 bg-white/10 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <CalendarIcon className="w-4 h-4" />
                          Next meeting: Care Plan Review - 2:00 PM
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'documents' && (
                  <motion.div
                    key="documents"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full p-4 bg-gray-50/5"
                  >
                    <div className="space-y-3">
                      {[
                        { name: 'Care Plan - John Smith', type: 'PDF', modified: '2 hours ago', status: 'updated' },
                        { name: 'Medical Assessment', type: 'DOC', modified: '1 day ago', status: 'reviewed' },
                        { name: 'Progress Notes', type: 'PDF', modified: '3 days ago', status: 'shared' },
                        { name: 'Emergency Contacts', type: 'XLS', modified: '1 week ago', status: 'current' }
                      ].map((doc, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <DocumentTextIcon className="w-5 h-5 text-blue-400" />
                              <div>
                                <div className="text-sm font-medium text-white">{doc.name}</div>
                                <div className="text-xs text-gray-300">{doc.type} • {doc.modified}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {doc.status === 'updated' && (
                                <ExclamationCircleIcon className="w-4 h-4 text-yellow-500" />
                              )}
                              {doc.status === 'reviewed' && (
                                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                              )}
                              <ShareIcon className="w-4 h-4 text-gray-400 hover:text-white" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Online Users */}
            <div className="p-3 bg-white/5 backdrop-blur-sm border-t border-white/10">
              <div className="flex items-center gap-2 overflow-x-auto">
                {session.participants.map((user) => (
                  <div key={user.id} className="flex items-center gap-2 min-w-0">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-white`} />
                    </div>
                    <div className="text-xs text-gray-300 truncate">
                      {user.name.split(' ')[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}