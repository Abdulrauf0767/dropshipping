import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchProducts } from "../features/ProductFeatures"; // adjust import path
import Header from "../components/Header";

const SearchPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Parse query params from URL
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";
  const initialLimit = 50; // fixed 50 products per load
  const initialPage = parseInt(queryParams.get("page") || "1", 10);

  // Local state for pagination & products
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [products, setProducts] = useState([]);

  // Get product slice from redux store
  const productState = useSelector((state) => state.product || {});

  // Destructure with defaults
  const {
    list: reduxProducts = [],
    status = 'idle',
    error = null,
  } = productState;

  // Effect to dispatch search on query or page change
  useEffect(() => {
    if (query.trim()) {
      dispatch(searchProducts({ query, limit: initialLimit, page: currentPage }));
    } else {
      setProducts([]); // Clear products if no query
    }
  }, [dispatch, query, currentPage]);

  // Effect to append or reset products when reduxProducts changes
  useEffect(() => {
    if (currentPage === 1) {
      // First page, replace products
      setProducts(reduxProducts);
    } else {
      // Append new products if page > 1
      setProducts((prev) => {
        // Avoid duplicates by filtering new ones
        const newProducts = reduxProducts.filter(
          (p) => !prev.some((prevP) => prevP._id === p._id)
        );
        return [...prev, ...newProducts];
      });
    }
  }, [reduxProducts, currentPage]);

  // Update URL when page changes (for back/forward browser support)
  useEffect(() => {
    navigate(
      `/home/searchproduct?query=${encodeURIComponent(query)}&limit=${initialLimit}&page=${currentPage}`,
      { replace: true }
    );
  }, [currentPage, query, navigate]);

  // Pagination handlers (for Previous and Next)
  const goToPage = (newPage) => {
    if (newPage < 1) return;
    setCurrentPage(newPage);
  };

  // Load more handler - just increment current page by 1
  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <>
      <Header />
      <div className="w-[95%] h-full p-6 mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-4">Search results for "{query}"</h2>

        {status === "loading" && <p>Loading products...</p>}
        {status !== "loading" && products.length === 0 && (
          <p>No products found for your search.</p>
        )}
        
        <div className="w-full h-full grid lg:grid-cols-4 grid-flow-row grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products
            .filter((product) => product.isActive !== false)
            .map((product) => (
              <Link key={product._id} to={`/home/productdetail/${product._id}`}>
                <div
                  className="w-[160px] h-[250px] md:w-[220px] lg:w-[300px] md:h-[350px] rounded-md shadow-sm hover:shadow-md hover:scale-[102%] transition-all duration-300 border-2 border-gray-200"
                  title={product.name}
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
                    <h3 className="w-full md:text-lg text-sm font-semibold truncate line-clamp-2">
                      {product.name}
                    </h3>
                    <h4 className="w-full md:text-lg text-sm font-semibold">
                      Rs : {product.price}
                    </h4>
                  </article>
                </div>
              </Link>
            ))}
        </div>

        {/* Pagination buttons */}
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 border rounded">Page {currentPage}</span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={products.length < initialLimit}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Load More Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={status === "loading"}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {status === "loading" ? "Loading..." : "Load More"}
          </button>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
