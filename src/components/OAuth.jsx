// import react
import { useLocation, useNavigate } from 'react-router-dom'

// import firebase
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'

// import libraries
import { toast } from 'react-toastify'

// import assets
import googleIcon from '../assets/svg/googleIcon.svg'

function OAuth() {
  const navigate = useNavigate()
  const location = useLocation()

  const onGoogleClick = async () => {
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Check for user
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)

      // If user doesn't exist, create user
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        })
      }
      navigate('/profile')
    } catch (error) {
      toast.error('Could not authorize with Google')
    }
  }

  return (
    <div className='flex flex-col items-center'>
      <p> Sign {location.pathname === '/sign-up' ? ' up' : ' in'} with</p>
      <button
        className='pointer flex justify-center items-center p-[12px] mt-[10px] mb-[28px] w-[48px] h-[48px] bg-[#fff] rounded-[50%] google-shadow border-[#eaeaea] border-[1px] border-solid'
        onClick={onGoogleClick}
      >
        <img className='w-[100%]' src={googleIcon} alt='Google Icon' />
      </button>
    </div>
  )
}

export default OAuth
