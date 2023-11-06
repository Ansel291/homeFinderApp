//import react
import { useContext } from 'react'

// import context
import { ListingContext } from '../context/ListingContext'

//import components
import StateDropdown from './StateDropdown'
import CategoryDropdown from './CategoryDropdown'
import PriceRangeDropdown from './PriceRangeDropdown'
//import PropertyDropdown from './PropertyDropdown'

// import icons
import { IconContext } from 'react-icons/lib'
import { BiSearch } from 'react-icons/bi'

function Search() {
  //const { listings } = useContext(ListingContext)
  const { handleClick } = useContext(ListingContext)
  //console.log(listings)

  return (
    <div className='px-[30px] py-[24px] max-w-[1170px] mx-auto flex flex-col lg:flex-row justify-between gap-4 lg:gap-x-3 relative shadow-1 bg-white rounded-lg'>
      <StateDropdown />
      <CategoryDropdown />
      <PriceRangeDropdown />
      <button
        type='button'
        onClick={() => handleClick()}
        className='bg-[#f97316] hover:bg-[#ea580c] transition w-full lg:max-w-[162px] h-[64px] rounded-lg flex justify-center items-center text-lg'
      >
        <IconContext.Provider
          value={{
            size: '20px',
          }}
        >
          <BiSearch fill='#fff' />
        </IconContext.Provider>
      </button>
    </div>
  )
}

export default Search
