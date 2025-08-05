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

  // Typing animation for system messages
  useEffect(() => {
    if (message.role === 'system' && message.typing) {
      setIsTyping(true);
      setDisplayedContent('');
      
      let index = 0;
      const typingSpeed = 30; // milliseconds per character
      
      const typeText = () => {
        if (index < message.content.length) {
          setDisplayedContent(message.content.slice(0, index + 1));
          index++;
          setTimeout(typeText, typingSpeed);
        } else {
          setIsTyping(false);
        }
      };
      
      setTimeout(typeText, 100);
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
          : 'bg-system-bubble text-text-primary'
        }
        shadow-sm
      `}>
        {/* Message Content */}
        <div className="whitespace-pre-wrap">
          {displayedContent}
          {isTyping && (
            <span className="inline-block w-2 h-5 bg-text-primary ml-1 animate-pulse" />
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