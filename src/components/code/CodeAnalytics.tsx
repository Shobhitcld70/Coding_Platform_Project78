import { useState, useEffect } from 'react';
import { Activity, Clock, Database, Code2, AlertTriangle } from 'lucide-react';

interface CodeAnalyticsProps {
  code: string;
  language: string;
}

interface Complexity {
  time: string;
  space: string;
  explanation: string;
}

interface CodeMetrics {
  complexity: Complexity;
  linesOfCode: number;
  cyclomaticComplexity: number;
  maintainabilityScore: number;
  warnings: string[];
}

export default function CodeAnalytics({ code, language }: CodeAnalyticsProps) {
  const [metrics, setMetrics] = useState<CodeMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    analyzeCode();
  }, [code, language]);

  const analyzeCode = () => {
    setIsAnalyzing(true);
    
    // Simulate a brief delay for analysis
    setTimeout(() => {
      const metrics = calculateMetrics(code, language);
      setMetrics(metrics);
      setIsAnalyzing(false);
    }, 500);
  };

  const calculateMetrics = (code: string, language: string): CodeMetrics => {
    // Calculate lines of code (excluding empty lines and comments)
    const linesOfCode = code.split('\n')
      .filter(line => line.trim() && !line.trim().startsWith('//') && !line.trim().startsWith('#'))
      .length;

    // Calculate cyclomatic complexity (basic implementation)
    const cyclomaticComplexity = calculateCyclomaticComplexity(code, language);

    // Analyze time and space complexity
    const complexity = analyzeComplexity(code, language);

    // Calculate maintainability score (0-100)
    const maintainabilityScore = calculateMaintainabilityScore(code, linesOfCode, cyclomaticComplexity);

    // Identify potential warnings
    const warnings = identifyWarnings(code, language);

    return {
      complexity,
      linesOfCode,
      cyclomaticComplexity,
      maintainabilityScore,
      warnings
    };
  };

  const calculateCyclomaticComplexity = (code: string, language: string): number => {
    let complexity = 1; // Base complexity
    
    // Common control flow keywords across languages
    const keywords = [
      'if', 'else', 'for', 'while', 'case', '&&', '||',
      'catch', 'switch', 'foreach', 'elif'
    ];

    // Count control flow statements
    keywords.forEach(keyword => {
      // Fixed the regular expression by removing the question mark
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      const matches = code.match(regex);
      if (matches) {
        complexity += matches.length;
      }
    });

    // Add complexity for ternary operators
    const ternaryMatches = code.match(/\?/g);
    if (ternaryMatches) {
      complexity += ternaryMatches.length;
    }

    return complexity;
  };

  const analyzeComplexity = (code: string, language: string): Complexity => {
    // Initialize with default complexity
    let timeComplexity = 'O(n)';
    let spaceComplexity = 'O(1)';
    let explanation = 'Linear time complexity with constant space usage.';

    // Look for common patterns to determine complexity
    if (code.includes('for') && code.includes('for')) {
      // Nested loops suggest quadratic time complexity
      timeComplexity = 'O(n²)';
      explanation = 'Quadratic time complexity due to nested loops.';
    } else if (code.includes('while') || code.includes('for')) {
      // Single loops suggest linear time complexity
      timeComplexity = 'O(n)';
      explanation = 'Linear time complexity due to single loop iteration.';
    }

    // Check for recursive patterns
    const functionName = code.match(/\w+(?=\s*\()/)?.[0] || '';
    if (code.includes('return') && code.includes(functionName) && functionName) {
      timeComplexity = 'O(log n)';
      explanation = 'Logarithmic time complexity due to recursive implementation.';
    }

    // Check for space complexity
    if (code.includes('new Array') || code.includes('[]') || code.includes('List')) {
      spaceComplexity = 'O(n)';
      explanation += ' Linear space complexity due to data structure usage.';
    }

    return { time: timeComplexity, space: spaceComplexity, explanation };
  };

  const calculateMaintainabilityScore = (
    code: string,
    linesOfCode: number,
    cyclomaticComplexity: number
  ): number => {
    // Calculate maintainability index using a simplified version of the standard formula
    const volume = code.length * Math.log2(code.length);
    const effort = cyclomaticComplexity * volume;
    const maintainabilityIndex = Math.max(0, Math.min(100, (171 - 5.2 * Math.log(effort) - 0.23 * cyclomaticComplexity - 16.2 * Math.log(linesOfCode)) * 100 / 171));
    
    return Math.round(maintainabilityIndex);
  };

  const identifyWarnings = (code: string, language: string): string[] => {
    const warnings: string[] = [];

    // Check for long functions
    if (code.split('\n').length > 30) {
      warnings.push('Function is too long. Consider breaking it into smaller functions.');
    }

    // Check for deep nesting
    const maxIndentation = Math.max(...code.split('\n').map(line => 
      (line.match(/^\s+/) || [''])[0].length
    ));
    if (maxIndentation > 16) {
      warnings.push('Deep nesting detected. Consider refactoring to reduce complexity.');
    }

    // Check for magic numbers
    const hasMagicNumbers = /\b\d+\b/.test(code.replace(/\b[0-1]\b/g, ''));
    if (hasMagicNumbers) {
      warnings.push('Magic numbers detected. Consider using named constants.');
    }

    // Language-specific warnings
    if (language === 'javascript' || language === 'typescript') {
      if (code.includes('var ')) {
        warnings.push('Use of "var" detected. Consider using "const" or "let" instead.');
      }
    }

    return warnings;
  };

  if (isAnalyzing) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="mt-6 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5 text-blue-600" />
        Code Analytics
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Complexity Analysis */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium">Time Complexity</h4>
              <p className="text-gray-600">{metrics.complexity.time}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium">Space Complexity</h4>
              <p className="text-gray-600">{metrics.complexity.space}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{metrics.complexity.explanation}</p>
        </div>

        {/* Code Metrics */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Code2 className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium">Code Metrics</h4>
              <ul className="text-gray-600 space-y-2">
                <li>Lines of Code: {metrics.linesOfCode}</li>
                <li>Cyclomatic Complexity: {metrics.cyclomaticComplexity}</li>
                <li>
                  Maintainability Score: 
                  <span className={`ml-2 font-medium ${
                    metrics.maintainabilityScore >= 80 ? 'text-green-600' :
                    metrics.maintainabilityScore >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {metrics.maintainabilityScore}/100
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {metrics.warnings.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <h4 className="font-medium">Potential Improvements</h4>
          </div>
          <ul className="space-y-2">
            {metrics.warnings.map((warning, index) => (
              <li key={index} className="text-gray-600 flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}