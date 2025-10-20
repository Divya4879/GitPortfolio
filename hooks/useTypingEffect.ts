import { useState, useEffect } from 'react';

export const useTypingEffect = (messages: string[], typingSpeed = 50, delay = 2000): string => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [typedMessage, setTypedMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentMessage = messages[messageIndex];
    // Fix: Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> to ensure browser compatibility.
    let timeoutId: ReturnType<typeof setTimeout>;

    if (isDeleting) {
      if (typedMessage.length > 0) {
        timeoutId = setTimeout(() => {
          setTypedMessage(prev => prev.slice(0, -1));
        }, typingSpeed / 2);
      } else {
        setIsDeleting(false);
        setMessageIndex(prev => (prev + 1) % messages.length);
      }
    } else {
      if (typedMessage.length < currentMessage.length) {
        timeoutId = setTimeout(() => {
          setTypedMessage(prev => currentMessage.slice(0, prev.length + 1));
        }, typingSpeed);
      } else {
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, delay);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [typedMessage, isDeleting, messageIndex, messages, typingSpeed, delay]);

  return typedMessage;
};
