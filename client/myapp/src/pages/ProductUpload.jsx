import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { uploadProduct } from '../features/ProductFeatures'; // apni actual file path yahan lagayen

const MAX_IMAGES = 5;

const ProductUpload = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.product);

  const [previewImages, setPreviewImages] = useState([]);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      discountPrice: '',
      color: '',
      brand: '',
      category: '',
      stock: '',
      sizes: '',
      image: [], // Changed to array to hold multiple images properly
      tags: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Product Name is required'),
      description: Yup.string().required('Product Description is required'),
      price: Yup.number()
        .typeError('Price must be a number')
        .positive('Price must be positive')
        .required('Price is required'),
      discountPrice: Yup.number()
        .typeError('Discount Price must be a number')
        .positive('Discount Price must be positive')
        .max(Yup.ref('price'), 'Discount Price must be less than or equal to Price')
        .nullable()
        .transform((value, originalValue) => (originalValue === '' ? null : value)),
      color: Yup.string(),
      brand: Yup.string(),
      category: Yup.string().required('Category is required'),
      stock: Yup.number()
        .typeError('Stock must be a number')
        .integer('Stock must be an integer')
        .min(0, 'Stock cannot be negative')
        .required('Stock is required'),
      sizes: Yup.string(),
      image: Yup.array()
        .min(1, `You must upload at least 1 image`)
        .max(MAX_IMAGES, `You can upload maximum ${MAX_IMAGES} images`)
        .required('At least one image is required')
        .test('fileType', 'Only image files are accepted', (files) => {
          if (!files) return false;
          for (let file of files) {
            if (!file.type.startsWith('image/')) return false;
          }
          return true;
        }),
      tags: Yup.string().required('Tags are required'),
    }),
    onSubmit: (values, { resetForm }) => {
      const colorsArray = values.color
        ? values.color.split(',').map((c) => c.trim()).filter(Boolean)
        : [];
      const sizesArray = values.sizes
        ? values.sizes.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      const tagsArray = values.tags
        ? values.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('price', values.price);
      if (values.discountPrice) formData.append('discountPrice', values.discountPrice);
      if (values.brand) formData.append('brand', values.brand);
      formData.append('category', values.category);
      formData.append('stock', values.stock);

      colorsArray.forEach((color) => formData.append('color[]', color));
      sizesArray.forEach((size) => formData.append('sizes[]', size));
      tagsArray.forEach((tag) => formData.append('tags[]', tag));

      // Append all images correctly
      values.image.forEach((file) => formData.append('image', file));

      dispatch(uploadProduct(formData))
        .unwrap()
        .then(() => {
          alert('Product uploaded successfully!');
          resetForm();
          setPreviewImages([]);
        })
        .catch((uploadError) => {
          alert(`Upload failed: ${uploadError}`);
        });
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.currentTarget.files); // convert FileList to Array

    // Merge newly selected files with existing ones (to avoid removing previous)
    let newImages = [...formik.values.image, ...files];

    // Remove duplicates by name and size (optional but recommended)
    newImages = newImages.filter(
      (file, index, self) =>
        index ===
        self.findIndex((t) => t.name === file.name && t.size === file.size && t.lastModified === file.lastModified)
    );

    if (newImages.length > MAX_IMAGES) {
      alert(`You can only upload up to ${MAX_IMAGES} images`);
      return; // don't update state if exceeds max
    }

    formik.setFieldValue('image', newImages);

    // Update preview URLs
    const previewUrls = newImages.map((file) => URL.createObjectURL(file));
    setPreviewImages(previewUrls);

    e.target.value = null; // reset input to allow re-select same files if needed
  };

  return (
    <div className="w-full min-h-screen flex items-start justify-center overflow-y-auto py-10 px-4 bg-gray-50">
      <div className="w-full max-w-md shadow-md rounded-md p-6 bg-white">
        <h1 className="text-2xl font-bold text-center mb-6 font-lisuBusa">Product Upload</h1>
        <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-4">
          <label htmlFor="name" className="text-lg font-lisuBusa">
            Product Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter Product Name"
            className="w-full h-10 border-2 border-gray-200 rounded-md px-2 outline-none"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name && <p className="text-red-600">{formik.errors.name}</p>}

          <label htmlFor="description" className="text-lg font-lisuBusa">
            Product Description
          </label>
          <input
            id="description"
            name="description"
            type="text"
            placeholder="Enter Product Description"
            className="w-full h-10 border-2 border-gray-200 rounded-md px-2 outline-none"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-600">{formik.errors.description}</p>
          )}

          <label htmlFor="price" className="text-lg font-lisuBusa">
            Price
          </label>
          <input
            id="price"
            name="price"
            type="number"
            placeholder="Enter Product Price"
            className="w-full h-10 border-2 border-gray-200 rounded-md px-2 outline-none"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.price}
          />
          {formik.touched.price && formik.errors.price && <p className="text-red-600">{formik.errors.price}</p>}

          <label htmlFor="discountPrice" className="text-lg font-lisuBusa">
            Discount Price (Optional)
          </label>
          <input
            id="discountPrice"
            name="discountPrice"
            type="number"
            placeholder="Enter Product Discount Price"
            className="w-full h-10 border-2 border-gray-200 rounded-md px-2 outline-none"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.discountPrice}
          />
          {formik.touched.discountPrice && formik.errors.discountPrice && (
            <p className="text-red-600">{formik.errors.discountPrice}</p>
          )}

          <label htmlFor="color" className="text-lg font-lisuBusa">
            Colors (comma separated, Optional)
          </label>
          <input
            id="color"
            name="color"
            type="text"
            placeholder="e.g. Red, Blue, Green"
            className="w-full h-10 border-2 border-gray-200 rounded-md px-2 outline-none"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.color}
          />
          {formik.touched.color && formik.errors.color && <p className="text-red-600">{formik.errors.color}</p>}

          <label htmlFor="brand" className="text-lg font-lisuBusa">
            Brand (Optional)
          </label>
          <input
            id="brand"
            name="brand"
            type="text"
            placeholder="Enter Product Brand"
            className="w-full h-10 border-2 border-gray-200 rounded-md px-2 outline-none"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.brand}
          />
          {formik.touched.brand && formik.errors.brand && <p className="text-red-600">{formik.errors.brand}</p>}

          <label htmlFor="category" className="text-lg font-lisuBusa">
            Category
          </label>
          <select name="category" id="category"className="w-full h-10 border-2 border-gray-200 rounded-md px-2 outline-none">
            <option selected value="choose">Choose Your Product Category</option>
            <option value="watch">Watch</option>
            <option value="hoodies">Hoodies</option>
            <option value="electric">electric</option>
            </select>
          {formik.touched.category && formik.errors.category && <p className="text-red-600">{formik.errors.category}</p>}

          <label htmlFor="stock" className="text-lg font-lisuBusa">
            Stock
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            placeholder="Enter Product Stock"
            className="w-full h-10 border-2 border-gray-200 rounded-md px-2 outline-none"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.stock}
          />
          {formik.touched.stock && formik.errors.stock && <p className="text-red-600">{formik.errors.stock}</p>}

          <label htmlFor="sizes" className="text-lg font-lisuBusa">
            Sizes (comma separated, Optional)
          </label>
          <input
            id="sizes"
            name="sizes"
            type="text"
            placeholder="e.g. XS, S, M, L, XL"
            className="w-full h-10 border-2 border-gray-200 rounded-md px-2 outline-none"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.sizes}
          />
          {formik.touched.sizes && formik.errors.sizes && <p className="text-red-600">{formik.errors.sizes}</p>}

          <label htmlFor="image" className="text-lg font-lisuBusa">
            Product Image (1 to 5)
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            multiple
            className="w-full border-2 border-gray-200 rounded-md px-2 py-1 outline-none"
            onChange={(e) => {
              handleImageChange(e);
              formik.handleBlur(e);
            }}
          />
          {formik.touched.image && formik.errors.image && <p className="text-red-600">{formik.errors.image}</p>}
          {previewImages.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {previewImages.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`preview-${idx}`}
                  className="w-20 h-20 object-cover rounded-md border border-gray-300"
                />
              ))}
            </div>
          )}

          <label htmlFor="tags" className="text-lg font-lisuBusa">
            Tags (comma separated)
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            placeholder="e.g. chair, furniture, office"
            className="w-full h-10 border-2 border-gray-200 rounded-md px-2 outline-none"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.tags}
          />
          {formik.touched.tags && formik.errors.tags && <p className="text-red-600">{formik.errors.tags}</p>}

          {status === 'loading' && <p className="text-blue-600 font-semibold">Uploading product...</p>}
          {status === 'failed' && error && <p className="text-red-600 font-semibold">Error: {error}</p>}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-[#5abdfa] text-white py-2 rounded-md mt-6 hover:bg-[#479ecb] transition disabled:opacity-50"
          >
            Upload Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductUpload;
