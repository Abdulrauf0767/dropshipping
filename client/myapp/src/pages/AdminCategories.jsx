import React, { useEffect } from 'react'
import {Container} from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { getAllCategories } from '../features/ProductFeatures';


const AdminCategories = () => {
    const categoryImages = {
               furniture : '/images/chair.jpg' 
}
    const dispatch = useDispatch();
    const {list, status, error} = useSelector((state) => state.product);
    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch]);
    console.log("Categories:", list);
  return (
    <Container maxWidth="xl" >
        <h1 className='text-2xl font-bold font-lisuBusa mt-10 text-center' >Collection </h1>
      <div className='w-full h-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 ' >
        {list.map((category, index) => (
          <div key={index} className='bg-white lg:w-[300px] lg:h-[280px] w-[150px] h-[200px] md:w-[200px] md:h-[200px]  shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300'>
            <img src={categoryImages[category]} alt={category} className='w-full h-[80%] object-fit rounded-md mb-4' />
            <h2 className='text-lg font-semibold text-center h-[20%] '>{category}</h2>
          </div>
        ))}
        </div>  
    </Container>
  )
}

export default AdminCategories
