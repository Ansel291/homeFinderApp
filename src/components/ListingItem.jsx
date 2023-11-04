// import react
import { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

// import context
//import { ListingContext } from '../context/ListingContext'

// import icons
//import { IoBedSharp } from 'react-icons/io'
import { IconContext } from 'react-icons/lib'
import { BiBed, BiBath, BiArea } from 'react-icons/bi'
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'
//import { IoBedSharp } from 'react-icons/io'

//import { MdBathtub } from 'react-icons/md'
//import { RxDimensions } from 'react-icons/rx'

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
  console.log('aaa')
  //console.log(id)
  return (
    <>
      <div>
        {onEdit && (
          <button
            className='cursor-pointer float-left mb-[7.5px] mr-[6px] top-[1px]'
            onClick={() => {
              onEdit(id)
            }}

            //onClick={onEdit(id)}
          >
            <AiFillEdit
              onMouseEnter={() => setHoverEdit(true)}
              onMouseLeave={() => setHoverEdit(false)}
              fill={hoverEdit ? '#f97316' : '#a7a7a7'}
            />
          </button>
        )}
        {onDelete && (
          <button
            className='cursor-pointer float-right ml-[20px] mb-[10px] mr-[50px]'
            onClick={() => {
              //e.preventDefault()
              //e.stopPropagation()
              onDelete(id, name)
            }}

            //onClick={onDelete(id, name)}
          >
            <AiFillDelete
              onMouseEnter={() => setHoverDelete(true)}
              onMouseLeave={() => setHoverDelete(false)}
              fill={hoverDelete ? '#f25757' : '#a7a7a7'}
            />
          </button>
        )}
      </div>
      {/* <Link to={`/${type}/${id}`}> */}
      <div>
        <div className='bg-white shadow-1 p-[20px] rounded-lg w-full max-w-[352px] mx-auto hover:shadow-2xl transition'>
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
      </div>
      {/*</Link>*/}
    </>
  )
}

ListingItem.propTypes = {
  listing: PropTypes.object.isRequired,
}

export default ListingItem
