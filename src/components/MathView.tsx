import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math?: string;
  text?: string;
  block?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({
  math,
  text,
  block = false,
  className = '',
}) => {
  // If direct math string is provided
  const directRender = useMemo(() => {
    if (!math) return null;
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
      });
    } catch {
      return null;
    }
  }, [math, block]);

  // If mixed text containing $...$ or $$...$$ is provided
  const mixedRenderedHtml = useMemo(() => {
    if (!text) return null;
    try {
      // Replace $$...$$ first for block math
      let result = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, equation) => {
        try {
          return katex.renderToString(equation.trim(), {
            displayMode: true,
            throwOnError: false,
          });
        } catch {
          return `$$${equation}$$`;
        }
      });

      // Replace $...$ for inline math
      result = result.replace(/\$([^\$\n]+?)\$/g, (_, equation) => {
        try {
          return katex.renderToString(equation.trim(), {
            displayMode: false,
            throwOnError: false,
          });
        } catch {
          return `$${equation}$`;
        }
      });

      return result;
    } catch {
      return text;
    }
  }, [text]);

  if (math) {
    if (directRender) {
      return (
        <span
          className={`inline-block ${block ? 'block my-1.5 text-center overflow-x-auto py-1' : ''} ${className}`}
          dangerouslySetInnerHTML={{ __html: directRender }}
        />
      );
    }
    return <code className={`font-mono text-indigo-700 ${className}`}>{math}</code>;
  }

  if (text) {
    if (mixedRenderedHtml) {
      return (
        <span
          className={className}
          dangerouslySetInnerHTML={{ __html: mixedRenderedHtml }}
        />
      );
    }
    return <span className={className}>{text}</span>;
  }

  return null;
};
