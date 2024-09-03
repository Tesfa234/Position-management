import { Flex, NavLink } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import React, { useState, useEffect, useRef } from 'react';

interface NavbarProps {
  onRegisterClick: () => void;
  onListClick: () => void;
  onPositionregistration: () => void;
  onPositionlist: () => void;
  onHomeClick: () => void; 
}

const Navbar: React.FC<NavbarProps> = ({
  onRegisterClick,
  onListClick,
  onPositionregistration,
  onPositionlist,
  onHomeClick, 
}) => {
  const [isRegisterDropdownOpen, setIsRegisterDropdownOpen] = useState(false);
  const [isListDropdownOpen, setIsListDropdownOpen] = useState(false);
  const registerDropdownRef = useRef<HTMLDivElement>(null);
  const listDropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      registerDropdownRef.current && 
      !registerDropdownRef.current.contains(event.target as Node)
    ) {
      setIsRegisterDropdownOpen(false);
    }
    if (
      listDropdownRef.current && 
      !listDropdownRef.current.contains(event.target as Node)
    ) {
      setIsListDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Flex className="flex flex-wrap items-start justify-center space-x-2 text-black bg-white">
      <Flex className="relative" ref={registerDropdownRef}>
        <NavLink
          className='flex'
          href="#required-for-focus"
          label="Register"
          rightSection={<IconChevronRight size="1rem" stroke={1.5} />}
          onClick={() => setIsRegisterDropdownOpen(prev => !prev)}
        />
        {isRegisterDropdownOpen && (
          <Flex className="p-2 mt-1 bg-white rounded-md shadow-lg top-2 absolute z-10 flex-col">
            <NavLink
              style={{ padding: '4px' }}
              href="#"
              onClick={onPositionregistration}
              label="Position"
              className="block"
            />
            <NavLink
              href="#"
              onClick={onRegisterClick}
              label="Employee"
              className="block"
            />
          </Flex>
        )}
      </Flex>

      <Flex className="relative" ref={listDropdownRef}>
        <NavLink
          className='flex'
          href="#required-for-focus"
          label="List"
          rightSection={<IconChevronRight size="1rem" stroke={1.5} />}
          onClick={() => setIsListDropdownOpen(prev => !prev)}
        />
        {isListDropdownOpen && (
          <Flex className="p-2 mt-1 bg-white rounded-md shadow-lg top-2 absolute z-10 flex-col">
            <NavLink
              style={{ padding: '4px' }}
              href="#"
              onClick={onPositionlist}
              label="Position"
              className="block"
            />
            <NavLink
              href="#"
              onClick={onListClick}
              label="Employee"
              className="block"
            />
          </Flex>
        )}
      </Flex>

      <Flex className="relative">
        <NavLink
          className="relative"
          href=""
          label="Home"
          onClick={onHomeClick} 
        />
      </Flex>

      <Flex className="relative">
        <NavLink
          href="https://www.peragosystems.com/"
          label="About us"
        />
      </Flex>
    </Flex>
  );
}

export default Navbar;
