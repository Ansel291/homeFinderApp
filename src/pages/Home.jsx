import { useContext, lazy } from 'react'

//import listing context provider
//import ListingContextProvider from '../context/ListingContext'

// import components
/*
import Hero from '../components/Hero'
import ListingItem from '../components/ListingItem'
import Spinner from '../components/Spinner'
import Footer from '../components/Footer'
*/
import ListingItem from '../components/ListingItem'
import Spinner from '../components/Spinner'
import Footer from '../components/Footer'

// import context
import { ListingContext } from '../context/ListingContext'

const Hero = lazy(() => import('../components/Hero'))

function Home() {
  const {
    listings,
    loading,
    lastFetchedListing,
    setLastFetchedListing,
    onFetchMoreListings,
  } = useContext(ListingContext)
  return (
    <>
      <div>
        <Hero />
        {loading ? (
          <Spinner />
        ) : listings && listings.length > 0 ? (
          <>
            <section className='mb-[60px]'>
              <div className='container mx-auto'>
                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-14'>
                  {listings.map((listing) => (
                    <ListingItem
                      listing={listing.data}
                      id={listing.id}
                      key={listing.id}
                    />
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          <p className='text-center text-[15px] text-gray-800'>
            Sorry, no listings at this time
          </p>
        )}
        {lastFetchedListing && (
          <p
            className='cursor-pointer w-[128px] m-auto text-center py-[4px] px-[8px] bg-black text-white font-[600] rounded-[16px] opacity-[.7]'
            onClick={onFetchMoreListings}
          >
            Load More
          </p>
        )}
        <Footer />
      </div>
    </>
  )
}

export default Home
