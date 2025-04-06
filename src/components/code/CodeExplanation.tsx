import { useState } from 'react';
import { BookOpen, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface CodeExplanationProps {
  code: string;
  language: string;
}

interface LineExplanation {
  line: string;
  explanation: string;
}

export default function CodeExplanation({ code, language }: CodeExplanationProps) {
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanations, setExplanations] = useState<LineExplanation[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const generateExplanation = async () => {
    setIsExplaining(true);
    try {
      const prompt = `Please explain the following ${language} code line by line. For each line, provide a clear and concise explanation of what it does. Format the response as a JSON array where each object has "line" and "explanation" properties. Only include non-empty lines. Here's the code:\n\n${code}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBBvkE74sQv2A53up7p6ZT--_5zpdHsCPw`,
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

      const data = await response.json();
      const explanation = data.candidates[0]?.content?.parts[0]?.text || '';
      
      try {
        // Try to parse the response as JSON
        const parsedExplanations = JSON.parse(explanation);
        setExplanations(parsedExplanations);
      } catch (e) {
        // If parsing fails, format the text explanation manually
        const lines = code.split('\n').filter(line => line.trim());
        const explanationLines = explanation.split('\n').filter(line => line.trim());
        
        const formattedExplanations = lines.map((line, index) => ({
          line: line.trim(),
          explanation: explanationLines[index] || 'No explanation available'
        }));
        
        setExplanations(formattedExplanations);
      }
    } catch (error) {
      console.error('Error generating explanation:', error);
      setExplanations([{
        line: '',
        explanation: 'Failed to generate explanation. Please try again.'
      }]);
    } finally {
      setIsExplaining(false);
      setIsExpanded(true);
    }
  };

  const toggleExplanation = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mt-4">
      {!explanations.length ? (
        <button
          onClick={generateExplanation}
          disabled={isExplaining}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExplaining ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Explanation...
            </>
          ) : (
            <>
              <BookOpen className="h-4 w-4" />
              Explain Code
            </>
          )}
        </button>
      ) : (
        <button
          onClick={toggleExplanation}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Hide Explanation
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Show Explanation
            </>
          )}
        </button>
      )}

      <div 
        className={`mt-4 bg-gray-50 rounded-lg overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4">
          <h4 className="text-lg font-semibold mb-4">Line-by-Line Explanation</h4>
          <div className="space-y-4">
            {explanations.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 hover:bg-gray-100 rounded">
                <div className="font-mono text-sm bg-gray-800 text-white p-2 rounded">
                  {item.line}
                </div>
                <div className="text-gray-700">
                  {item.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}