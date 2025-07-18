'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  SparklesIcon,
  UserIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  suggestions?: string[];
}

interface QuickAction {
  label: string;
  action: string;
  icon: React.ComponentType<{ className?: string }>;
}

const quickActions: QuickAction[] = [
  { label: 'Schedule Tour', action: 'schedule_tour', icon: ComputerDesktopIcon },
  { label: 'Learn About Services', action: 'services_info', icon: SparklesIcon },
  { label: 'Contact Information', action: 'contact_info', icon: ChatBubbleLeftRightIcon },
  { label: 'Make Referral', action: 'make_referral', icon: UserIcon }
];

const aiResponses = {
  greeting: {
    content: "Hello! I'm your AI assistant for MN Group Home LLC. I can help you with information about our services, scheduling tours, making referrals, or answering any questions you have. How can I assist you today?",
    suggestions: ['Tell me about your services', 'How do I make a referral?', 'Schedule a facility tour', 'What are your locations?']
  },
  services_info: {
    content: "We offer comprehensive residential services including 24-Hour Customized Living, 245D Waiver Services, and Community Residential Services. Each program is designed to support individuals with disabilities in achieving maximum independence. Would you like detailed information about any specific service?",
    suggestions: ['24-Hour Customized Living', '245D Waiver Services', 'Community Residential Services', 'Eligibility requirements']
  },
  schedule_tour: {
    content: "I'd be happy to help you schedule a facility tour! Tours typically last 45 minutes and include meeting with our clinical staff. You can schedule for weekdays between 9 AM - 4 PM. Would you prefer morning or afternoon, and what days work best for you?",
    suggestions: ['Morning availability', 'Afternoon availability', 'This week', 'Next week']
  },
  contact_info: {
    content: "You can reach us at (952) 594-1288 or email info@mngrouphome.com. Our main office is located at 6524 Humboldt Ave S, Richfield, MN 55423. We're available Monday-Friday 8 AM-6 PM, with 24/7 emergency support.",
    suggestions: ['Get directions', 'Emergency contact', 'Email us directly', 'Office hours']
  },
  make_referral: {
    content: "Making a referral is straightforward! You can complete our online referral form, call us directly, or email the necessary information. We'll need basic information about the individual and their support needs. The process typically takes 3-5 business days for initial assessment.",
    suggestions: ['Referral requirements', 'Start online form', 'Call directly', 'Email referral info']
  }
};

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add greeting message when chat opens
      setTimeout(() => {
        addAIMessage('greeting');
      }, 500);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (content: string, type: 'user' | 'ai', suggestions?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      type,
      timestamp: new Date(),
      suggestions
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addAIMessage = (responseKey: keyof typeof aiResponses) => {
    setIsTyping(true);
    setTimeout(() => {
      const response = aiResponses[responseKey];
      addMessage(response.content, 'ai', response.suggestions);
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      addMessage(inputValue, 'user');
      const lowercaseInput = inputValue.toLowerCase();
      
      // Simple keyword matching for AI responses
      if (lowercaseInput.includes('service') || lowercaseInput.includes('program')) {
        addAIMessage('services_info');
      } else if (lowercaseInput.includes('tour') || lowercaseInput.includes('visit')) {
        addAIMessage('schedule_tour');
      } else if (lowercaseInput.includes('contact') || lowercaseInput.includes('phone') || lowercaseInput.includes('email')) {
        addAIMessage('contact_info');
      } else if (lowercaseInput.includes('referral') || lowercaseInput.includes('refer')) {
        addAIMessage('make_referral');
      } else {
        // Default helpful response
        setTimeout(() => {
          addMessage("Thank you for your question! For the most accurate and detailed information, I recommend calling us at (952) 594-1288 or using one of the quick actions below. Our team is ready to provide personalized assistance.", 'ai', ['Call (952) 594-1288', 'Schedule Tour', 'Make Referral', 'View Services']);
        }, 1000);
      }
      
      setInputValue('');
    }
  };

  const handleQuickAction = (action: string) => {
    addAIMessage(action as keyof typeof aiResponses);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => handleSend(), 100);
  };

  const toggleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      setIsListening(!isListening);
      // Voice recognition would be implemented here
    }
  };

  const toggleSpeech = () => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(!isSpeaking);
      // Text-to-speech would be implemented here
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
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
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Interface */}
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">AI Assistant</h3>
                  <p className="text-sm opacity-90">MN Group Home LLC</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <motion.button
                    onClick={toggleSpeech}
                    className={`p-2 rounded-full ${isSpeaking ? 'bg-white/30' : 'bg-white/10'} hover:bg-white/20 transition-colors`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <SpeakerWaveIcon className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 h-80 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`p-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-2'
                          : 'bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-white mr-2 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    
                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.suggestions.map((suggestion, index) => (
                          <motion.button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-blue-600 order-1' 
                      : 'bg-gradient-to-r from-green-400 to-blue-500 order-2'
                  }`}>
                    {message.type === 'user' ? (
                      <UserIcon className="w-4 h-4 text-white" />
                    ) : (
                      <SparklesIcon className="w-4 h-4 text-white" />
                    )}
                  </div>
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start mb-4"
                >
                  <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 border-t border-gray-200 dark:border-gray-700"
              >
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick Actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <motion.button
                      key={action.action}
                      onClick={() => handleQuickAction(action.action)}
                      className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <action.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs text-blue-800 dark:text-blue-200">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask me anything..."
                    className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <motion.button
                    onClick={toggleVoiceInput}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full ${isListening ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200 transition-colors`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <MicrophoneIcon className="w-4 h-4" />
                  </motion.button>
                </div>
                <motion.button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: inputValue.trim() ? 1.05 : 1 }}
                  whileTap={{ scale: inputValue.trim() ? 0.95 : 1 }}
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}