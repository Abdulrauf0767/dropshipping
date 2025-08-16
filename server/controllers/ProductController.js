let productModel = require('../models/Product.Model');
let cloudinary = require('../utils/CloudinaryImage');

class productController {
    // ✅ CREATE PRODUCT
async createProduct(req, res) {
    try {
        const userId = req.user._id;
        let { name, description, price, discountPrice, brand, category, stock, sizes, tags, color } = req.body;

        if (!name || !description || !price || !category || !stock || !tags) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // ✅ Check for images
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'At least one image is required' });
        }

        // ✅ Check image size (all images must be at least 2MB)
        for (const file of req.files) {
            if (file.size < 2 * 1024 * 1024) {
                return res.status(400).json({ message: 'Each image must be at least 2MB' });
            }
        }

        // ✅ Upload Images to Cloudinary (from memory buffer)
        let images = [];
        for (const file of req.files) {
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: "e-commerce/product-images",
                        resource_type: "image",
                        quality: "auto:best"
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(file.buffer);
            });

            images.push({
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url
            });
        }

        let product = await productModel.create({
            userId,
            name,
            description,
            price,
            discountPrice,
            brand,
            category,
            stock,
            sizes,
            tags,
            color,
            image: images
        });

        return res.status(201).json({ message: 'Product created successfully', product });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}
    // ✅ GET ALL PRODUCTS
    async getAllProducts(req, res) {
        try {
            let limit = parseInt(req.query.limit) || 10;
            let page = parseInt(req.query.page) || 1;
            let skip = (page - 1) * limit;

            let total = await productModel.countDocuments();
            let products = await productModel.find().skip(skip).limit(limit);

            return res.status(200).json({
                message: 'Products fetched successfully',
                products,
                page,
                limit,
                total
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Something went wrong', error: error.message });
        }
    }

    // ✅ GET PRODUCT BY ID
    async getProductById(req, res) {
        try {
            let product = await productModel.findById(req.params.id);
            if (!product) return res.status(404).json({ message: 'Product not found' });

            return res.status(200).json({ message: 'Product fetched successfully', product });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Something went wrong', error: error.message });
        }
    }

    // ✅ DELETE PRODUCT BY ID
    async deleteProductById(req, res) {
        try {
            let product = await productModel.findByIdAndDelete(req.params.id);
            if (!product) return res.status(404).json({ message: 'Product not found' });

            return res.status(200).json({ message: 'Product deleted successfully', product });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Something went wrong', error: error.message });
        }
    }


// ✅ UPDATE PRODUCT
async updateProductById(req, res) {
    try {
        let updateData = { ...req.body };
        let userId = req.user._id;

        let images = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const uploadResult = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        {
                            folder: "e-commerce/product-images",
                            resource_type: "image",
                            quality: "auto:best"
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    ).end(file.buffer);
                });

                images.push({
                    public_id: uploadResult.public_id,
                    url: uploadResult.secure_url
                });
            }

            updateData.image = images;
        }

        let product = await productModel.findByIdAndUpdate(req.params.id, updateData,userId, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });

        return res.status(200).json({ message: 'Product updated successfully', product });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}
    // ✅ SEARCH PRODUCT (Loose for name & description, Strict for category & tags)
    async searchProduct(req, res) {
        try {
            let query = req.query.query?.trim();
            let limit = parseInt(req.query.limit) || 10;
            let page = parseInt(req.query.page) || 1;

            if (!query) {
                return res.status(400).json({ message: "Search query is required" });
            }

            let regex = new RegExp(query, 'i');
            let searchCriteria = {
                $or: [
                    { name: regex },
                    { description: regex },
                    { category: query },
                    { tags: query }
                ]
            };

            let skip = (page - 1) * limit;
            let total = await productModel.countDocuments(searchCriteria);
            let products = await productModel.find(searchCriteria).skip(skip).limit(limit);

            return res.status(200).json({
                message: 'Products fetched successfully',
                total,
                page,
                limit,
                products
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Something went wrong', error: error.message });
        }
    }

    // ✅ GET BY CATEGORY
    async getProductByCategory(req, res) {
        try {
            let category = req.query.category;
            if (!category) {
                return res.status(400).json({ message: 'Category is required' });
            }

            let limit = parseInt(req.query.limit) || 10;
            let page = parseInt(req.query.page) || 1;
            let skip = (page - 1) * limit;

            let total = await productModel.countDocuments({ category });
            let products = await productModel.find({ category }).skip(skip).limit(limit);

            return res.status(200).json({
                message: 'Products fetched successfully',
                products,
                page,
                limit,
                total
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Something went wrong', error: error.message });
        }
    }

    async allCategoriesofProduct (req,res) {
        try {
            let categories = await productModel.distinct('category');
            if (!categories || categories.length === 0) {
                return res.status(404).json({ message: 'No categories found' });
            }
            return res.status(200).json({ message: 'Categories fetched successfully', categories });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Something went wrong', error: error.message });
        }
    }
}

module.exports = new productController();
