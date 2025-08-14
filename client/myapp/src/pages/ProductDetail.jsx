import React, { useEffect, useState } from 'react'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProducts } from '../features/ProductFeatures'
import Header from '../components/Header'
import {addProductToWishlist} from '../features/WishlistFeature'
import { addProductToCart } from '../features/CartFeatures';
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.product.list);
  const error = useSelector((state) => state.product.error);
  const status = useSelector((state) => state.product.status);
  const product = allProducts.find((product) => product._id === id);

  // Related products: Match by category, then optionally by tags
  const relatedProducts = allProducts.filter((p) => {
    if (!product) return false;
    if (p._id === product._id) return false; // exclude current product

    // Category must match
    const sameCategory = p.category === product.category;

    // Tags match is optional
    const tagMatch =
      product.tags && p.tags
        ? p.tags.some((tag) => product.tags.includes(tag))
        : true; // if no tags, still allow

    return sameCategory && tagMatch;
  });

  // Selected image index state
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  // Reset selectedIndex when product changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [product]);

  const addToWishlist = () => {
    dispatch(addProductToWishlist(id)).unwrap().then(() => {
      alert('Product added to wishlist successfully!');
    }).catch((error) => {
      alert( error.message);
    });
  };

  const handleBuyNow = () => {
    navigate(`/home/choose-order/${id}`);
  };

  const addToCart = () => {
    dispatch(addProductToCart(id)).unwrap().then(() => {
      alert('Product added to cart successfully!');
    }).catch((error) => {
      alert( error.message);
    })
  };

  return (
    <div className='w-full h-full'>
      <Header />
      <div className='mt-20 flex flex-col lg:flex-row items-start justify-between w-[95%] h-full p-4 mx-auto'>
        {/* img section */}
        <div className='lg:w-[50%] w-full h-[700px] flex flex-col items-start gap-y-5 p-4'>
          {product && product.image.length > 0 && (
            <div className='w-full h-[85%] flex items-center justify-center shadow-md rounded-md p-2'>
              {/* Big image */}
              <img
                src={product.image[selectedIndex].url}
                alt={product.name}
                className='w-full h-full object-fill rounded-md'
              />
            </div>
          )}
          {product && product.image.length > 1 && (
            <div className='w-full h-[15%] flex items-center gap-x-2 p-2'>
              {product.image.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedIndex(index)}  // Set selected index on click
                  className={`w-[20%] h-full flex items-center justify-center p-2 cursor-pointer rounded-md
                    ${selectedIndex === index ? 'border-2 border-blue-500' : ''}
                  `}
                >
                  <img
                    src={image.url}
                    alt={product.name}
                    className='w-full h-full object-fill rounded-md'
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* text section */}
        <div className='lg:w-[48%] w-full h-auto flex flex-col items-start gap-y-3 ' >
          {product && (
            <>
              <h1 className='text-3xl font-bold font-lisuBusa '>{product.name}</h1>  
              <h3 className='text-2xl font-semibold font-lisuBusa flex items-center gap-x-2 '>
                Brand : 
                <p className='w-auto h-auto bg-[#a6edb1] font-lisuBusa p-3 pl-3 pr-3  rounded-3xl'>
                  {product.brand ? product.brand : 'N/A' }
                </p>
              </h3>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <StarOutlinedIcon
                    key={num}
                    style={{ color: num <= 4 ? 'orange' : 'inherit' }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-x-3">
                {product.discountPrice && product.discountPrice > 0 ? (
                  <>
                    {/* Original Price */}
                    <p className="text-xl font-semibold text-gray-500 line-through font-lisuBusa">
                      RS: {product.price}
                    </p>

                    {/* Final Price after discount */}
                    <p className="text-2xl font-bold text-[#de8d6a] font-lisuBusa">
                      RS: {product.price - product.discountPrice}
                    </p>

                    {/* Percentage Off */}
                    <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                      {Math.round((product.discountPrice / product.price) * 100)}% OFF
                    </span>
                  </>
                ) : (
                  <>
                    {/* Only Price */}
                    <p className="text-2xl font-bold font-lisuBusa">
                      RS: {product.price}
                    </p>
                  </>
                )}
              </div>

              <p className='text-lg text-gray-500 font-lisuBusa '>{product.description}</p>
              <p className='text-lg font-semibold font-lisuBusa flex items-center gap-x-2'>
                Colors : 
                <span className='text-[#de8d6a] font-lisuBusa'>
                  {product.color && product.color.length > 0
                    ? product.color.join(' ')
                    : 'N/A'}
                </span>
              </p>
              <p className="text-lg font-semibold font-lisuBusa flex items-center gap-x-2">
                Sizes:
                <span className="flex flex-wrap gap-2">
                  {product.sizes && product.sizes.length > 0 ? (
                    product.sizes.map((size, idx) => (
                      <button
                        key={idx}
                        className="px-3 py-1 bg-[#de8d6a] text-white font-lisuBusa rounded-lg hover:bg-[#c97755] transition"
                      >
                        {size}
                      </button>
                    ))
                  ) : (
                    <span className="text-[#de8d6a] font-lisuBusa">N/A</span>
                  )}
                </span>
              </p>
              <div className='w-full h-auto flex items-center gap-y-2 flex-col mt-10 ' >
                <button onClick={addToWishlist}  className='w-[50%] h-10  text-black border-2 border-black font-lisuBusa rounded-lg hover:bg-[#c97755] hover:text-white hover:border-none transition ' >Add to Wishlist</button>
                <button onClick={addToCart} className='w-[50%] h-10 bg-blue-500 text-white font-lisuBusa rounded-lg hover:bg-[#c97755] transition ' >Add to Cart</button>
                <button onClick={() => handleBuyNow(product._id)}  className='w-[50%] h-10 bg-[#de8d6a] text-white font-lisuBusa rounded-lg hover:bg-[#c97755] transition ' >Buy Now</button>
              </div>
            </>
          )}
        </div>
      </div>
  
      <div className="w-[95%] mx-auto mt-20">
        <h2 className="text-2xl font-bold font-lisuBusa mb-5">Related Products</h2>
        {relatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {relatedProducts.map((product) => (
              <Link key={product._id} to={`/home/productdetail/${product._id}`}>
                <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] rounded-md shadow-sm hover:shadow-md hover:scale-[102%] transition-all duration-300 border border-gray-200">
                  {/* Image Section */}
                  <div className="w-full h-[70%] p-2 flex items-center justify-center bg-gray-100 rounded-t-md">
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

                  {/* Text Section */}
                  <article className="w-full px-3 py-2 h-[30%] flex flex-col justify-between">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold truncate">
                      {product.name}
                    </h3>
                    <h4 className="text-sm sm:text-base md:text-lg font-bold text-[#de8d6a]">
                      Rs: {product.price}
                    </h4>
                  </article>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No related products found.</p>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
