import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../features/ProductFeatures';
import { CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';

const Cards = () => {
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(1);
  const allProducts = useSelector((state) => state.product.list);
  const status = useSelector((state) => state.product.status);
  const error = useSelector((state) => state.product.error);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllProducts({ limit, page }));
  }, [limit, page, dispatch]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (status === 'failed') {
    return <p className="text-center text-red-600 mt-10">Error: {error}</p>;
  }

  return (
    <div className="w-[95%] h-full p-6 mx-auto mt-10">
      <div className="w-full h-full grid lg:grid-cols-4 grid-flow-row grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {allProducts
          .filter((product) => product.isActive)  // <-- Filter only active products
          .map((product) => (
            <Link key={product._id} to={`/home/productdetail/${product._id}`}>
              <div
                className="w-[160px] h-[250px] md:w-[220px] lg:w-[300px] md:h-[350px] rounded-md shadow-sm hover:shadow-md hover:scale-[102%] transition-all duration-300 border-2 border-gray-200"
              >
                <div className="w-full md:h-[78%] h-[70%] p-4 flex items-center justify-center bg-gray-100">
                  {product.image && product.image.length > 0 ? (
                    <img
                      src={product.image[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
                <article className="w-[96%] mx-auto p-4 md:h-[20%] h-[28%] ">
                  <h3 className="w-full md:text-lg text-sm font-semibold truncate line-clamp-2">{product.name}</h3>
                  <h4 className="w-full md:text-lg text-sm font-semibold">Rs : {product.price}</h4>
                </article>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Cards;
