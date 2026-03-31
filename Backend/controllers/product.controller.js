const mongoose=require("mongoose");
const Product=require("../models/product.model");
const Category=require("../models/category.model");
const cloudinary=require("../config/cloudinary");

exports.createProduct = async (req, res, next) => {
    try {
        let { name, description, pricePerMeter, category } = req.body;

        name = name?.trim();
        description = description?.trim();
        
        pricePerMeter = Number(pricePerMeter);
        
        if (!name || pricePerMeter===undefined || !category) {
            return res.status(400).json({
                success:false,
                message: "All required fields must be provided"
            });
        }

        if (isNaN(pricePerMeter) || pricePerMeter < 0) {
            return res.status(400).json({
                success:false,
                message: "Price per meter must be a valid positive number"
            });
        }

        const categoryExists = await Category.findOne({_id: category,isDeleted: false});

        if (!categoryExists) {
            return res.status(404).json({
                success:false,
                message: "Category not found"
        });
        }

        let uploadedImages = [];

        try {
        const uploadPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                folder: "cloth-shop/products",
                public_id: `${Date.now()}-${file.originalname}`
                },
                (error, result) => {
                if (error) return reject(error);

                resolve({
                    url: result.secure_url,
                    public_id: result.public_id
                });
                }
            );
            stream.end(file.buffer);
            });
        });

        uploadedImages = await Promise.all(uploadPromises);

        } 
        catch (error) {
            for (const img of uploadedImages) {
                await cloudinary.uploader.destroy(img.public_id);
            }
            return next(error);
        }

        const product = await Product.create({
        name,
        description,
        pricePerMeter,
        category,
        images:uploadedImages
        });

        res.status(201).json({
            success:true,
            message: "Product created successfully",
            data: product
        });

    }
    catch (error) {
        next(error);
    }
};

exports.getActiveProduct = async (req, res, next) => {
    try {
        let { page = 1, limit = 10, search = "", category } = req.query;

        page = Number(page);
        limit = Number(limit);

        const skip = (page - 1) * limit;

        let filter = {
            isDeleted: false,
            isActive: true
        };

        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        if (category) {
                    if (!mongoose.Types.ObjectId.isValid(category)) {
                        return res.status(400).json({
                            success:false,
                            message: "Invalid category ID"
                        });
                    }
            filter.category = category;
        }

        const products = await Product.find(filter)
        .populate("category", "name") // show category name
        .sort({ createdAt: -1 }) // latest first
        .skip(skip)
        .limit(limit);

        const total = await Product.countDocuments(filter);

        res.status(200).json({
            success:true,
            message: "Products fetched successfully",
            data: products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success:false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findOne({
        _id: id,
        isDeleted: false,
        isActive: true
        }).populate("category", "name");

        if (!product) {
            return res.status(404).json({
                success:false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success:true,
            message: "Product fetched successfully",
            data: product
        });

    } catch (error) {
        next(error);
    }
};

exports.getAllProduct = async (req, res, next) => {
    try {
        let { page = 1, limit = 10, search = "", category, isDeleted } = req.query;

        page = Number(page);
        limit = Number(limit);

        const skip = (page - 1) * limit;

        let filter = {};

        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

    
        if (category) {
            if (!mongoose.Types.ObjectId.isValid(category)) {
                    return res.status(400).json({
                        success:false,
                        message: "Invalid category ID"
                    });
                }
            filter.category = category;
        }

        if (isDeleted !== undefined) {
            filter.isDeleted = isDeleted === "true";
        }

        const products = await Product.find(filter)
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const total = await Product.countDocuments(filter);

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        let { name, description, pricePerMeter, category } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(id);

        if (!product || product.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (name) name = name.trim();
        if (description) description = description.trim();

        if (pricePerMeter !== undefined) {
            pricePerMeter = Number(pricePerMeter);

            if (isNaN(pricePerMeter) || pricePerMeter < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Price per meter must be a valid positive number"
                });
            }
        }

        if (category) {
        const categoryExists = await Category.findOne({
            _id: category,
            isDeleted: false
        });

        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        }

        if (req.files && req.files.length > 0) {
        let uploadedImages = [];

        try {
            const uploadPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "cloth-shop/products",
                    public_id: `${Date.now()}-${file.originalname}`
                },
                (error, result) => {
                    if (error) return reject(error);

                    const imageData = {
                    url: result.secure_url,
                    public_id: result.public_id
                    };

                    uploadedImages.push(imageData);
                    resolve(imageData);
                }
                );
                stream.end(file.buffer);
            });
        });

            const newImages = await Promise.all(uploadPromises);

            for (const img of product.images) {
                try {
                    await cloudinary.uploader.destroy(img.public_id);
                } catch (err) {
                    console.error("Old image delete failed:", err);
                }
            }

            product.images = newImages;

        } catch (error) {
            for (const img of uploadedImages) {
            try {
                await cloudinary.uploader.destroy(img.public_id);
            } catch (err) {
                console.error("Cleanup failed:", err);
            }
            }

            return res.status(500).json({
                success: false,
                message: "Image upload failed. Please try again."
            });
        }
    }

        if (name) product.name = name;
        if (description) product.description = description;
        if (pricePerMeter !== undefined) product.pricePerMeter = pricePerMeter;
        if (category) product.category = category;

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });

    } catch (error) {
        next(error);
    }
};

exports.restoreProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (!product.isDeleted) {
            return res.status(400).json({
                success: false,
                message: "Product is already active"
            });
        }

        product.isDeleted = false;
        product.isActive = true;

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product restored successfully",
            data: product
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid product ID"
        });
        }

        const product = await Product.findById(id);

        if (!product || product.isDeleted) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
        }

        product.isDeleted = true;
        product.isActive = false;

        await product.save();

        for (const img of product.images) {
            try {
                await cloudinary.uploader.destroy(img.public_id);
            } catch (err) {
                console.error("Image delete failed:", err);
            }
        }

        res.status(200).json({
        success: true,
        message: "Product deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};