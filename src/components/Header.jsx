// import react
import { useState } from 'react'
import { Link } from 'react-router-dom'

// import Firebase
//import { getAuth } from 'firebase/auth'

// import components
import { ReactComponent as PersonCircleIcon } from '../assets/svg/personCircle.svg'

function Header() {
  const [hover, setHover] = useState(false)
  return (
    <header className='py-6 sm:py-5 border-b'>
      <div className='container mx-auto flex justify-between items-center'>
        {/* logo */}
        <Link to='/' className='flex gap-[2px] sm:gap-[7px] items-center'>
          <div className='header-logo'></div>
          <div className='text-[18px] sm:text-[24px] font-[600]'>
            HomeFinder
          </div>
        </Link>
        {/* buttons */}
        {/* <div className='flex items-center gap-[14px] sm:gap-6 text-[16px]'> */}

        <div className=''>
          {/*
            <Link className='hover:text-orange-500 transition' to='/sign-in'>
            Sign In
          </Link>
          <Link
            className='bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg transition'
            to='/sign-up'
          >
            Sign Up
          </Link>
          */}
          <Link to='/profile' aria-label='Login to Profile'>
            <PersonCircleIcon
              className='w-[30px] sm:w-[34px] h-[30px] sm:h-[34px] transition'
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              fill={hover ? '#ea580c' : '#f97316'}
            />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
