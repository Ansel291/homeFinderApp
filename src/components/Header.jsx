// import react
import { useState } from 'react'
import { Link } from 'react-router-dom'

// import components
import { ReactComponent as PersonCircleIcon } from '../assets/svg/personCircle.svg'

function Header() {
  const [hover, setHover] = useState(false)
  return (
    <header className='py-6 sm:py-5 border-b'>
      <div className='container mx-auto flex justify-between items-center'>
        {/* logo */}
        <a href='/' className='flex gap-[2px] sm:gap-[7px] items-center'>
          <div className='header-logo'></div>
          <div className='text-[18px] sm:text-[24px] font-[600]'>
            HomeFinder
          </div>
        </a>

        <div className=''>
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
