function Footer() {
  const footerYear = new Date().getFullYear()
  return (
    <div className='bg-black py-8 text-center text-[#fff] mt-[48px]'>
      <div className='text-[14px]'>
        <span className='text-[#f97316]'>&copy; {footerYear}.</span> All Rights
        Reserved.
      </div>
    </div>
  )
}

export default Footer
