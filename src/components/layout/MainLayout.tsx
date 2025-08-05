import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar, { ChatHistoryItem } from './Sidebar';
import ChatInterface, { Message, FileAttachment } from '../chat/ChatInterface';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTool, setCurrentTool] = useState<string>('general');

  // Mock chat history data
  const [chatHistory] = useState<ChatHistoryItem[]>([
    {
      id: '1',
      title: 'Software Engineer Resume Review',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      tool: 'resume',
    },
    {
      id: '2',
      title: 'Frontend Developer Interview Prep',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      tool: 'interview',
    },
    {
      id: '3',
      title: 'Google Cover Letter - Product Manager',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      tool: 'cover-letter',
    },
    {
      id: '4',
      title: 'React Portfolio Website',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      tool: 'portfolio',
    },
  ]);

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(undefined);
    setCurrentTool('general');
    setSidebarOpen(false); // Close sidebar on mobile
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    // Mock loading previous chat messages
    const mockMessages: Message[] = [
      {
        id: '1',
        content: 'Hello! How can I help you today?',
        role: 'system',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
      },
      {
        id: '2',
        content: 'I need help improving my resume for a software engineering position.',
        role: 'user',
        timestamp: new Date(Date.now() - 9 * 60 * 1000),
      },
    ];
    setMessages(mockMessages);
    setSidebarOpen(false); // Close sidebar on mobile
  };

  const handleSelectTool = (tool: string) => {
    setCurrentTool(tool);
    setCurrentChatId(undefined);
    
    // Load tool-specific welcome message
    const toolMessages: Record<string, Message> = {
      resume: {
        id: 'welcome-resume',
        content: `Welcome to the Resume Enhancer! 📄

I'll help you improve your resume for better ATS compatibility and overall impact. Here's what I can do:

• Analyze formatting and structure
• Optimize keywords for specific roles
• Improve content clarity and impact
• Ensure ATS compliance
• Suggest better action words and quantifiable achievements

Please upload your resume (PDF or DOCX) to get started, or tell me about the role you're targeting.`,
        role: 'system',
        timestamp: new Date(),
        typing: true,
      },
      interview: {
        id: 'welcome-interview',
        content: `Welcome to the Interview Coach! 🎯

I'll help you prepare for your upcoming interviews with personalized practice sessions. Here's how it works:

• Tell me the role you're interviewing for
• Choose specific topics to focus on (technical, behavioral, company-specific)
• I'll ask realistic interview questions
• Get real-time feedback on your responses
• Track which key points you've covered

What role are you preparing for? (e.g., "Frontend Developer", "Product Manager", "Data Scientist")`,
        role: 'system',
        timestamp: new Date(),
        typing: true,
      },
      'cover-letter': {
        id: 'welcome-cover-letter',
        content: `Welcome to the Cover Letter Writer! ✍️

I'll help you create compelling, personalized cover letters that stand out. Here's what I need:

• Your resume (for experience and background)
• The job description you're applying for
• Any specific company information or requirements

I'll craft a cover letter that:
• Matches keywords from the job description
• Highlights relevant experiences
• Shows genuine interest in the company
• Maintains a professional yet engaging tone

Please upload your resume and paste the job description to get started.`,
        role: 'system',
        timestamp: new Date(),
        typing: true,
      },
      portfolio: {
        id: 'welcome-portfolio',
        content: `Welcome to the Portfolio Builder! 🚀

I'll help you create a professional portfolio that showcases your work effectively. Here's the process:

• Share details about your projects (title, technologies, description)
• Upload screenshots or images if you have them
• I'll rewrite descriptions professionally
• Generate a mini portfolio website with optimized layout
• Ensure your work is presented in the best light

Tell me about your first project, or describe what kind of portfolio you want to create (e.g., "Web Developer Portfolio", "UX Designer Portfolio").`,
        role: 'system',
        timestamp: new Date(),
        typing: true,
      },
    };

    if (toolMessages[tool]) {
      setMessages([toolMessages[tool]]);
    } else {
      setMessages([]);
    }
    
    setSidebarOpen(false); // Close sidebar on mobile
  };

  const handleSendMessage = (content: string, files?: FileAttachment[]) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
      files,
    };

    setMessages(prev => [...prev, userMessage]);

    // Mock AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Thank you for your message. This is a mock response for the ${currentTool} tool. In a real implementation, this would be connected to an AI service that provides relevant assistance based on the selected tool.`,
        role: 'system',
        timestamp: new Date(),
        typing: true,
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleFileUpload = (files: FileList) => {
    console.log('Files uploaded:', files);
    // Handle file upload logic here
  };

  const getPlaceholder = () => {
    const placeholders: Record<string, string> = {
      resume: 'Describe your target role or upload your resume...',
      interview: 'Tell me about the role you\'re interviewing for...',
      'cover-letter': 'Paste the job description or describe the role...',
      portfolio: 'Describe your project or what you want to showcase...',
      general: 'Ask me anything about your career...',
    };
    return placeholders[currentTool] || placeholders.general;
  };

  const shouldShowFileUpload = () => {
    return ['resume', 'cover-letter', 'portfolio'].includes(currentTool);
  };

  return (
    <div className="h-screen bg-background font-inter">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-sidebar-bg">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(true)}
          className="text-text-primary"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold text-text-primary">Matrixx</h1>
        <div className="w-8" /> {/* Spacer */}
      </div>

      <div className="flex h-full md:h-screen">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          chatHistory={chatHistory}
          currentChatId={currentChatId}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onSelectTool={handleSelectTool}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUpload}
            placeholder={getPlaceholder()}
            showFileUpload={shouldShowFileUpload()}
            acceptedFileTypes={currentTool === 'resume' || currentTool === 'cover-letter' ? '.pdf,.docx,.txt' : '.pdf,.jpg,.png,.gif'}
          />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;