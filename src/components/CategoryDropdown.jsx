import { useState, useEffect, useContext } from 'react'

// import icons
import { IconContext } from 'react-icons/lib'
import { RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri'
import { MdHome } from 'react-icons/md'

// import headless ui
import { Menu } from '@headlessui/react'

// import context
import { ListingContext } from '../context/ListingContext'

function CategoryDropdown() {
  const { category, setCategory, categories, listings } =
    useContext(ListingContext)

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
          <MdHome className='dropdown-icon-primary' />
        </IconContext.Provider>
        <div>
          <div className='text-[15px] font-[500] leading-tight capitalize'>
            {category}
          </div>
          <div className='text-[13px]'>Select Category</div>
        </div>
        {isOpen ? (
          <RiArrowUpSLine className='dropdown-icon-secondary' />
        ) : (
          <RiArrowDownSLine className='dropdown-icon-secondary' />
        )}
      </Menu.Button>

      <Menu.Items onClick={() => setIsOpen(!isOpen)} className='dropdown-menu'>
        {categories.map((category, index) => {
          return (
            <Menu.Item
              onClick={() => setCategory(category)}
              className='cursor-pointer hover:text-[#f97316] transition capitalize'
              as='li'
              key={index}
            >
              {category}
            </Menu.Item>
          )
        })}
      </Menu.Items>
    </Menu>
  )
}

export default CategoryDropdown
