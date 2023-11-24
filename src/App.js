// import routes and route
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// import libraries
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// import house context provider
import ListingContextProvider from './context/ListingContext'

// import components
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'

// import pages
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import Listing from './pages/Listing'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import CreateListing from './pages/CreateListing'
import Contact from './pages/Contact'
import EditListing from './pages/EditListing'

function App() {
  return (
    <ListingContextProvider>
      <Router>
        <div className='max-w-[1440px] mx-auto bg-white'>
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/:type/:id' element={<Listing />} />
            <Route path='/profile' element={<PrivateRoute />}>
              <Route path='/profile' element={<Profile />} />
            </Route>
            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/create-listing' element={<CreateListing />} />
            <Route path='/edit-listing/:id' element={<EditListing />} />
            <Route path='/contact/:landlordId' element={<Contact />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </ListingContextProvider>
  )
}

export default App
