// import components
import Search from './Search'

function Hero() {
  return (
    <section className='mb-[40px] md:mb-[60px] lg:mb-[65px]'>
      <div className='min-h-[500px] sm:min-h-[640px] hero-container flex justify-center items-center'>
        <div className='container mx-auto'>
          <h1 className='text-[28px] sm:text-[48px] font-[700] text-[#fff] text-center uppercase drop-shadow-lg tracking-[1px] leading-[36px] sm:leading-[58px] mb-[25px]'>
            discover your <span className='text-[#f97316]'>dream home</span>
          </h1>
          <Search />
        </div>
        <img src='../assets/webp/heroImageBwTab.webp' height='200' />
      </div>
    </section>
  )
}

export default Hero
