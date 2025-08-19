import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getSeller } from '../features/SellerFeature';

const ChooseOrder = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const seller = useSelector((state) => state.seller.seller);

  // Extract query parameter (type)
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");  // "proceed" ya "buy-now"

  useEffect(() => {
    dispatch(getSeller());
  }, [dispatch]);

  // ✅ Order For You
  const handleForMe = () => {
    if (type === "proceed") {
      navigate(`/home/proceed-to-me/${id}`);
    } else {
      navigate(`/home/buy-now-for-me/${id}`);
    }
  };

  // ✅ Order For Someone
  const handleForSomeone = () => {
    if (seller?.user?.role === "seller") {
      if (type === "proceed") {
        navigate(`/home/proceed-to-someone/${id}`);
      } else {
        navigate(`/home/buy-now-for-someone/${id}`);
      }
    } else {
      navigate(`/home/seller-information/${id}`);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full flex flex-col items-center gap-y-5">
        <div
          onClick={handleForMe}
          className="w-[300px] bg-white h-[200px] text-2xl font-lisuBusa rounded-md flex items-center justify-center shadow-md border-2 border-gray-400 cursor-pointer"
        >
          <h3 className="text-2xl font-lisuBusa">Order For You</h3>
        </div>
        <div
          onClick={handleForSomeone}
          className="w-[300px] h-[200px] bg-white text-2xl font-lisuBusa rounded-md flex items-center justify-center shadow-md border-2 border-gray-400 cursor-pointer"
        >
          <h3 className="text-2xl font-lisuBusa">Order For Someone</h3>
        </div>
      </div>
    </div>
  );
};

export default ChooseOrder;
