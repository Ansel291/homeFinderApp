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
        //console.log(listingsRef)

        // Create a query
        const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(10))

        // Execute query
        const querySnap = await getDocs(q)
        //console.log(querySnap)

        const lastVisible = querySnap.docs[querySnap.docs.length - 1]
        console.log(lastVisible)
        setLastFetchedListing(lastVisible)

        const listings = []
        const listingsData = []
        let allStates = []
        let allCategories = []
        /*
        const uniqueStates = []
        */

        querySnap.forEach((doc) => {
          //console.log(doc.data())

          //return all states
          allStates.push(doc.data().state)
          allStates.sort()
          //console.log(allStates)

          // return all categories
          allCategories.push(doc.data().type)
          allCategories.sort()
          //console.log(allCategories)

          // remove duplicates
          const uniqueStates = ['Location (any)', ...new Set(allStates)]
          //console.log(uniqueStates)
          const uniqueCategories = ['Category (any)', ...new Set(allCategories)]
          //console.log(uniqueCategories)

          // set states' state
          setStates(uniqueStates)
          // set categories' state
          setCategories(uniqueCategories)

          // return all listings
          /*
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
          */

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
    console.log('Yay you clicked onMoreFetchListings function')
    try {
      // Get reference
      const listingsRef = collection(db, 'listings')
      //console.log(listingsRef)

      // Create a query
      const q = query(
        listingsRef,
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(10)
      )

      // Execute query
      const querySnap = await getDocs(q)
      console.log(querySnap)

      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastFetchedListing(lastVisible)
      console.log(lastVisible)

      const listings = []
      console.log(listings)
      const listingsData = []
      console.log(listingsData)
      const allStates = []
      console.log(allStates)
      const allCategories = []
      console.log(allCategories)

      /*
      const uniqueStates = []
      */

      querySnap.forEach((doc) => {
        //console.log(doc.data())

        //return all states
        allStates.push(doc.data().state)
        console.log(allStates)

        // return all categories
        allCategories.push(doc.data().type)
        //console.log(allCategories)

        // remove duplicates
        //const uniqueStates = ['Location (any)', ...new Set(allStates)]
        /*
        const uniqueStates = [...new Set(allStates)]
        console.log(uniqueStates)
        */
        const addedStates = [...new Set(allStates)]
        console.log(addedStates)
        //const uniqueCategories = ['Category (any)', ...new Set(allCategories)]
        const addedCategories = [...new Set(allCategories)]
        //console.log(addedCategories)

        //console.log(categories)

        let addedStatesCombined = [...states, ...addedStates]
        addedStatesCombined.splice(0, 1)
        addedStatesCombined.sort()
        addedStatesCombined.unshift('Location (any)')
        //console.log(addedStatesCombined)
        let addedCategoriesCombined = [...categories, ...addedCategories]
        addedCategoriesCombined.splice(0, 1)
        addedCategoriesCombined.sort()
        addedCategoriesCombined.unshift('Category (any)')
        console.log(addedCategoriesCombined)

        //const uniqueStates = [...new Set(addedStatesCombined)].sort()
        const uniqueStates = [...new Set(addedStatesCombined)]
        /*
        console.log(uniqueStates)
        const poopStates = uniqueStates
        console.log(poopStates)
        console.log(poopStates[0])
        */
        const uniqueCategories = [...new Set(addedCategoriesCombined)]
        //console.log(uniqueCategories)

        // set states' state
        //setStates(uniqueStates)
        /*
        setStates((prevState) => [...prevState, ...uniqueStates])
        //console.log(states)
        */
        // set categories' state
        //setCategories(uniqueCategories)
        /*
        setCategories((prevState) => [...prevState, ...uniqueCategories])
        console.log(categories)
        */

        setStates(uniqueStates)
        setCategories(uniqueCategories)

        // return all listings
        /*
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
        */

        return listingsData.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      //setListingsData(listingsData)
      setListingsData((prevState) => [...prevState, ...listingsData])
      setListings((prevState) => [...prevState, ...listingsData])
      setLoading(false)
    } catch (error) {
      toast.error('Could not fetch listings')
    }
  }

  const handleClick = () => {
    //console.log(state, category, price)

    setLoading(true)

    // create a function that checks if the string includes '(any)'
    const isDefault = (str) => {
      return str.split(' ').includes('(any)')
    }

    //console.log(isDefault(state))

    //console.log(price)
    //console.log(price.split(' '))
    //console.log(price.split(' ')[0])
    //console.log(parseInt(price.split(' ')[0]))

    // get first value of price and parse it to number
    const minPrice = parseInt(price.split(' ')[0])
    //console.log(minPrice)

    // ger second value of price which is the maximum price and parse it to number
    const maxPrice = parseInt(price.split(' ')[2])
    //console.log(maxPrice)

    // eslint-disable-next-line
    const newListings = listingsData.filter((listing) => {
      //console.log(listing.data.price)
      const listingPrice = listing.data.price
      //console.log(listingPrice)

      // if all values are selected
      //console.log(listing.data.state)
      //console.log(state)
      //console.log(listing.data.type)
      //console.log(category)
      if (
        listing.data.state === state &&
        listing.data.type === category &&
        listingPrice >= minPrice &&
        listingPrice <= maxPrice
      ) {
        /*
        console.log(listing.data.state)
        console.log(state)
        console.log(listing.data.type)
        console.log(category)
        console.log(listingPrice)
        console.log(minPrice)
        console.log(maxPrice)
        */
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

    //return newListings
    //console.log(listings)
    //console.log(newListings.length)
    //console.log(newListings)

    setTimeout(() => {
      return (
        newListings.length < 1 ? setListings([]) : setListings(newListings),
        setLoading(false)
      )
    }, 350)

    /*
    if (newListings.length < 1) {
      return setListings([])
    } else {
      return setListings(newListings), setLoading(false)
    }
    */
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
