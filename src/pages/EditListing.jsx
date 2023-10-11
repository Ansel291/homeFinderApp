// import react
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// import firebase
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject, // TODO: Import deleteObject function from firebase/storage
} from 'firebase/storage'
import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore'
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

function EditListing() {
  // eslint-disable-next-line
  const [geolocationEnabled, setGeolocationEnabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [listing, setListing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const [selectedState, setSelectedState] = useState(listedStates[0])
  //const [selectedState, setSelectedState] = useState('')
  //console.log(selectedState)
  //console.log(selectedState.value)

  const [imagesToRemove, setImagesToRemove] = useState([])

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
  const params = useParams()
  //console.log(params)
  //console.log(params.id)
  const isMounted = useRef(true)

  // Redirect if listing is not user's
  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("You're not authorized to edit that listing")
      navigate('/')
    }
  }, [auth.currentUser.uid, listing, navigate])

  // Fetch listing to edit
  useEffect(() => {
    console.log('useEffect loaded')
    setLoading(true)
    const fetchListing = async () => {
      console.log('fetchListing loaded')
      const docRef = doc(db, 'listings', params.id)
      console.log(docRef)
      const docSnap = await getDoc(docRef)
      console.log(docSnap)
      if (docSnap.exists()) {
        setListing(docSnap.data())
        console.log(docSnap.data())

        setFormData({ ...docSnap.data(), address: docSnap.data().address })
        /*
        setFormData(docSnap.data())
        */
        /*
        setSelectedState({ ...docSnap.data().state })
        */
        /*
        console.log(docSnap.data().state)
        console.log(listedStates)
        */

        listedStates.filter((listing) => {
          //console.log(listing.stateName)
          //console.log(docSnap.data().state)
          if (listing.stateName === docSnap.data().state) {
            //console.log(listing.id)
            let stateIndex = listing.id - 1
            setSelectedState(listedStates[stateIndex])
            //return listing.id
          }
        })
        //console.log(fetchedStateId)
        //setSelectedState(listedStates[20])
        setLoading(false)
      } else {
        navigate('/')
        toast.error('Listing does not exists')
      }
    }

    fetchListing()
  }, [params.id, navigate])

  // Sets  userRef to logged in user
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

    /*
    if (images.length > 6) {
      setLoading(false)
      toast.error('Max 6 images')
      return
    }
    */

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

        // create storage reference --> pass in storage + path + filename
        const storageRef = ref(storage, 'images/' + fileName)

        const uploadTask = uploadBytesResumable(storageRef, image)

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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

    // TODO: Throw an error if new image TOTAL is not 6 or less
    //const availableImageStorage =
    console.log(listing.imgUrls.length)
    //console.log(images.length)

    const availableImageStorage =
      6 - listing.imgUrls.length + imagesToRemove.length
    console.log(availableImageStorage)

    if (images && images.length > availableImageStorage) {
      //console.log(images.length)
      setLoading(false)
      toast.error(
        'Image Upload failed - Too many total images for this listing'
      )
      return
    }

    // Return an error only if new images were added AND the total files exceeds

    // TODO: IF new images were uploaded, Store the returned imageUrls in a new array
    let newImageUrls
    if (images) {
      newImageUrls = await Promise.all(
        [...images].map((image) => storeImage(image))
      ).catch(() => {
        setLoading(false)
        toast.error('Images not uploaded')
        return
      })
    }
    //console.log(newImageUrls)

    /*
    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false)
      toast.error('Images not uploaded')
      return
    })
    //console.log(imgUrls)
    */

    // TODO: Function to Delete an Image from Storage
    const deleteImage = async (imgUrl) => {
      // Split URL to get the filename in the middle
      console.log(imgUrl)
      let fileName = imgUrl.split('images%2F')
      console.log(fileName)
      fileName = fileName[1].split('?alt')
      console.log(fileName)
      fileName = fileName[0]
      console.log(fileName)

      const storage = getStorage()

      // Create a reference to the file to delete
      const imgRef = ref(storage, `images/${fileName}`)
      console.log(imgRef)

      // Returns a promise
      return deleteObject(imgRef)
    }

    //TODO: Delete each image in imagesToRemove from storage
    imagesToRemove.forEach(async (imgUrl) => {
      await deleteImage(imgUrl) // Handle the returned promise
        .then(() => {
          /*
          //toast.success('Image was successfully removed from storage')
          */
        })
        .catch((error) => {
          console.log(error)
          toast.error('Deletion failed')
          setLoading(false)
        })
    })

    //TODO: Remove all imagesToRemove from current imageUrls for this listing
    const remainingListingImages = listing.imgUrls.filter(
      (val) => !imagesToRemove.includes(val)
    )

    //TODO: Merge ImageUrls with newImageUrls (if defined) --> Then Delete newImageUrls
    let mergedImageUrls
    console.log(mergedImageUrls)
    if (newImageUrls) {
      mergedImageUrls = [...remainingListingImages, ...newImageUrls]
    } else {
      mergedImageUrls = [...remainingListingImages]
    }

    const formDataCopy = {
      ...formData,
      imgUrls: mergedImageUrls,
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

    //const docRef = await addDoc(collection(db, 'listings'), formDataCopy)

    // Update listing
    const docRef = doc(db, 'listings', params.id)
    await updateDoc(docRef, formDataCopy)
    setLoading(false)
    toast.success('Listing updated')
    navigate(`/${formDataCopy.type}/${docRef.id}`)
  }

  // Form Data Changed
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

  const handleChange = (e) => {
    if (e.target.checked) {
      // Case 1 : The user checks the box
      setImagesToRemove([...imagesToRemove, e.target.value])
      console.log(imagesToRemove)
    } else {
      // Case 2 : The user unchecks the box
      setImagesToRemove((current) =>
        current.filter((url) => {
          return url !== e.target.value
        })
      )
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
    <div>
      <div className='container mx-auto'>
        <header className='page-header'>Edit Listing</header>
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
            <div className='mb-[24px]' />

            {/* TODO: Display Current Images (Noting Cover) with Delete Buttons --> Then display "Add Image" Option */}

            <label className='form-label'>Images:</label>
            <p className='text-[16px] opacity-75 my-[16px] text-center sm:text-left'>
              DELETE: Check the box of each image you wish to delete
            </p>

            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[1rem]'>
              {listing?.imgUrls &&
                listing.imgUrls.map((img, index) => (
                  <div
                    key={index}
                    className='w-[100%] h-[125px] md:h-[175px] lg:h-[125px] xl:h-[140px] rounded-[16px] relative  sm:m-[0px]'
                    style={{
                      background: `url('${img}') center no-repeat`,
                      backgroundSize: 'cover',
                    }}
                  >
                    {index === 0 && (
                      <p className='text-[14px] sm:text-[15px] absolute top-[5px] py-[5px] px-[10px] font-[700] text-[#fff] bg-[#000] mt-[16px] opacity-[0.8]'>
                        Cover
                      </p>
                    )}

                    <input
                      type='checkbox'
                      id='imageDelete'
                      name='imageDelete'
                      className='absolute top-[15px] right-[15px] h-[18px] w-[18px]'
                      value={img}
                      onChange={handleChange}
                    />
                  </div>
                ))}
            </div>

            {/* Displays the number of remaining spots available after checked images are deleted */}
            <p className='text-[16px] mt-[16px] mb-[16px] text-center sm:text-left'>
              ADD: Choose files to add. (
              {listing?.imgUrls &&
                imagesToRemove &&
                ` ${
                  6 - listing.imgUrls.length + imagesToRemove.length
                } image slots remaining`}{' '}
              - Max 6 total )
            </p>

            <input
              className='form-input-file shadow-1 w-full'
              type='file'
              id='images'
              onChange={onMutate}
              max='6'
              accept='.jpg,.png,.jpeg'
              multiple
            />
            <button
              type='submit'
              className='primary-button create-listing-button'
            >
              Edit Listing
            </button>
          </form>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default EditListing
