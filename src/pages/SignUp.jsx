// import React
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// import libraries
import { toast } from 'react-toastify'

// import firebase
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'

// import components
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import RightArrow from '../components/RightArrow'
import OAuth from '../components/OAuth'
import Footer from '../components/Footer'

function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const { name, email, password } = formData

  const navigate = useNavigate()

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = userCredential.user
      updateProfile(auth.currentUser, {
        displayName: name,
      })

      const formDataCopy = { ...formData }
      delete formDataCopy.password

      formDataCopy.timestamp = serverTimestamp()

      await setDoc(doc(db, 'users', user.uid), formDataCopy)

      navigate('/profile')
    } catch (error) {
      console.log(error)
      toast.error('Something went wrong with registration')
    }
  }

  return (
    <>
      <div className='container mx-auto'>
        <header>
          <p className='page-header'>Create Account</p>
        </header>
        <main>
          <form onSubmit={onSubmit}>
            <input
              type='text'
              className='form-input name-input shadow-1 mb-[32px]'
              placeholder='Name'
              id='name'
              value={name}
              onChange={onChange}
            />
            <input
              type='email'
              className='form-input email-input shadow-1 mb-[32px]'
              placeholder='Email'
              id='email'
              value={email}
              onChange={onChange}
            />
            <div className='password-input-div relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                className='form-input password-input shadow-1 mb-[40px]'
                placeholder='Password'
                id='password'
                value={password}
                onChange={onChange}
              />
              <img
                className='absolute right-[18px] top-[13px]'
                src={visibilityIcon}
                alt='Show Password'
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            </div>

            <div className='flex items-center justify-center sm:justify-start mb-[36px] sm:mb-[7.5px] md:mb-[0px]'>
              <p className='text-[24px] font-[700]'>Sign Up</p>
              <button className='ml-[16px] sm:ml-[24px]'>
                <RightArrow />
              </button>
            </div>
          </form>

          {/* Google OAuth */}
          <OAuth />

          <Link
            to='/sign-in'
            className='block font-semibold text-center text-orange-500 hover:text-orange-600'
          >
            Sign In Instead
          </Link>
        </main>
      </div>
      <Footer />
    </>
  )
}

export default SignUp
