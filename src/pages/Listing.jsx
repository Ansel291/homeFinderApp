// import react
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

// import leaflet
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

// import Swiper
import { Navigation, Pagination, A11y } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

// import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// import firebase
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'

// import components
import Spinner from '../components/Spinner'
import Footer from '../components/Footer'

// import icons
import { BiBed, BiBath, BiArea } from 'react-icons/bi'
import { TbParking } from 'react-icons/tb'

function Listing() {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)

  // initialize
  const navigate = useNavigate()
  const params = useParams()

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setListing(docSnap.data())
        setLoading(false)
      }
    }
    fetchListing()
  }, [navigate, params.id])

  if (loading) {
    return <Spinner />
  }

  return (
    <>
      <div>
        <section className='container mx-auto'>
          <div className='mt-[32.5px] mb-[16px] flex flex-col lg:flex-row lg:items-center lg:justify-between'>
            <div className='lg:max-w-[400px]'>
              <h2 className='text-[24px] font-[600] leading-[30px] mb-[12px] lg:mb-[10px]'>
                {listing.name}
              </h2>
              <h3 className='text-[16px] font-[400] mb-[20px]'>
                {listing.address}
              </h3>
            </div>
            <div className='mb-[16px] lg:mb-[0px] flex gap-x-[8px]'>
              <div className='bg-[#f97316] rounded-full text-white px-[12px] capitalize'>
                {listing.propertyType}
              </div>
              <div className='bg-[#a7a7a7]  rounded-full text-white px-[12px] capitalize'>
                for {listing.type === 'rent' ? 'rent' : 'sale'}
              </div>
              <div className='bg-[#a7a7a7] rounded-full text-white px-[12px] capitalize '>
                {listing.state}
              </div>
            </div>
            <div className='text-[24px] font-semibold text-[#f97316] tracking-[-0.25px]'>
              ${listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              {listing.type === 'rent' && '/ Month'}
            </div>
          </div>

          <div className='flex flex-col lg:flex-row'>
            <main className='lg:flex-[2] xl:flex-[1.75] min-w-[0px] lg:pr-[40px]'>
              <div className='xl:hidden'>
                <Swiper
                  modules={[Navigation, Pagination, A11y]}
                  slidesPerView={1}
                  navigation={true}
                  spaceBetween={20}
                  a11y={true}
                  pagination={{ clickable: true }}
                  className='mb-[16px] lg:hidden'
                >
                  {listing.imgUrls.map((url, index) => (
                    <SwiperSlide key={index}>
                      <div
                        style={{
                          background: `url('${listing.imgUrls[index]}') center no-repeat`,
                          backgroundSize: 'cover',
                        }}
                        className='h-[300px] lg:h-[315px]'
                      ></div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className='hidden xl:block'>
                <Swiper
                  modules={[Navigation, Pagination, A11y]}
                  slidesPerView={1}
                  navigation={true}
                  spaceBetween={0}
                  a11y={true}
                  pagination={{ clickable: true }}
                  className='mb-[30px]'
                >
                  {listing.imgUrls.map((url, index) => (
                    <SwiperSlide key={index}>
                      <div
                        style={{
                          background: `url('${listing.imgUrls[index]}') center no-repeat`,
                          backgroundSize: 'cover',
                        }}
                        className='h-[300px] lg:h-[315px] xl:h-[350px]'
                      ></div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className='flex items-center text-[#f97316] gap-x-6 mb-[4px]'>
                <div className='flex items-center gap-x-[6px]'>
                  <div className='text-[20px]'>
                    <BiBed />
                  </div>
                  <div className='capitalize font-[500]'>
                    {listing.bedrooms > 1
                      ? `${listing.bedrooms} beds`
                      : '1 bed'}
                  </div>
                </div>
                <div className='flex items-center gap-x-[6px]'>
                  <div className='text-[20px]'>
                    <BiBath />
                  </div>
                  <div className='capitalize font-[500]'>
                    {listing.bathrooms > 1
                      ? `${listing.bathrooms} baths`
                      : '1 bath'}
                  </div>
                </div>
                <div className='flex items-center gap-x-[6px]'>
                  <div className='text-[20px]'>
                    <BiArea />
                  </div>
                  <div className='font-[500]'>{listing.surfaceArea} sq ft</div>
                </div>
                {listing.parking && (
                  <div className='flex items-center text-[#f97316] hidden md:block'>
                    <div className='flex items-center gap-x-[6px]'>
                      <div className='text-[20px]'>
                        <TbParking />
                      </div>
                      <div className='capitalize font-[500]'>
                        {listing.parkingSpots > 1
                          ? `${listing.parkingSpots} parking spots`
                          : '1 parking spot'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {listing.parking && (
                <div className='flex items-center text-[#f97316] md:hidden'>
                  <div className='flex items-center gap-x-[6px]'>
                    <div className='text-[20px]'>
                      <TbParking />
                    </div>
                    <div className='capitalize font-[500]'>
                      {listing.parkingSpots > 1
                        ? `${listing.parkingSpots} parking spots`
                        : '1 parking spot'}
                    </div>
                  </div>
                </div>
              )}

              <div className='mt-[32px] lg:mt-[22px] mb-[32px]'>
                {listing.description}
              </div>
            </main>

            <aside className='lg:flex-[1]'>
              <div className='capitalize text-[16px] font-[600] mb-[10px] lg:hidden'>
                location:
              </div>

              <div className='w-[100%] h-[200px] lg:h-[238px] xl:h-[270px] mb-[-48px] overflow-hidden'>
                <MapContainer
                  style={{ height: '100%', width: '100%' }}
                  center={[listing.geolocation.lat, listing.geolocation.lng]}
                  zoom={13}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  />

                  <Marker
                    position={[
                      listing.geolocation.lat,
                      listing.geolocation.lng,
                    ]}
                  >
                    <Popup>{listing.address}</Popup>
                  </Marker>
                </MapContainer>
              </div>

              <a
                href='tel:310-909-9341'
                className='primary-button hover:bg-[#ea580c] transition'
              >
                Call: 310-909-9341
              </a>

              <Link
                to={`/contact/${listing.userRef}?listingName=${listing.name}`}
                className='secondary-button hover:bg-[#8e8e8e] transition'
              >
                Message {listing.type === 'rent' ? 'Landlord' : 'Seller'}
              </Link>
            </aside>
          </div>
        </section>
        <Footer />
      </div>
    </>
  )
}

export default Listing
