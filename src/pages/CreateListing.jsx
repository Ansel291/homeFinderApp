// import react
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// import firebase
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'

// import toastify
import { toast } from 'react-toastify'

// import uuid
import { v4 as uuidv4 } from 'uuid'

// import data
import { listedStates } from '../stateData'

// import components
import Spinner from '../components/Spinner'
import Footer from '../components/Footer'

// import Icons
import { IconContext } from 'react-icons/lib'
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri'
//import { MdLocationOn } from 'react-icons/md'
import { MdLocationOn } from 'react-icons/md'

// import headless ui
import { Listbox } from '@headlessui/react'

function CreateListing() {
  //const [geolocationEnabled, setGeolocationEnabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedState, setSelectedState] = useState(listedStates[0])
  //console.log(selectedState)
  //console.log(selectedState.value)

  const [formData, setFormData] = useState({
    type: 'sell',
    propertyType: 'house',
    //propertyType: listedStates[0].stateName,
    description: '',
    surfaceArea: 0,
    name: '',
    //state: listedStates[0].stateName,
    state: selectedState.stateName,
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    parkingSpots: 1,
    address: '',
    price: 0,
    images: {},
    //latitude: 0,
    //longitude: 0,
  })

  const {
    type,
    propertyType,
    description,
    surfaceArea,
    name,
    state,
    bedrooms,
    bathrooms,
    parking,
    parkingSpots,
    address,
    price,
    images,
    //latitude,
    //longitude,
  } = formData

  const auth = getAuth()
  const navigate = useNavigate()
  const isMounted = useRef(true)

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid })
        } else {
          navigate('/sign-in')
        }
      })
    }

    return () => {
      isMounted.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  const onSubmit = async (e) => {
    e.preventDefault()
    //console.log(formData)

    setLoading(true)

    //console.log(images)
    //console.log(images.length)

    if (images.length > 6) {
      setLoading(false)
      toast.error('Max 6 images')
      return
    }

    let geolocation = {}
    console.log(geolocation)
    //let location
    let location
    //console(address)

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
    )

    const data = await response.json()

    console.log(data)

    geolocation.lat = data.results[0]?.geometry.location.lat ?? 0
    geolocation.lng = data.results[0]?.geometry.location.lng ?? 0
    //console.log(geolocation)

    //location = data.status === 'ZERO_RESULTS'
    location =
      data.status === 'ZERO_RESULTS'
        ? undefined
        : data.results[0]?.formatted_address

    console.log(location)

    if (location === undefined || location.includes('undefined')) {
      //if (address === undefined || address.includes('undefined')) {
      setLoading(false)
      toast.error('Please enter a correct address')
      return
    }

    //console.log(location)

    // Store images in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage()
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

        const storageRef = ref(storage, 'images/' + fileName)

        const uploadTask = uploadBytesResumable(storageRef, image)

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('Upload is ' + progress + '% done')
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused')
                break
              case 'running':
                console.log('Upload is running')
                break
              default:
                break
            }
          },
          (error) => {
            reject(error)
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL)
              //console.log(downloadURL)
            })
          }
        )
      })
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false)
      toast.error('Images not uploaded')
      return
    })
    //console.log(imgUrls)

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
    }

    //formDataCopy.address = location.substring(0, 40)
    /*
    formDataCopy.address = location
    console.log(formDataCopy.address)
    */

    delete formDataCopy.images
    /*
    delete formDataCopy.address
    */
    /*
    location && (formDataCopy.location = location)
    */
    //address && (formDataCopy.address = address)
    //console.log(formDataCopy)
    //console.log(location)

    const docRef = await addDoc(collection(db, 'listings'), formDataCopy)
    setLoading(false)
    toast.success('Listing saved')
    navigate(`/${formDataCopy.type}/${docRef.id}`)
  }

  const onMutate = (e) => {
    /*
    let boolean = null
    */
    let newValue = e.target.value

    if (e.target.value === 'true') {
      /*
      boolean = true
      */
      newValue = true
      //console.log(boolean)
    }

    if (e.target.value === 'false') {
      /*
      boolean = false
      */
      newValue = false
      //console.log(boolean)
    }

    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }))
    }

    // Text/Booleans/Numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        /*
        [e.target.id]: boolean ?? e.target.value,
        */
        [e.target.id]: newValue,
      }))

      //console.log(e.target.id)
      //console.log(boolean)
      //console.log(e.target.value)
    }
  }

  const updateState = (selectedState) => {
    console.log('updateState Function fired')
    setSelectedState(selectedState)
    //console.log(e.currentTarget.value)
    console.log(selectedState.stateName)

    setFormData((prevState) => ({
      ...prevState,
      //state: selectedState,
      //state: e.target.value,
      state: selectedState.stateName,
    }))
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <>
      <div className='container mx-auto'>
        <header className='page-header'>Create a Listing</header>
        <main>
          <form onSubmit={onSubmit}>
            <label className='form-label'>Sell / Rent:</label>
            <div className='flex'>
              <button
                type='button'
                className={`shadow-1 hover:shadow-lg transition ${
                  type === 'sell' ? 'form-button-active' : 'form-button'
                }`}
                id='type'
                value='sell'
                onClick={onMutate}
              >
                Sell
              </button>
              <button
                type='button'
                className={`shadow-1 hover:shadow-lg transition ${
                  type === 'rent' ? 'form-button-active' : 'form-button'
                }`}
                id='type'
                value='rent'
                onClick={onMutate}
              >
                Rent
              </button>
            </div>

            <label className='form-label'>Property Type:</label>
            <div className='flex'>
              <button
                type='button'
                className={`shadow-1 hover:shadow-lg transition ${
                  propertyType === 'house'
                    ? 'form-button-active'
                    : 'form-button'
                }`}
                id='propertyType'
                value='house'
                onClick={onMutate}
              >
                House
              </button>
              <button
                type='button'
                className={`shadow-1 hover:shadow-lg transition ${
                  propertyType === 'apartment'
                    ? 'form-button-active'
                    : 'form-button'
                }`}
                id='propertyType'
                value='apartment'
                onClick={onMutate}
              >
                Apartment
              </button>
            </div>

            <label className='form-label mb-[5px]'>Location:</label>

            <Listbox
              as='div'
              className='dropdown-state relative'
              value={selectedState}
              onChange={updateState}
              //onChange={(setSelectedState, updateState)}
              //onChange={(setSelectedState, onMutate)}
              //onChange={(e) => console.log(e.currentTarget.value)}
              //onChange={() => updateState}
            >
              <Listbox.Button
                className={`dropdown-btn-state w-full text-left shadow-1 ${
                  isOpen ? 'border-b-[1px]' : ''
                }`}
                onClick={() => setIsOpen(!isOpen)}
              >
                <IconContext.Provider
                  value={{
                    size: '24px',
                  }}
                >
                  <MdLocationOn className='dropdown-icon-primary' />
                </IconContext.Provider>
                <div>
                  <div className='text-[15px] font-[500] leading-tight'>
                    {/*
                  {listedStates[0].stateName}
                  */}
                    {selectedState.stateName}
                  </div>
                  <div className='text-[13px]'>Select your state</div>
                </div>
                {isOpen ? (
                  <RiArrowUpSLine className='dropdown-icon-secondary' />
                ) : (
                  <RiArrowDownSLine className='dropdown-icon-secondary' />
                )}
              </Listbox.Button>

              <Listbox.Options
                onClick={() => setIsOpen(!isOpen)}
                className='dropdown-menu h-[308px] overflow-x-hidden overflow-y-auto'
              >
                {listedStates.map((listedState) => (
                  <Listbox.Option
                    key={listedState.id}
                    value={listedState}
                    disabled={listedState.unavailable}
                    className='cursor-pointer hover:text-[#f97316] transition'
                    as='li'
                    //onClick={updateState}
                  >
                    {listedState.stateName}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>

            <label className='form-label'>Name:</label>
            <input
              className='form-input-name shadow-1'
              type='text'
              id='name'
              value={name}
              onChange={onMutate}
              maxLength='32'
              minLength='10'
              required
            />

            <div className='form-rooms flex'>
              <div>
                <label className='form-label'>Bedrooms:</label>
                <input
                  className='form-input-small shadow-1'
                  type='number'
                  id='bedrooms'
                  value={bedrooms}
                  onChange={onMutate}
                  min='1'
                  max='50'
                  required
                />
              </div>
              <div>
                <label className='form-label'>Bathrooms:</label>
                <input
                  className='form-input-small shadow-1'
                  type='number'
                  id='bathrooms'
                  value={bathrooms}
                  onChange={onMutate}
                  min='1'
                  max='50'
                  required
                />
              </div>
            </div>

            <label className='form-label'>Surface Area:</label>
            <div className='flex items-center'>
              <input
                className='form-input-small shadow-1'
                type='number'
                id='surfaceArea'
                value={surfaceArea}
                onChange={onMutate}
                min='1'
                max='750000000'
                required
              />
              <p className='ml-[-24px] font-[600]'>Sq Feet</p>
            </div>

            <label className='form-label'>Parking spot:</label>
            <div className='form-buttons flex'>
              <button
                className={`shadow-1 hover:shadow-lg transition ${
                  parking === true ? 'form-button-active' : 'form-button'
                }`}
                type='button'
                id='parking'
                value={true}
                onClick={onMutate}
                min='1'
                max='50'
              >
                Yes
              </button>
              <button
                className={`shadow-1 hover:shadow-lg transition ${
                  !parking && parking !== null
                    ? 'form-button-active'
                    : 'form-button'
                }`}
                type='button'
                id='parking'
                value={false}
                onClick={onMutate}
              >
                No
              </button>
            </div>

            {parking && (
              <div>
                <label className='form-label'>Parking Spots:</label>
                <input
                  className='form-input-small shadow-1'
                  type='number'
                  id='parkingSpots'
                  value={parkingSpots}
                  onChange={onMutate}
                  min='1'
                  max='50'
                  required
                />
              </div>
            )}

            <label className='form-label'>Address:</label>
            <textarea
              className='form-input-address shadow-1'
              type='text'
              id='address'
              value={address}
              onChange={onMutate}
              required
            />

            <label className='form-label'>Price:</label>
            <div className='flex items-center'>
              <input
                className='form-input-small shadow-1'
                type='number'
                id='price'
                value={price}
                onChange={onMutate}
                min='50'
                max='750000000'
                required
              />
              {type === 'rent' && (
                <p className='ml-[-24px] font-[600]'>$ / Month</p>
              )}
            </div>

            <label className='form-label'>Description:</label>
            <textarea
              className='form-input-desc shadow-1'
              type='text'
              id='description'
              value={description}
              onChange={onMutate}
              required
            />

            <label className='form-label'>Images:</label>
            <p className='text-[14px] opacity-75 my-[8px]'>
              The first image will be the cover (max 6). Images must be .jpg,
              .jpeg or .png and must be 2 Mb or less.
            </p>
            <input
              className='form-input-file shadow-1 w-full'
              type='file'
              id='images'
              onChange={onMutate}
              max='6'
              accept='.jpg,.png,.jpeg'
              multiple
              required
            />
            <button
              type='submit'
              className='primary-button create-listing-button'
            >
              Create Listing
            </button>
          </form>
        </main>
      </div>
      <Footer />
    </>
  )
}

export default CreateListing
