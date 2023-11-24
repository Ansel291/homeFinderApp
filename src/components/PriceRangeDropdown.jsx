import { useState, useEffect, useContext } from 'react'

// import icons
import { IconContext } from 'react-icons/lib'
import { RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri'
import { BsWalletFill } from 'react-icons/bs'

// import headless ui
import { Menu } from '@headlessui/react'

// import context
import { ListingContext } from '../context/ListingContext'

function PriceRangeDropdown() {
  const { price, setPrice, listings } = useContext(ListingContext)
  const [isOpen, setIsOpen] = useState(false)

  const prices = [
    {
      value: 'Select Price (any)',
    },
    {
      value: '0 - 10000',
    },
    {
      value: '10000 - 40000',
    },
    {
      value: '40000 - 70000',
    },
    {
      value: '70000 - 100000',
    },
    {
      value: '100000 - 200000',
    },
    {
      value: '200000 - 300000',
    },
    {
      value: '300000 - 400000',
    },
    {
      value: '400000 - 500000',
    },
    {
      value: '500000 - 600000',
    },
  ]

  return (
    <Menu as='div' className='dropdown relative'>
      <Menu.Button
        onClick={() => setIsOpen(!isOpen)}
        className='dropdown-btn border w-full text-left'
      >
        <IconContext.Provider
          value={{
            size: '18px',
          }}
        >
          <BsWalletFill className='dropdown-icon-primary' />
        </IconContext.Provider>
        <div>
          <div className='text-[15px] font-[500] leading-tight'>{price}</div>
          <div className='text-[13px]'>Select Price</div>
        </div>
        {isOpen ? (
          <RiArrowUpSLine className='dropdown-icon-secondary' />
        ) : (
          <RiArrowDownSLine className='dropdown-icon-secondary' />
        )}
      </Menu.Button>

      <Menu.Items onClick={() => setIsOpen(!isOpen)} className='dropdown-menu'>
        {prices.map((price, index) => {
          return (
            <Menu.Item
              onClick={() => setPrice(price.value)}
              className='cursor-pointer hover:text-[#f97316] transition capitalize'
              as='li'
              key={index}
            >
              $ {price.value}
            </Menu.Item>
          )
        })}
      </Menu.Items>
    </Menu>
  )
}

export default PriceRangeDropdown
