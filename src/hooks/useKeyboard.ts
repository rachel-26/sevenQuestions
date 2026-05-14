import { useEffect } from 'react';

export function useHotkeys(key: string, callback: () => void, ctrlKey: boolean = false) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        (!ctrlKey || (ctrlKey && (event.ctrlKey || event.metaKey)))
      ) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, ctrlKey]);
}
