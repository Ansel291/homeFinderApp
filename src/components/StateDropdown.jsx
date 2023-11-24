import { useState, useEffect, useContext } from 'react'

// import icons
import { IconContext } from 'react-icons/lib'
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri'
import { MdLocationOn } from 'react-icons/md'

// import headless ui
import { Menu } from '@headlessui/react'

// import context
import { ListingContext } from '../context/ListingContext'

function StateDropdown() {
  const { state, setState, states, listings } = useContext(ListingContext)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Menu as='div' className='dropdown relative'>
      <Menu.Button
        onClick={() => setIsOpen(!isOpen)}
        className='dropdown-btn border w-full text-left'
      >
        <IconContext.Provider
          value={{
            size: '24px',
          }}
        >
          <MdLocationOn className='dropdown-icon-primary' />
        </IconContext.Provider>
        <div>
          <div className='text-[15px] font-[500] leading-tight'>{state}</div>
          <div className='text-[13px]'>Select your state</div>
        </div>
        {isOpen ? (
          <RiArrowUpSLine className='dropdown-icon-secondary' />
        ) : (
          <RiArrowDownSLine className='dropdown-icon-secondary' />
        )}
      </Menu.Button>

      <Menu.Items onClick={() => setIsOpen(!isOpen)} className='dropdown-menu'>
        {states.map((state, index) => {
          return (
            <Menu.Item
              onClick={() => setState(state)}
              className='cursor-pointer hover:text-[#f97316] transition'
              as='li'
              key={index}
            >
              {state}
            </Menu.Item>
          )
        })}
      </Menu.Items>
    </Menu>
  )
}

export default StateDropdown
