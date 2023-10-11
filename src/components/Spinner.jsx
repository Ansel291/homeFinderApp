function Spinner() {
  return (
    <div className='fixed top-0 right-0 bottom-0 left-0 spinner-background-color z-5000 flex justify-center items-center'>
      <div className='w-[64px] h-[64px] border-solid border-8 rounded-[50%] loading-spinner'></div>
    </div>
  )
}

export default Spinner
