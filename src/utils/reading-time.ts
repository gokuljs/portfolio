import { ReactNode, Children, isValidElement } from 'react';

const WORDS_PER_MINUTE = 200;

function extractTextFromChildren(children: ReactNode): string {
  let text = '';

  Children.forEach(children, (child) => {
    if (typeof child === 'string') {
      text += child + ' ';
    } else if (typeof child === 'number') {
      text += child.toString() + ' ';
    } else if (isValidElement(child) && child.props.children) {
      text += extractTextFromChildren(child.props.children);
    }
  });

  return text;
}

export function calculateReadingTime(children: ReactNode): string {
  const text = extractTextFromChildren(children);
  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  
  return `${minutes} min read`;
}

export function getWordCount(children: ReactNode): number {
  const text = extractTextFromChildren(children);
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}
