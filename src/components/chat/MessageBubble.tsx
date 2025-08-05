import React, { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Message, FileAttachment } from './ChatInterface';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // ChatGPT-style typing animation for system messages
  useEffect(() => {
    if (message.role === 'system' && message.typing) {
      setIsTyping(true);
      setDisplayedContent('');
      
      // Split into words for more natural token-by-token animation
      const words = message.content.split(' ');
      let wordIndex = 0;
      const typingSpeed = 50; // milliseconds per word (more ChatGPT-like)
      
      const typeWords = () => {
        if (wordIndex < words.length) {
          const displayText = words.slice(0, wordIndex + 1).join(' ');
          setDisplayedContent(displayText);
          wordIndex++;
          setTimeout(typeWords, typingSpeed);
        } else {
          setIsTyping(false);
        }
      };
      
      setTimeout(typeWords, 150);
    } else {
      setDisplayedContent(message.content);
    }
  }, [message.content, message.typing, message.role]);

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderFileAttachment = (file: FileAttachment) => (
    <div key={file.id} className="flex items-center space-x-2 bg-background/10 p-2 rounded border border-border/20 mt-2">
      <FileText className="w-4 h-4 text-text-muted" />
      <span className="text-sm text-text-primary flex-1">{file.name}</span>
      {file.url && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-text-muted hover:text-text-primary"
        >
          <Download className="w-3 h-3" />
        </Button>
      )}
    </div>
  );

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`
        max-w-[80%] p-4 rounded-lg
        ${message.role === 'user' 
          ? 'bg-user-bubble text-text-primary' 
          : 'text-text-primary'
        }
      `}>
        {/* Message Content */}
        <div className="whitespace-pre-wrap font-inter text-base leading-relaxed">
          {displayedContent}
          {isTyping && (
            <span className="inline-block w-0.5 h-5 bg-text-primary ml-0.5 animate-pulse" />
          )}
        </div>

        {/* File Attachments */}
        {message.files && message.files.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.files.map(renderFileAttachment)}
          </div>
        )}

        {/* Timestamp */}
        <div className={`text-xs mt-2 ${
          message.role === 'user' ? 'text-right' : 'text-left'
        } text-text-muted`}>
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;