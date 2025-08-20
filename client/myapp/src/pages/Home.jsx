import React from 'react'
import Header from '../components/Header'
import HeroBanner from '../components/HeroBanner'
import Cards from '../components/Cards'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <Header/>
      <HeroBanner/>
      <Cards/>
      <FAQ/>
      <Footer/>
    </div>
  )
}

export default Home
