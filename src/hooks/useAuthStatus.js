import { useEffect, useState, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export const useAuthStatus = () => {
  // assume user to be logged out
  const [loggedIn, setLoggedIn] = useState(false)
  // keep track to display a spinner while auth status is being checked
  const [checkingStatus, setCheckingStatus] = useState(true)
  const isMounted = useRef(true)

  useEffect(() => {
    if (isMounted) {
      //console.log(isMounted)
      const auth = getAuth()
      //console.log(auth)
      // auth listener to keep track of user signing in and out
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setLoggedIn(true)
        }
        setCheckingStatus(false)
      })
    }

    return () => {
      isMounted.current = false
    }
  }, [isMounted])
  return { loggedIn, checkingStatus }
}

// Protected routes in Firebase, v6
//https://stackoverflow.com/questions/65505665/protected-route-with-firebase

// Fix memory leak warning
//https://stackoverflow.com/questions/59780268/clean-memory-leakds-on-an-unmounted-component-in-react-hooks
