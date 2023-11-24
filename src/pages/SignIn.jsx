// import React
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// import libraries
import { toast } from 'react-toastify'

// import firebase
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

// import components
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import RightArrow from '../components/RightArrow'
import OAuth from '../components/OAuth'
import Footer from '../components/Footer'

function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const { email, password } = formData

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

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      if (userCredential.user) {
        navigate('/profile')
      }
    } catch (error) {
      console.log(error)
      toast.error('Bad User Credentials')
    }
  }

  return (
    <>
      <div className='container mx-auto'>
        <header>
          <p className='page-header'>Welcome Back!</p>
        </header>
        <main>
          <form onSubmit={onSubmit}>
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
                className='form-input password-input shadow-1 mb-[16px]'
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

            <Link
              to='/forgot-password'
              className='cursor-pointer block font-semibold text-center sm:text-right text-orange-500 hover:text-orange-600 transition mb-[40px] sm:mb-[0px]'
            >
              Forgot Password
            </Link>

            <div className='flex items-center justify-center sm:justify-start mb-[36px] sm:mb-[7.5px] md:mb-[0px]'>
              <p className='text-[24px] font-[700]'>Sign In</p>
              <button className='ml-[16px] sm:ml-[24px]'>
                <RightArrow />
              </button>
            </div>
          </form>

          {/* Google OAuth */}
          <OAuth />

          <Link
            to='/sign-up'
            className='block font-semibold text-center text-orange-500 hover:text-orange-600'
          >
            Sign Up Instead
          </Link>
        </main>

        {/* <AiFillEye /> */}
      </div>
      <Footer />
    </>
  )
}

export default SignIn
