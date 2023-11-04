import { DropdownProps } from '@/app/lib/dropdown';
import React, { useEffect, useRef } from 'react';
import styles from 'styles/dropdown.module.scss';
import { ChevronDownIcon } from '@radix-ui/react-icons';

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  setValue,
  setDropdownState,
  dropdownState,
}) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      console.log(event.key, 'ssss');
      if (event.key === 'Escape' && dropdownState) {
        setDropdownState(false);
      }
    };
    if (dropdownRef.current) {
      dropdownRef.current.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      dropdownRef.current &&
        dropdownRef.current.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownState]);
  return (
    <div
      className={styles.Dropdown}
      ref={dropdownRef}
      tabIndex={0}
      onClick={() => {
        setDropdownState(!dropdownState);
      }}
    >
      {!value ? 'select a year...' : value}{' '}
      <ChevronDownIcon className={styles.icon} />
      {dropdownState && options.length > 0 && (
        <div className={styles.dropdownSelect}>
          {options.map((item) => (
            <div
              onClick={() => {
                setValue(item);
                setDropdownState(false);
              }}
              key={item}
              className={styles.dropdownItem}
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
