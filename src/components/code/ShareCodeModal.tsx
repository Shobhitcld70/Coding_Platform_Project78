import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { CodeSnippet } from '../../types';
import CodeCompiler from './CodeCompiler';

interface ShareCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (snippet: Omit<CodeSnippet, 'id' | 'author' | 'createdAt' | 'likes'>) => void;
  editingSnippet?: CodeSnippet | null;
}

export default function ShareCodeModal({ isOpen, onClose, onSubmit, editingSnippet }: ShareCodeModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  // Update form when editing snippet changes
  useEffect(() => {
    if (editingSnippet) {
      setTitle(editingSnippet.title);
      setDescription(editingSnippet.description);
      setCode(editingSnippet.code);
      setLanguage(editingSnippet.language);
    } else {
      setTitle('');
      setDescription('');
      setCode('');
      setLanguage('javascript');
    }
  }, [editingSnippet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      code,
      language,
    });
    // Reset form
    setTitle('');
    setDescription('');
    setCode('');
    setLanguage('javascript');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {editingSnippet ? 'Edit Code Snippet' : 'Share Code'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter a descriptive title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
              placeholder="Describe your code snippet"
            />
          </div>

          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="typescript">TypeScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="csharp">C#</option>
              <option value="php">PHP</option>
              <option value="ruby">Ruby</option>
              <option value="swift">Swift</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="kotlin">Kotlin</option>
            </select>
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Code
            </label>
            <div className="relative bg-gray-50 rounded-md border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 bg-transparent font-mono text-transparent caret-gray-900 resize-none focus:outline-none"
                style={{ 
                  caretColor: '#111827',
                  lineHeight: '1.5rem',
                  minHeight: '240px'
                }}
                required
                placeholder="Paste your code here"
                spellCheck="false"
              />
              <div 
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
              >
                <SyntaxHighlighter
                  language={language}
                  style={vs}
                  customStyle={{
                    margin: 0,
                    padding: '8px 12px',
                    background: 'transparent',
                    fontSize: '14px',
                    lineHeight: '1.5rem',
                    minHeight: '240px'
                  }}
                >
                  {code || ' '}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>

          {/* Code Compiler */}
          {code && (
            <CodeCompiler code={code} language={language} />
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editingSnippet ? 'Save Changes' : 'Share Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}