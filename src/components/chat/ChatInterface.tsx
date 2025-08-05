import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import MessageBubble from './MessageBubble';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'system';
  timestamp: Date;
  typing?: boolean;
  files?: FileAttachment[];
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string, files?: FileAttachment[]) => void;
  onFileUpload: (files: FileList) => void;
  isLoading?: boolean;
  placeholder?: string;
  showFileUpload?: boolean;
  acceptedFileTypes?: string;
  maxFileSize?: number;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onFileUpload,
  isLoading = false,
  placeholder = "Type your message...",
  showFileUpload = true,
  acceptedFileTypes = ".pdf,.docx,.txt",
  maxFileSize = 10 * 1024 * 1024, // 10MB
}) => {
  const [inputValue, setInputValue] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<FileAttachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const handleSend = () => {
    if (inputValue.trim() || attachedFiles.length > 0) {
      onSendMessage(inputValue.trim(), attachedFiles);
      setInputValue('');
      setAttachedFiles([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (files: FileList) => {
    const newFiles: FileAttachment[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.size <= maxFileSize) {
        newFiles.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
        });
      }
    });

    setAttachedFiles(prev => [...prev, ...newFiles]);
    onFileUpload(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const removeFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col h-full bg-chat-bg">
      {/* Messages Area */}
      <div 
        className={`flex-1 overflow-y-auto p-4 space-y-6 ${dragOver ? 'bg-accent/20' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag and Drop Overlay */}
        {dragOver && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-system-bubble p-8 rounded-lg border-2 border-dashed border-primary">
              <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
              <p className="text-text-primary text-center font-medium">
                Drop your files here to upload
              </p>
            </div>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                Welcome to Matrixx
              </h2>
              <p className="text-text-muted max-w-md">
                Your AI-powered career platform. Select a tool from the sidebar or start a conversation to get started.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        {/* File Attachments */}
        {attachedFiles.length > 0 && (
          <div className="mb-3 space-y-2">
            {attachedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between bg-system-bubble p-2 rounded">
                <div className="flex items-center space-x-2">
                  <Paperclip className="w-4 h-4 text-text-muted" />
                  <span className="text-sm text-text-primary">{file.name}</span>
                  <span className="text-xs text-text-muted">({formatFileSize(file.size)})</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="text-text-muted hover:text-destructive h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end space-x-2">
          {/* File Upload Button */}
          {showFileUpload && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-text-muted hover:text-text-primary flex-shrink-0"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
          )}

          {/* Text Input */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              className="min-h-[44px] max-h-[120px] resize-none bg-input border-border text-text-primary placeholder:text-text-muted pr-12"
              disabled={isLoading}
            />
            
            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() && attachedFiles.length === 0 || isLoading}
              className="absolute right-2 bottom-2 h-8 w-8 p-0 bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedFileTypes}
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;