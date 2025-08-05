import React, { useState } from 'react';
import { Plus, FileText, MessageSquare, FileEdit, Briefcase, User, Settings, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: Date;
  tool: 'resume' | 'interview' | 'cover-letter' | 'portfolio' | 'general';
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  chatHistory: ChatHistoryItem[];
  currentChatId?: string;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onSelectTool: (tool: string) => void;
}

const toolIcons = {
  resume: FileText,
  interview: MessageSquare,
  'cover-letter': FileEdit,
  portfolio: Briefcase,
  general: MessageSquare,
};

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  chatHistory,
  currentChatId,
  onNewChat,
  onSelectChat,
  onSelectTool,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const truncateTitle = (title: string, maxLength: number = 40) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed md:relative z-50 h-full bg-sidebar-bg border-r border-border
        transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        w-80 md:w-80 flex flex-col
      `}>
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-text-primary">Matrixx</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="md:hidden text-text-muted hover:text-text-primary"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          
          <Button
            onClick={onNewChat}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Navigation Tools */}
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-medium text-text-muted mb-3 uppercase tracking-wide">
            Tools
          </h3>
          <div className="space-y-1">
            {[
              { id: 'resume', label: 'Resume Enhancer', icon: FileText },
              { id: 'interview', label: 'Interview Coach', icon: MessageSquare },
              { id: 'cover-letter', label: 'Cover Letter Writer', icon: FileEdit },
              { id: 'portfolio', label: 'Portfolio Builder', icon: Briefcase },
            ].map((tool) => (
              <Button
                key={tool.id}
                variant="ghost"
                onClick={() => onSelectTool(tool.id)}
                className="w-full justify-start text-text-primary hover:bg-accent hover:text-accent-foreground transition-all duration-200"
              >
                <tool.icon className="h-4 w-4 mr-3" />
                {tool.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-medium text-text-muted mb-3 uppercase tracking-wide">
            Recent Chats
          </h3>
          <div className="space-y-1">
            {chatHistory.map((chat) => {
              const IconComponent = toolIcons[chat.tool];
              return (
                <Button
                  key={chat.id}
                  variant="ghost"
                  onClick={() => onSelectChat(chat.id)}
                  className={`
                    w-full justify-start p-3 h-auto text-left group
                    ${currentChatId === chat.id ? 'bg-accent text-accent-foreground' : 'text-text-primary hover:bg-accent/50'}
                    transition-all duration-200
                  `}
                  title={chat.title}
                >
                  <div className="flex items-start w-full">
                    <IconComponent className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-text-muted" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium line-clamp-2">
                        {truncateTitle(chat.title)}
                      </div>
                      <div className="text-xs text-text-muted mt-1">
                        {formatTimestamp(chat.timestamp)}
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Profile Section */}
        <div className="p-4 border-t border-border">
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full justify-start text-text-primary hover:bg-accent hover:text-accent-foreground transition-all duration-200"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium">User</div>
                <div className="text-xs text-text-muted">Free Plan</div>
              </div>
            </Button>

            {/* Profile Dropdown */}
            {dropdownOpen && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-popover border border-border rounded-md shadow-lg z-10">
                <div className="p-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm text-popover-foreground hover:bg-accent"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm text-popover-foreground hover:bg-accent"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Manage Plan
                  </Button>
                  <hr className="my-1 border-border" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;