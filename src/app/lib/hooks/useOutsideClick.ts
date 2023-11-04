import { useEffect, RefObject, useCallback } from 'react';

// Hook
function useOutsideClick<T extends HTMLElement>(
  ref: RefObject<T>,
  callback: () => void,
): void {
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    },
    [ref, callback],
  );

  useEffect(() => {
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);
}

export default useOutsideClick;
