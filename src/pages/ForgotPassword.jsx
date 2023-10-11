// import react
import { useState } from 'react'
import { Link } from 'react-router-dom'

// import libraries
import { toast } from 'react-toastify'

// import firebase
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'

// import components
import RightArrow from '../components/RightArrow'
import Footer from '../components/Footer'

function ForgotPassword() {
  const [email, setEmail] = useState('')

  const onChange = (e) => {
    setEmail(e.target.value)
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, email)
      toast.success('Email was sent')
    } catch (error) {
      toast.effor('Could not send reset email')
    }
  }

  return (
    <>
      <div className='container mx-auto'>
        <header>
          <p className='page-header'>Forgot Password</p>
        </header>

        <main>
          <form onSubmit={onSubmit}>
            <input
              type='email'
              className='form-input email-input shadow-1 mb-[16px]'
              placeholder='Email'
              id='email'
              value={email}
              onChange={onChange}
            />

            <Link
              to='/sign-in'
              className='cursor-pointer block font-semibold text-center sm:text-right text-orange-500 hover:text-orange-600 transition mb-[48px] sm:mb-[0px]'
            >
              Sign In
            </Link>

            <div className='flex items-center justify-center sm:justify-start mb-[48px]'>
              <p className='text-[18px] sm:text-[20px] font-[700]'>
                Send Reset Link
              </p>
              <button className='ml-[12px] sm:ml-[18px]'>
                <RightArrow />
              </button>
            </div>
          </form>
        </main>
      </div>
      <div className='absolute w-[100%] bottom-[0]'>
        <Footer />
      </div>
    </>
  )
}

export default ForgotPassword
