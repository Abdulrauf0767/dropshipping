import React, { useEffect } from 'react';
import { Container } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { getAllCategories } from '../features/ProductFeatures';

const AdminCategories = () => {
    // ✅ Map category names to images
    const categoryImages = {
        furniture: '/images/chair.jpg',
        electronics: '/images/phone.jpg',
        clothing: '/images/tshirt.jpg',
        books: '/images/books.jpg',
        beauty: '/images/beauty.jpg',
        default: '/images/default.jpg', // fallback image
    };

    const dispatch = useDispatch();
    const { list, status, error } = useSelector((state) => state.product);

    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch]);


    return (
        <Container maxWidth="xl">
            <h1 className='text-2xl font-bold font-lisuBusa mt-10 text-center'>Collection</h1>
            <div className='w-full h-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
                {list.map((item, index) => {
                    // ✅ Normalize category name
                    let categoryName = '';
                    if (typeof item === 'string') {
                        categoryName = item;
                    } else if (typeof item === 'object' && item !== null) {
                        // If backend returns object like { category: 'furniture' }
                        categoryName = item.category || item.name || 'default';
                    }

                    return (
                        <div
                            key={index}
                            className='bg-white lg:w-[300px] lg:h-[280px] w-[150px] h-[200px] md:w-[200px] md:h-[200px] shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300'
                        >
                            <img
                                src={categoryImages[categoryName] || categoryImages['default']}
                                alt={categoryName}
                                className='w-full h-[80%] object-fill rounded-md mb-4'
                            />
                            <h2 className='text-lg font-semibold text-center h-[20%]'>{categoryName}</h2>
                        </div>
                    );
                })}
            </div>
        </Container>
    );
};

export default AdminCategories;
