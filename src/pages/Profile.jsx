// import React
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

// import Firebase
import { getAuth, updateProfile } from 'firebase/auth'
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../firebase.config'

// import libraries
import { toast } from 'react-toastify'

// import components
import ListingItem from '../components/ListingItem'
import Footer from '../components/Footer'

// import icons
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'

function Profile() {
  const auth = getAuth()
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })

  const { name, email } = formData

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings')

      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      )

      const querySnap = await getDocs(q)

      let listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListings(listings)
      setLoading(false)
    }
    fetchUserListings()
  }, [auth.currentUser.uid])

  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  const onSubmit = async () => {
    try {
      //  If Stored Name doesn't match Updated Name in input field
      if (auth.currentUser.displayName !== name) {
        // Update display name in fb
        await updateProfile(auth.currentUser, {
          displayName: name,
        })

        // Update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name,
        })

        toast.success('Successfully updated personal details')
      }
    } catch (error) {
      console.log(error)
      toast.error('Could not update profile details')
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await deleteDoc(doc(db, 'listings', listingId))
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      )
      setListings(updatedListings)
      toast.success('Successfull deleted listing')
    }
  }

  const onEdit = (listingId) => {
    navigate(`/edit-listing/${listingId}`)
  }

  return (
    <>
      <div className='min-h-[calc(100vh_-_128px)]'>
        <div className='container mx-auto'>
          <header className='flex items-center justify-between mb-[32px]'>
            <p className='page-header-profile'>My Profile</p>
            <button
              type='button'
              className='font-[16px] font-500 text-[#000000bd] hover:text-[#ea580c] transition underline'
              onClick={onLogout}
            >
              Logout
            </button>
          </header>
          <main>
            <div className='flex justify-between max-w-[500px] mb-[16px]'>
              <p>Personal Details:</p>
              <p
                className='cursor-pointer font-[600] text-orange-500'
                onClick={() => {
                  changeDetails && onSubmit()
                  setChangeDetails((prevState) => !prevState)
                }}
              >
                {changeDetails ? 'done' : 'change'}
              </p>
            </div>

            <div className='max-w-[500px]'>
              <form className='mb-[32px]'>
                <input
                  type='text'
                  id='name'
                  className={
                    !changeDetails
                      ? 'form-input name-input shadow-1 mb-[16px]'
                      : 'form-input name-input shadow-1 mb-[16px] profileNameActive'
                  }
                  disabled={!changeDetails}
                  placeholder='Name'
                  value={name}
                  onChange={onChange}
                />
                <input
                  type='email'
                  className='form-input-profile email-input shadow-1 mb-[32px]'
                  disabled={true}
                  placeholder='Email'
                  id='email'
                  value={email}
                  onChange={onChange}
                />
              </form>
            </div>
            <Link
              to='/create-listing'
              className='flex items-center justify-between max-w-[500px] shadow-1 form-input-profile-create-listing mb-[48px]'
            >
              <img src={homeIcon} alt='home' />
              <p className='text-[#f97316] font-[600]'>Create Your Listing</p>
              <img src={arrowRight} alt='arrow right' />
            </Link>

            {!loading && listings.length > 0 && (
              <>
                <p className='font-[400] mb-[10px]'>Your Listings:</p>
                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-14'>
                  {listings.map((listing) => (
                    <ListingItem
                      key={listing.id}
                      listing={listing.data}
                      id={listing.id}
                      onDelete={() => onDelete(listing.id)}
                      onEdit={() => onEdit(listing.id)}
                    />
                  ))}
                </div>
              </>
            )}

            {!loading && listings.length === 0 && (
              <>
                <p className='text-center sm:text-left'>
                  You have no listings.
                </p>
              </>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Profile
