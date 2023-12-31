// import react
import { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

// import icons
import { IconContext } from 'react-icons/lib'
import { BiBed, BiBath, BiArea } from 'react-icons/bi'
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'

function ListingItem({ listing, id, onDelete, onEdit }) {
  const [hoverDelete, setHoverDelete] = useState(false)
  const [hoverEdit, setHoverEdit] = useState(false)
  const {
    imgUrls,
    name,
    propertyType,
    state,
    address,
    bedrooms,
    bathrooms,
    surfaceArea,
    price,
    type,
  } = listing
  return (
    <>
      <Link to={`/${type}/${id}`}>
        <div className='bg-white shadow-1 p-[20px] rounded-lg w-full max-w-[352px] mx-auto hover:shadow-2xl transition'>
          {onDelete && (
            <IconContext.Provider
              value={{
                size: '20px',
              }}
            >
              <AiFillDelete
                className='cursor-pointer relative float-right ml-[10px] mb-[10px] transition z-[99999999]'
                onMouseEnter={() => setHoverDelete(true)}
                onMouseLeave={() => setHoverDelete(false)}
                fill={hoverDelete ? '#f25757' : '#a7a7a7'}
                onClick={(e) => {
                  e.preventDefault()
                  onDelete(id, name)
                }}
              />
            </IconContext.Provider>
          )}
          {onEdit && (
            <IconContext.Provider
              value={{
                size: '20px',
              }}
            >
              <AiFillEdit
                className='cursor-pointer relative float-right mb-[7.5px] mr-[6px] top-[1px] transition'
                onMouseEnter={() => setHoverEdit(true)}
                onMouseLeave={() => setHoverEdit(false)}
                fill={hoverEdit ? '#f97316' : '#a7a7a7'}
                onClick={(e) => {
                  e.preventDefault()
                  onEdit(id)
                }}
              />
            </IconContext.Provider>
          )}

          <div className=''>
            <img
              className='mb-[32px] object-cover min-h-[312px] lg:min-h-[243px] xl:min-h-[312px]'
              src={imgUrls[0]}
              alt={name}
            />
          </div>
          <div className='mb-[16px] flex gap-x-[8px] text-sm'>
            <div className='bg-[#a7a7a7] rounded-full text-white px-[12px] capitalize'>
              {propertyType}
            </div>
            <div className='bg-[#f97316] rounded-full text-white px-[12px] capitalize'>
              {state}
            </div>
          </div>
          <div className='h-[56px] overflow-hidden text-lg font-semibold max-w-[275px] md:max-w-[265px]'>
            {address}
          </div>
          <div className='flex flex-row lg:flex-col xl:flex-row gap-x-4 my-4'>
            <div className='flex items-center text-gray-600 gap-1'>
              <div className='text-[20px]'>
                <BiBed />
              </div>
              <div>{bedrooms > 1 ? `${bedrooms} Beds` : '1 Bed'}</div>
            </div>
            <div className='flex items-center text-gray-600 gap-1'>
              <div className='text-[20px]'>
                <BiBath />
              </div>
              <div>{bathrooms > 1 ? `${bathrooms} Baths` : '1 Bath'}</div>
            </div>
            <div className='flex items-center text-gray-600 gap-1'>
              <div className='text-[20px]'>
                <BiArea />
              </div>
              <div>{surfaceArea} sq ft</div>
            </div>
          </div>

          <div className='text-lg font-semibold text-[#f97316] mb-4 tracking-[-0.25px]'>
            ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            {type === 'rent' && '/ Month'}
          </div>
        </div>
      </Link>
    </>
  )
}

ListingItem.propTypes = {
  listing: PropTypes.object.isRequired,
}

export default ListingItem
