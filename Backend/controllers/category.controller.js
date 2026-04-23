// const Category = require("../models/category.model");
// const mongoose= require("mongoose");

// exports.createCategory= async (req, res, next) => {
//     try {
//         let { name } = req.body;

//         if (!name && name?.trim()) {
//             return res.status(400).json({
//                 message: "Category name is required"
//             });
//         }
        
//         name=name?.trim();
//         const existingCategory = await Category.findOne({name,isDeleted: false});

//         if (existingCategory) {
//             return res.status(400).json({
//                 message: "Category already exists"
//             });
//         }

//         const category = await Category.create({name});

//         res.status(201).json({
//             message: "Category created successfully",
//             data: category
//         });

//     } catch (error) {
//         next(error);
//     }
// };

// exports.getActiveCategories = async (req, res, next) => {
//     try {
//         let { page = 1, limit = 10, search = "", isActive } = req.query;

//         page = parseInt(page);
//         limit = parseInt(limit);

//         const filter = {
//         isDeleted: false
//         };

//         if (search) {
//             filter.name = { $regex: search, $options: "i" };
//         }

//         if (isActive !== undefined) {
//             filter.isActive = isActive === "true";
//         }

//         const categories = await Category.find(filter)
//         .sort({createdAt: -1})
//         .skip((page - 1) * limit)
//         .limit(limit);

//         const total = await Category.countDocuments(filter);

//         res.status(200).json({
//         message: "Categories fetched successfully",
//         data: categories,
//         pagination: {
//             total,
//             page,
//             limit,
//             totalPages: Math.ceil(total / limit)
//         }
//         });

//     } catch (error) {
//         next(error);
//     }
// };

// exports.getAllCategories = async (req, res, next) => {
//     try {
//         let { page = 1, limit = 10, search = "",isDeleted } = req.query;

//         page = parseInt(page);
//         limit = parseInt(limit);

//         const filter = {};

//         if (search) {
//             filter.name = { $regex: search, $options: "i" };
//         }

//         if (isDeleted !== undefined) {
//             filter.isDeleted = isDeleted === "true";
//         }

//         const categories = await Category.find(filter)
//         .sort({createdAt:-1})
//         .skip((page - 1) * limit)
//         .limit(limit);

//         const total = await Category.countDocuments(filter);

//         res.status(200).json({
//         message: "All categories fetched (admin)",
//         data: categories,
//         pagination: {
//             total,
//             page,
//             limit,
//             totalPages: Math.ceil(total / limit)
//         }
//         });

//     } catch (error) {
//         next(error);
//     }
// };

// exports.updateCategory = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const { name } = req.body;
        
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({
//                 message: "Invalid category ID"
//             });
//         }

//         if (!name && name?.trim()) {
//             return res.status(400).json({
//                 message: "Category name is required"
//             });
//         }

//         const category = await Category.findById(id);
//         if (!category) {
//             return res.status(404).json({
//                 message: "Category not found"
//             });
//         }

//         const trimmedname=name?.trim();

//         const existing = await Category.findOne({
//         trimmedname,
//         _id: { $ne: id },
//         isDeleted: false
//         });

//         if (existing) {
//         return res.status(400).json({
//             message: "Category already exists"
//         });
//         }

//         // Update
//         category.name = trimmedname;
//         await category.save();

//         // Response
//         res.status(200).json({
//             message: "Category updated successfully",
//             data: category
//         });

//     } catch (error) {
//         next(error);
//     }
// };

// exports.deleteCategory = async (req, res, next) => {
//     try {
//         const { id } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({
//                 message: "Invalid category ID"
//             });
//         }

//         const category = await Category.findById(id);

//         if (!category) {
//             return res.status(404).json({
//                 message: "Category not found"
//             });
//         }

//         if (category.isDeleted) {
//             return res.status(400).json({
//                 message: "Category already deleted"
//         });
//         }

//         category.isDeleted = true;
//         category.isActive = false;

//         await category.save();

//         res.status(200).json({
//             message: "Category deleted successfully",
//             data: category
//         });

//     } catch (error) {
//         next(error);
//     }
// };

// exports.restoreCategory = async (req, res, next) => {
//     try {
//         const { id } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({
//                 message: "Invalid category ID"
//             });
//         }

//         const category = await Category.findById(id);

//         if (!category) {
//             return res.status(404).json({
//                 message: "Category not found"
//             });
//         }

//         if (!category.isDeleted) {
//             return res.status(400).json({
//                 message: "Category is not deleted"
//             });
//         }

//         category.isDeleted = false;
//         category.isActive = true;

//         await category.save();

//         res.status(200).json({
//             message: "Category restored successfully",
//             data: category
//         });

//     } catch (error) {
//         next(error);
//     }
// };


// ====================================

const Category = require("../models/category.model");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary"); // ✅ ADDED

// ================= CREATE =================
exports.createCategory = async (req, res, next) => {
    try {
        let { name } = req.body;

        if (!name && name?.trim()) {
            return res.status(400).json({
                message: "Category name is required"
            });
        }

        name = name?.trim();

        const existingCategory = await Category.findOne({ name, isDeleted: false });

        if (existingCategory) {
            return res.status(400).json({
                message: "Category already exists"
            });
        }

        // ✅ IMAGE REQUIRED
        if (!req.file) {
            return res.status(400).json({
                message: "Category image is required"
            });
        }

        let uploadedImage = null;

        try {
            const uploadPromise = new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "cloth-shop/category",
                        public_id: `${Date.now()}-${req.file.originalname}`
                    },
                    (error, result) => {
                        if (error) return reject(error);

                        resolve({
                            url: result.secure_url,
                            public_id: result.public_id
                        });
                    }
                );
                stream.end(req.file.buffer);
            });

            uploadedImage = await uploadPromise;

        } catch (error) {
            if (uploadedImage?.public_id) {
                await cloudinary.uploader.destroy(uploadedImage.public_id);
            }
            return next(error);
        }

        const category = await Category.create({
            name,
            images: uploadedImage // FIXED: changed from 'image' to 'images'
        });

        res.status(201).json({
            message: "Category created successfully",
            data: category
        });

    } catch (error) {
        next(error);
    }
};


