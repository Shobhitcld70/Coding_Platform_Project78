import { useState } from 'react';
import { Bot, X, Send, Loader2, AlertCircle, Settings, Maximize2, Minimize2, Copy, Check } from 'lucide-react';
import OpenAI from 'openai';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  const [model, setModel] = useState<'openai' | 'gemini'>('gemini');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const geminiKey = 'AIzaSyBBvkE74sQv2A53up7p6ZT--_5zpdHsCPw';

  const handleCopy = async (text: string, index: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const formatMessage = (content: string) => {
    // Check if the message contains code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        });
      }

      // Add code block
      parts.push({
        type: 'code',
        language: match[1] || 'javascript',
        content: match[2].trim()
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content }];
  };

  const handleGeminiRequest = async (prompt: string): Promise<string> => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'Sorry, I could not generate a response.';
  };

  const handleOpenAIRequest = async (userMessage: Message): Promise<string> => {
    const openai = new OpenAI({
      apiKey: openaiKey,
      dangerouslyAllowBrowser: true
    });

    const completion = await openai.chat.completions.create({
      messages: [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      model: 'gpt-3.5-turbo',
    });

    return completion.choices[0]?.message?.content || 'Sorry, I could not process your request.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isQuotaExceeded) return;

    if (model === 'openai' && !openaiKey) {
      setError('OpenAI API key is not configured. Please add your API key to the .env file as VITE_OPENAI_API_KEY.');
      return;
    }

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      let response: string;
      
      if (model === 'gemini') {
        response = await handleGeminiRequest(input);
      } else {
        response = await handleOpenAIRequest(userMessage);
      }

      const assistantMessage = {
        role: 'assistant' as const,
        content: response
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error:', error);
      if (error?.error?.code === 'insufficient_quota') {
        setIsQuotaExceeded(true);
        setError('The AI assistant is currently unavailable due to API quota limitations. The assistant will be disabled until the quota is restored. Please try again later or contact support.');
      } else {
        setError(error?.message || 'An error occurred while processing your request. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        aria-label="Open AI Assistant"
      >
        <Bot className="h-6 w-6" />
      </button>
    );
  }

  const containerClasses = isFullscreen
    ? "fixed inset-0 bg-white z-50 flex flex-col"
    : "fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col z-50";

  return (
    <div className={containerClasses}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-blue-600" />
          <h2 className="font-semibold">AI Assistant</h2>
          {isQuotaExceeded && (
            <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
              Unavailable
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value as 'openai' | 'gemini')}
            className="text-sm border rounded-md px-2 py-1"
          >
            <option value="gemini">Gemini</option>
            <option value="openai">OpenAI</option>
          </select>
          <button
            onClick={toggleFullscreen}
            className="text-gray-500 hover:text-gray-700"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {formatMessage(message.content).map((part, i) => (
                part.type === 'code' ? (
                  <div key={i} className="my-2 rounded-md overflow-hidden relative group">
                    <div className="absolute right-2 top-2 z-10">
                      <button
                        onClick={() => handleCopy(part.content, `${index}-${i}`)}
                        className="p-1 rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy code"
                      >
                        {copiedIndex === `${index}-${i}` ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <SyntaxHighlighter
                      language={part.language}
                      style={vs}
                      customStyle={{
                        margin: 0,
                        padding: '1rem',
                        background: '#1e1e1e',
                      }}
                    >
                      {part.content}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <p key={i} className="whitespace-pre-wrap">{part.content}</p>
                )
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isQuotaExceeded ? 'AI Assistant is currently unavailable' : 'Ask me anything about coding...'}
            disabled={isQuotaExceeded}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
          <button
            type="submit"
            disabled={isLoading || isQuotaExceeded}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}