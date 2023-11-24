import { useState, useEffect, createContext } from 'react'

// import firebase
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'

//create context
export const ListingContext = createContext()

const ListingContextProvider = ({ children }) => {
  const [listingsData, setListingsData] = useState(null)
  const [listings, setListings] = useState(null)
  const [state, setState] = useState('Location (any)')
  const [states, setStates] = useState([])
  const [category, setCategory] = useState('Category (any)')
  const [categories, setCategories] = useState([])
  const [price, setPrice] = useState('Price (any)')
  const [loading, setLoading] = useState(true)
  const [lastFetchedListing, setLastFetchedListing] = useState(null)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get reference
        const listingsRef = collection(db, 'listings')

        // Create a query
        const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(9))

        // Execute query
        const querySnap = await getDocs(q)

        const lastVisible = querySnap.docs[querySnap.docs.length - 1]
        setLastFetchedListing(lastVisible)

        const listings = []
        const listingsData = []
        let allStates = []
        let allCategories = []

        querySnap.forEach((doc) => {
          //return all states
          allStates.push(doc.data().state)
          allStates.sort()

          // return all categories
          allCategories.push(doc.data().type)
          allCategories.sort()

          // remove duplicates
          const uniqueStates = ['Location (any)', ...new Set(allStates)]
          const uniqueCategories = ['Category (any)', ...new Set(allCategories)]

          // set states' state
          setStates(uniqueStates)
          // set categories' state
          setCategories(uniqueCategories)

          // return all listings
          return listingsData.push({
            id: doc.id,
            data: doc.data(),
          })
        })

        setListingsData(listingsData)
        setListings(listingsData)
        setLoading(false)
      } catch (error) {
        toast.error('Could not fetch listings')
      }
    }
    fetchListings()
  }, [])

  // Pagination / Load More
  const onFetchMoreListings = async () => {
    try {
      // Get reference
      const listingsRef = collection(db, 'listings')

      // Create a query
      const q = query(
        listingsRef,
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(9)
      )

      // Execute query
      const querySnap = await getDocs(q)

      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastFetchedListing(lastVisible)

      const listings = []
      const listingsData = []
      const allStates = []
      const allCategories = []

      querySnap.forEach((doc) => {
        //return all states
        allStates.push(doc.data().state)

        // return all categories
        allCategories.push(doc.data().type)

        // remove duplicates
        const addedStates = [...new Set(allStates)]
        const addedCategories = [...new Set(allCategories)]

        let addedStatesCombined = [...states, ...addedStates]
        addedStatesCombined.splice(0, 1)
        addedStatesCombined.sort()
        addedStatesCombined.unshift('Location (any)')

        let addedCategoriesCombined = [...categories, ...addedCategories]
        addedCategoriesCombined.splice(0, 1)
        addedCategoriesCombined.sort()
        addedCategoriesCombined.unshift('Category (any)')

        const uniqueStates = [...new Set(addedStatesCombined)]
        const uniqueCategories = [...new Set(addedCategoriesCombined)]

        // set states' state
        setStates(uniqueStates)
        // set categories' state
        setCategories(uniqueCategories)

        // return all listings
        return listingsData.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListingsData((prevState) => [...prevState, ...listingsData])
      setListings((prevState) => [...prevState, ...listingsData])
      setLoading(false)
    } catch (error) {
      toast.error('Could not fetch listings')
    }
  }

  const handleClick = () => {
    setLoading(true)

    // create a function that checks if the string includes '(any)'
    const isDefault = (str) => {
      return str.split(' ').includes('(any)')
    }

    // get first value of price and parse it to number
    const minPrice = parseInt(price.split(' ')[0])

    // get second value of price which is the maximum price and parse it to number
    const maxPrice = parseInt(price.split(' ')[2])

    // eslint-disable-next-line
    const newListings = listingsData.filter((listing) => {
      const listingPrice = listing.data.price

      // if all values are selected
      if (
        listing.data.state === state &&
        listing.data.type === category &&
        listingPrice >= minPrice &&
        listingPrice <= maxPrice
      ) {
        return listing
      }

      // if all values are default
      if (isDefault(state) && isDefault(category) && isDefault(price)) {
        return listing
      }

      // if state is not default
      if (!isDefault(state) && isDefault(category) && isDefault(price)) {
        return listing.data.state === state
      }

      // if category is not default
      if (isDefault(state) && !isDefault(category) && isDefault(price)) {
        return listing.data.type === category
      }

      // if price is not default
      if (isDefault(state) && isDefault(category) && !isDefault(price)) {
        if (listingPrice >= minPrice && listingPrice <= maxPrice) {
          return listing
        }
      }

      // if state & category is not default
      if (!isDefault(state) && !isDefault(category) && isDefault(price)) {
        return listing.data.state === state && listing.data.type === category
      }

      // if state and price is not default
      if (!isDefault(state) && isDefault(category) && !isDefault(price)) {
        if (listingPrice >= minPrice && listingPrice <= maxPrice) {
          return listing.data.state === state
        }
      }

      // if category and price is not default
      if (isDefault(state) && !isDefault(category) && !isDefault(price)) {
        if (listingPrice >= minPrice && listingPrice <= maxPrice) {
          return listing.data.type === category
        }
      }
    })

    setTimeout(() => {
      return (
        newListings.length < 1 ? setListings([]) : setListings(newListings),
        setLoading(false)
      )
    }, 350)
  }

  return (
    <ListingContext.Provider
      value={{
        state,
        setState,
        states,
        category,
        setCategory,
        categories,
        price,
        setPrice,
        listings,
        loading,
        handleClick,
        lastFetchedListing,
        setLastFetchedListing,
        onFetchMoreListings,
      }}
    >
      {children}
    </ListingContext.Provider>
  )
}

export default ListingContextProvider
