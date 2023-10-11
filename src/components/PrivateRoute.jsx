import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStatus } from '../hooks/useAuthStatus'

// import components
import Spinner from './Spinner'

const PrivateRoute = () => {
  //const loggedIn = false
  const { loggedIn, checkingStatus } = useAuthStatus()
  //console.log(loggedIn)
  //console.log(checkingStatus)

  if (checkingStatus) {
    return <Spinner />
  }

  return loggedIn ? <Outlet /> : <Navigate to='/sign-in' />
}

export default PrivateRoute
