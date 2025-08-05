import React, { useState, useEffect } from 'react';
import { Mic, MicOff, ArrowLeft, ArrowRight, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: number;
  text: string;
  timeLimit: number; // in seconds
}

const mockQuestions: Question[] = [
  {
    id: 1,
    text: "How would you handle a situation where your team misses a deadline?",
    timeLimit: 120
  },
  {
    id: 2,
    text: "Describe a time when you had to learn a new technology quickly. How did you approach it?",
    timeLimit: 120
  },
  {
    id: 3,
    text: "How do you prioritize tasks when everything seems urgent?",
    timeLimit: 120
  },
  {
    id: 4,
    text: "Tell me about a challenging project you worked on and how you overcame obstacles.",
    timeLimit: 120
  },
  {
    id: 5,
    text: "How do you handle feedback and criticism from colleagues or supervisors?",
    timeLimit: 120
  }
];

const InterviewCoach: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(mockQuestions.length).fill(''));
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(mockQuestions[0].timeLimit);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [questionVisible, setQuestionVisible] = useState(false);
  const [displayedQuestion, setDisplayedQuestion] = useState('');

  const currentQuestion = mockQuestions[currentQuestionIndex];

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Question typewriter animation
  useEffect(() => {
    setQuestionVisible(false);
    setDisplayedQuestion('');
    setCurrentAnswer(answers[currentQuestionIndex] || '');
    setTimeLeft(currentQuestion.timeLimit);
    
    setTimeout(() => {
      setQuestionVisible(true);
      let index = 0;
      const text = currentQuestion.text;
      
      const typeWriter = () => {
        if (index < text.length) {
          setDisplayedQuestion(text.slice(0, index + 1));
          index++;
          setTimeout(typeWriter, 50);
        }
      };
      
      typeWriter();
    }, 300);
  }, [currentQuestionIndex, currentQuestion]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (value: string) => {
    setCurrentAnswer(value);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitAnswer = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      handleNext();
    } else {
      // End interview
      alert('Interview completed! Redirecting to results...');
      navigate('/');
    }
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
    if (isRecording) {
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleEndInterview = () => {
    if (confirm('Are you sure you want to end the interview?')) {
      navigate('/');
    }
  };

  const progress = ((currentQuestionIndex + 1) / mockQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-6 border-b border-border">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="text-text-muted hover:text-text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chat
          </Button>
          <h1 className="text-xl font-semibold text-text-primary">
            Frontend Developer Interview - Round 1
          </h1>
        </div>
        <div className="text-right">
          <div className="text-sm text-text-muted">Time Remaining</div>
          <div className={`text-2xl font-mono font-bold ${timeLeft < 30 ? 'text-destructive' : 'text-text-primary'}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-8">
        {/* Question Display */}
        <div className={`mb-8 transition-opacity duration-500 ${questionVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="mb-4">
            <span className="text-3xl font-bold text-primary">Q{currentQuestion.id}</span>
          </div>
          <div className="text-2xl leading-relaxed text-text-primary mb-6">
            {displayedQuestion}
            {displayedQuestion.length < currentQuestion.text.length && (
              <span className="animate-pulse">|</span>
            )}
          </div>
        </div>

        {/* Answer Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-text-primary">Your Answer:</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant={isVoiceMode ? "default" : "outline"}
                size="sm"
                onClick={toggleVoiceMode}
                className="flex items-center space-x-2"
              >
                <Mic className="w-4 h-4" />
                <span>{isVoiceMode ? 'Voice Mode' : 'Type Mode'}</span>
              </Button>
              
              {isVoiceMode && (
                <Button
                  variant={isRecording ? "destructive" : "secondary"}
                  size="sm"
                  onClick={toggleRecording}
                  className="flex items-center space-x-2"
                >
                  {isRecording ? (
                    <>
                      <Square className="w-4 h-4" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Record</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Voice Animation */}
          {isVoiceMode && isRecording && (
            <div className="mb-4 p-4 bg-system-bubble rounded-lg">
              <div className="flex justify-center items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 20 + 10}px`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '0.5s'
                    }}
                  />
                ))}
              </div>
              <p className="text-center text-text-muted mt-2">Recording... Speak now</p>
            </div>
          )}

          {/* Answer Input */}
          <Textarea
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer here... (or use voice mode above)"
            className="min-h-[200px] text-base leading-relaxed bg-input border-border text-text-primary placeholder:text-text-muted resize-none"
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === 'Enter') {
                handleSubmitAnswer();
              }
            }}
          />
          
          <div className="text-xs text-text-muted mt-2">
            Tip: Press Ctrl + Enter to submit quickly
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentQuestionIndex === mockQuestions.length - 1}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="default"
              onClick={handleSubmitAnswer}
              disabled={!currentAnswer.trim()}
              className="px-6"
            >
              {currentQuestionIndex === mockQuestions.length - 1 ? 'Finish Interview' : 'Submit Answer'}
            </Button>
            
            <Button
              variant="destructive"
              onClick={handleEndInterview}
              className="px-6"
            >
              End Interview
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-border h-1">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default InterviewCoach;