// ================= GET ACTIVE =================
exports.getActiveCategories = async (req, res, next) => {
    try {
        let { page = 1, limit = 10, search = "", isActive } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const filter = {
            isDeleted: false
        };

        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        if (isActive !== undefined) {
            filter.isActive = isActive === "true";
        }

        const categories = await Category.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Category.countDocuments(filter);

        res.status(200).json({
            message: "Categories fetched successfully",
            data: categories,
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


// ================= GET ALL =================
exports.getAllCategories = async (req, res, next) => {
    try {
        let { page = 1, limit = 10, search = "", isDeleted } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const filter = {};

        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        if (isDeleted !== undefined) {
            filter.isDeleted = isDeleted === "true";
        }

        const categories = await Category.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Category.countDocuments(filter);

        res.status(200).json({
            message: "All categories fetched (admin)",
            data: categories,
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


// ================= UPDATE =================
exports.updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        let { name } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid category ID"
            });
        }

        if (!name && name?.trim()) {
            return res.status(400).json({
                message: "Category name is required"
            });
        }

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        const trimmedname = name?.trim();

        const existing = await Category.findOne({
            name: trimmedname, // ✅ FIXED small bug
            _id: { $ne: id },
            isDeleted: false
        });

        if (existing) {
            return res.status(400).json({
                message: "Category already exists"
            });
        }

        // ✅ UPDATE NAME
        category.name = trimmedname;

        // ✅ IMAGE UPDATE (ONLY IF PROVIDED)
        if (req.file) {
            let uploadedImage = null;

            try {
                const uploadPromise = new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: "cloth-shop/category",
                            public_id: `${Date.now()}-${req.file.originalname}`
                        },
                        (error, result) => {
                            if (error) return reject(error);

                            resolve({
                                url: result.secure_url,
                                public_id: result.public_id
                            });
                        }
                    );
                    stream.end(req.file.buffer);
                });

                uploadedImage = await uploadPromise;

                // ❗ DELETE OLD IMAGE
                if (category.images?.public_id) {
                    await cloudinary.uploader.destroy(category.images.public_id);
                }

                category.images = uploadedImage;

            } catch (error) {
                if (uploadedImage?.public_id) {
                    await cloudinary.uploader.destroy(uploadedImage.public_id);
                }
                return next(error);
            }
        }

        await category.save();

        res.status(200).json({
            message: "Category updated successfully",
            data: category
        });

    } catch (error) {
        next(error);
    }
};


// ================= DELETE =================
exports.deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid category ID"
            });
        }

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        if (category.isDeleted) {
            return res.status(400).json({
                message: "Category already deleted"
            });
        }

        category.isDeleted = true;
        category.isActive = false;

        await category.save();

        res.status(200).json({
            message: "Category deleted successfully",
            data: category
        });

    } catch (error) {
        next(error);
    }
};


// ================= RESTORE =================
exports.restoreCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid category ID"
            });
        }

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        if (!category.isDeleted) {
            return res.status(400).json({
                message: "Category is not deleted"
            });
        }

        category.isDeleted = false;
        category.isActive = true;

        await category.save();

        res.status(200).json({
            message: "Category restored successfully",
            data: category
        });

    } catch (error) {
        next(error);
    }
};