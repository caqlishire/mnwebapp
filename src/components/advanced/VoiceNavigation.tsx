'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MicrophoneIcon,
  SpeakerWaveIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
}

export default function VoiceNavigation() {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const router = useRouter();

  const voiceCommands: VoiceCommand[] = [
    {
      command: 'go home',
      action: () => router.push('/'),
      description: 'Navigate to homepage'
    },
    {
      command: 'about us',
      action: () => router.push('/about'),
      description: 'Go to about page'
    },
    {
      command: 'our services',
      action: () => router.push('/services'),
      description: 'View our services'
    },
    {
      command: 'locations',
      action: () => router.push('/locations'),
      description: 'Find our locations'
    },
    {
      command: 'make referral',
      action: () => router.push('/referrals'),
      description: 'Make a referral'
    },
    {
      command: 'contact us',
      action: () => router.push('/contact'),
      description: 'Contact information'
    },
    {
      command: 'call now',
      action: () => window.open('tel:9525941288', '_self'),
      description: 'Call our main number'
    },
    {
      command: 'help',
      action: () => setShowCommands(true),
      description: 'Show available commands'
    },
    {
      command: 'stop listening',
      action: () => stopListening(),
      description: 'Stop voice navigation'
    }
  ];

  useEffect(() => {
    // Check if Speech Recognition is supported
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              setTranscript(event.results[i][0].transcript);
            }
          }

          if (finalTranscript) {
            processCommand(finalTranscript.toLowerCase().trim());
            setTranscript('');
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setFeedback({ type: 'error', message: 'Voice recognition error. Please try again.' });
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          if (isListening) {
            // Restart if we're supposed to be listening
            try {
              recognitionRef.current.start();
            } catch (error) {
              console.log('Recognition restart failed:', error);
              setIsListening(false);
            }
          }
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const processCommand = (command: string) => {
    const matchedCommand = voiceCommands.find(cmd => 
      command.includes(cmd.command) || 
      cmd.command.split(' ').every(word => command.includes(word))
    );

    if (matchedCommand) {
      setLastCommand(matchedCommand.command);
      setFeedback({ type: 'success', message: `Executing: ${matchedCommand.description}` });
      
      // Add a small delay for visual feedback
      setTimeout(() => {
        matchedCommand.action();
        setFeedback(null);
      }, 1000);
    } else {
      setFeedback({ type: 'error', message: `Command "${command}" not recognized. Say "help" for available commands.` });
      
      // Speak the error message
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(`Command not recognized. Say help for available commands.`);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
      }
    }

    // Clear feedback after 3 seconds
    setTimeout(() => setFeedback(null), 3000);
  };

  const startListening = () => {
    if (recognitionRef.current && isSupported) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setFeedback({ type: 'success', message: 'Voice navigation activated. Say "help" for commands.' });
        
        // Speak welcome message
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance('Voice navigation activated. Say help for available commands.');
          utterance.rate = 0.8;
          utterance.pitch = 1;
          speechSynthesis.speak(utterance);
        }
      } catch (error) {
        console.error('Failed to start recognition:', error);
        setFeedback({ type: 'error', message: 'Failed to start voice recognition.' });
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscript('');
      setFeedback({ type: 'success', message: 'Voice navigation deactivated.' });
    }
  };

  if (!isSupported) {
    return null; // Don't render if not supported
  }

  return (
    <>
      {/* Voice Navigation Toggle Button */}
      <motion.button
        className={`fixed top-20 right-6 z-50 w-12 h-12 rounded-full shadow-xl flex items-center justify-center ${
          isListening 
            ? 'bg-gradient-to-r from-red-500 to-pink-500' 
            : 'bg-gradient-to-r from-green-500 to-blue-500'
        }`}
        onClick={isListening ? stopListening : startListening}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          boxShadow: isListening 
            ? ['0 0 20px rgba(239, 68, 68, 0.5)', '0 0 30px rgba(239, 68, 68, 0.8)', '0 0 20px rgba(239, 68, 68, 0.5)']
            : '0 8px 25px rgba(34, 197, 94, 0.3)'
        }}
        transition={{ 
          boxShadow: { duration: 1.5, repeat: isListening ? Infinity : 0 }
        }}
      >
        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.div
              key="listening"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <MicrophoneIcon className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="not-listening"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <SpeakerWaveIcon className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Real-time transcript display */}
      <AnimatePresence>
        {isListening && transcript && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-36 right-6 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700 max-w-xs"
          >
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Listening: "{transcript}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Messages */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`fixed top-36 right-6 z-40 rounded-lg p-4 shadow-lg max-w-sm ${
              feedback.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-start gap-3">
              {feedback.type === 'success' ? (
                <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <ExclamationCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm font-medium">{feedback.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Commands Help Panel */}
      <AnimatePresence>
        {showCommands && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCommands(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Voice Commands
                </h3>
                <button
                  onClick={() => setShowCommands(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Say any of these commands while voice navigation is active:
                </p>
                
                {voiceCommands.map((cmd, index) => (
                  <motion.div
                    key={cmd.command}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                        "{cmd.command}"
                      </code>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {cmd.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Tip:</strong> Speak clearly and wait for the system to process your command. 
                  You can say "stop listening" to deactivate voice navigation at any time.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Navigation Status Indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed bottom-6 left-6 z-40 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 bg-white rounded-full"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              Voice Navigation Active
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}