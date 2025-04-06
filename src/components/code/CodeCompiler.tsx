import { useState } from 'react';
import { Play, Loader2, BookOpen } from 'lucide-react';
import CodeExplanation from './CodeExplanation';

interface CodeCompilerProps {
  code: string;
  language: string;
}

// Language mapping for Piston API
const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
  javascript: { language: 'javascript', version: '18.15.0' },
  python: { language: 'python', version: '3.10.0' },
  typescript: { language: 'typescript', version: '5.0.3' },
  java: { language: 'java', version: '15.0.2' },
  cpp: { language: 'cpp', version: '10.2.0' },
  csharp: { language: 'csharp', version: '6.12.0' },
  php: { language: 'php', version: '8.2.3' },
  ruby: { language: 'ruby', version: '3.2.1' },
  swift: { language: 'swift', version: '5.8' },
  go: { language: 'go', version: '1.19.5' },
  rust: { language: 'rust', version: '1.68.2' },
  kotlin: { language: 'kotlin', version: '1.8.20' }
};

// Add necessary boilerplate for languages that require it
const getCodeWithBoilerplate = (code: string, language: string): string => {
  switch (language) {
    case 'java':
      return `
public class Main {
    public static void main(String[] args) {
        ${code}
    }
}`;
    case 'cpp':
      return `#include <iostream>
using namespace std;

int main() {
    ${code}
    return 0;
}`;
    case 'csharp':
      return `using System;

class Program {
    static void Main() {
        ${code}
    }
}`;
    case 'kotlin':
      return `fun main() {
    ${code}
}`;
    default:
      return code;
  }
};

export default function CodeCompiler({ code, language }: CodeCompilerProps) {
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runCode = async () => {
    setIsLoading(true);
    setError(null);
    setOutput('');

    try {
      let result = '';

      // Handle JavaScript separately for browser execution
      if (language === 'javascript') {
        try {
          const sandboxedCode = new Function(code);
          const originalLog = console.log;
          let logs: string[] = [];
          console.log = (...args) => {
            logs.push(args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '));
          };
          
          const returnValue = sandboxedCode();
          console.log = originalLog;
          
          result = logs.join('\n');
          if (returnValue !== undefined) {
            result += '\n=> ' + returnValue;
          }
        } catch (err: any) {
          throw new Error(err.message);
        }
      } else {
        // Use Piston API for other languages
        const langConfig = LANGUAGE_MAP[language];
        if (!langConfig) {
          throw new Error(`Language ${language} is not supported.`);
        }

        const codeToExecute = getCodeWithBoilerplate(code, language);

        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language: langConfig.language,
            version: langConfig.version,
            files: [{
              content: codeToExecute
            }]
          })
        });

        const data = await response.json();
        if (data.run.output) {
          result = data.run.output;
        } else if (data.run.stderr) {
          throw new Error(data.run.stderr);
        }
      }

      setOutput(result || 'Program executed successfully with no output.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Code Output</h3>
        <div className="flex gap-2">
          <CodeExplanation code={code} language={language} />
          <button
            onClick={runCode}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Run Code
          </button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="p-4">
          {error ? (
            <div className="text-red-400 font-mono whitespace-pre-wrap">{error}</div>
          ) : output ? (
            <div className="text-green-400 font-mono whitespace-pre-wrap">{output}</div>
          ) : (
            <div className="text-gray-400 italic">Click "Run Code" to see the output</div>
          )}
        </div>
      </div>
    </div>
  );
}