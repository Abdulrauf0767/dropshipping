import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {useParams,Link, useNavigate} from 'react-router-dom'
import { getSeller } from '../features/SellerFeature';
const ChooseOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const seller = useSelector((state) => state.seller.seller);
    useEffect(() => {
        dispatch(getSeller());
    },[dispatch])

    const handleBuyNowFormer = () => {
        navigate(`/home/buy-now-for-me/${id}`);
      };
    const handleBuyNowForSomeone = () => {
        if (seller?.user?.role === 'seller') {
            navigate(`/home/buy-now-for-me/${id}`);
        } else {
            navigate(`/home/seller-information/${id}`);
        }

      };


  return (
    <div className='w-full h-screen flex items-center justify-center bg-gray-100 ' >
        <div className='w-full  flex flex-col items-center gap-y-5 ' >
            
            <div onClick={handleBuyNowFormer}  className='w-[300px] bg-white  h-[200px] text-2xl font-lisuBusa rounded-md flex items-center justify-center shadow-md border-2 border-gray-400  ' >
                <h3 className='text-2xl font-lisuBusa ' >Order For You</h3>    
            </div>
            <div onClick={handleBuyNowForSomeone}  className='w-[300px] h-[200px]  bg-white text-2xl font-lisuBusa rounded-md flex items-center justify-center shadow-md border-2 border-gray-400  ' >
                <h3 className='text-2xl font-lisuBusa ' >Order For Someone</h3>    
            </div>
        </div>
    </div>
  )
}

export default ChooseOrder
