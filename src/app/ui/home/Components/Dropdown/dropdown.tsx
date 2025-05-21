import { DropdownProps } from '@/app/lib/dropdown';
import React, { useEffect, useRef, useState } from 'react';
import styles from 'styles/dropdown.module.scss';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import useOutsideClick from '@/app/lib/hooks/useOutsideClick';

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  setValue,
  setDropdownState,
  dropdownState,
}) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [dropdownMouseActive, setDropdownMouseActive] = useState(false);

  // Find the index of the current value
  useEffect(() => {
    if (value) {
      const index = options.findIndex((option) => option === value);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [value, options]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && dropdownState) {
        setDropdownState(false);
      }
      if (event.key === 'ArrowDown' && dropdownState) {
        const index = currentIndex;
        setCurrentIndex(currentIndex < options.length - 1 ? index + 1 : 0);
      }
      if (event.key === 'ArrowUp' && dropdownState) {
        setCurrentIndex(
          currentIndex > 0 ? currentIndex - 1 : options.length - 1,
        );
      }
      if (event.key === 'Enter' && dropdownState && !dropdownMouseActive) {
        if (currentIndex >= 0 && currentIndex < options.length) {
          setValue(options[currentIndex]);
          setDropdownState(false);
        }
      }
      event.preventDefault();
      event.stopPropagation();
    };
    if (dropdownRef.current) {
      dropdownRef.current.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      dropdownRef.current &&
        dropdownRef.current.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownState, currentIndex, options]);

  useOutsideClick(dropdownRef, () => {
    setDropdownState(false);
  });

  return (
    <div
      className={styles.Dropdown}
      ref={dropdownRef}
      tabIndex={0}
      onClick={() => {
        setDropdownState(!dropdownState);
      }}
    >
      <span className={styles.dropdownText}>
        {!value ? 'select a year...' : value}
      </span>
      <ChevronDownIcon
        className={clsx(styles.icon, {
          [styles.iconRotated]: dropdownState,
        })}
      />
      {dropdownState && options.length > 0 && (
        <div className={styles.dropdownSelect}>
          {options.map((item, index) => (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setValue(item);
                setCurrentIndex(index);
                setDropdownState(false);
              }}
              onMouseEnter={() => {
                setDropdownMouseActive(true);
                setCurrentIndex(index);
              }}
              onMouseLeave={() => {
                setDropdownMouseActive(false);
              }}
              key={item}
              className={clsx(styles.dropdownItem, {
                [styles.itemActive]: index === currentIndex,
              })}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
