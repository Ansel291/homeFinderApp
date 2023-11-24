import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'

// import components
import Footer from '../components/Footer'

function Contact() {
  const [message, setMessage] = useState('')
  const [landlord, setLandlord] = useState(null)
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams()

  const params = useParams()

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, 'users', params.landlordId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setLandlord(docSnap.data())
      } else {
        // This error will appear for listings where a landlord no longer exists
        toast.error('Could not get landlord data')
      }
    }

    getLandlord()
  }, [params.landlordId])

  const onChange = (e) => {
    setMessage(e.target.value)
  }

  return (
    <>
      <div className='container mx-auto min-h-[calc(100vh_-_228px)]'>
        <div className='max-w-[550px] mx-auto'>
          <header className='page-header-contact'>Contact Landlord</header>

          {landlord !== null && (
            <main>
              <div className='mb-[40px]'>
                <p className='font-[500] text-[18px] text-center'>
                  Get in touch with{' '}
                  <span className='capitalize'>{landlord.name}</span>
                </p>
              </div>
              <form>
                <div className='flex mb-[64px] flex-col'>
                  <label className='mb-[8px]' htmlFor='message'>
                    Message:
                  </label>
                  <textarea
                    name='message'
                    id='message'
                    className='text-area shadow-1 px-[48x]'
                    value={message}
                    onChange={onChange}
                  ></textarea>
                </div>
                <a
                  href={`mailto:${landlord.email}?Subject=${searchParams.get(
                    'listingName'
                  )}&body=${message}`}
                >
                  <button
                    type='button'
                    className='primary-button hover:bg-[#ea580c] transition'
                  >
                    Send Message
                  </button>
                </a>
              </form>
            </main>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Contact
