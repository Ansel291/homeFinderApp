import { IconContext } from 'react-icons'
import { AiFillRightCircle } from 'react-icons/ai'

function RightArrow() {
  return (
    <div>
      <IconContext.Provider value={{ className: 'right-arrow', size: '58px' }}>
        <AiFillRightCircle />
      </IconContext.Provider>
    </div>
  )
}

export default RightArrow
