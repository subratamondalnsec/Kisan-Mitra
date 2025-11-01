const FirebaseCropImage = require('../models/Firebase_CropImage');
const { uploadFiles } = require('../utils/FileUploader');
const fs = require('fs');
const path = require('path');

// Upload base64 image to Cloudinary and save URL to MongoDB
exports.uploadCropImage = async (req, res) => {
    try {
        const { farmerId, testName, imageKey, base64Data, cropType } = req.body;

        // Validation
        if (!farmerId || !testName || !imageKey || !base64Data) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: farmerId, testName, imageKey, base64Data'
            });
        }

        // Check if image already exists
        const existingImage = await FirebaseCropImage.findOne({
            farmerId,
            testName,
            imageKey
        });

        if (existingImage) {
            return res.status(200).json({
                success: true,
                message: 'Image already exists',
                data: existingImage
            });
        }

        // Convert base64 to temporary file for Cloudinary upload
        const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Image, 'base64');
        
        // Create temp directory if it doesn't exist
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const tempFilePath = path.join(tempDir, `${Date.now()}_${imageKey}.jpg`);
        fs.writeFileSync(tempFilePath, buffer);

        // Create a file object similar to what multer would create
        const fileObject = {
            tempFilePath: tempFilePath
        };

        // Upload to Cloudinary
        const cloudinaryResult = await uploadFiles(
            fileObject,
            'kisan-mitra/crop-images', // folder in Cloudinary
            80, // quality
            800  // max height
        );

        // Clean up temp file
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }

        if (!cloudinaryResult || !cloudinaryResult.secure_url) {
            return res.status(500).json({
                success: false,
                message: 'Failed to upload image to Cloudinary'
            });
        }

        // Save to MongoDB
        const newImage = new FirebaseCropImage({
            farmerId,
            testName,
            imageKey,
            cloudinaryUrl: cloudinaryResult.secure_url,
            cloudinaryPublicId: cloudinaryResult.public_id,
            metadata: {
                cropType: cropType || 'unknown'
            }
        });

        await newImage.save();

        res.status(201).json({
            success: true,
            message: 'Image uploaded and saved successfully',
            data: {
                _id: newImage._id,
                farmerId: newImage.farmerId,
                testName: newImage.testName,
                imageKey: newImage.imageKey,
                cloudinaryUrl: newImage.cloudinaryUrl,
                timestamp: newImage.timestamp
            }
        });

    } catch (error) {
        console.error('Error in uploadCropImage:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while uploading image',
            error: error.message
        });
    }
};

// Bulk upload multiple images at once
exports.bulkUploadCropImages = async (req, res) => {
    try {
        const { farmerId, testName, images } = req.body;

        if (!farmerId || !testName || !images || !Array.isArray(images)) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: farmerId, testName, images (array)'
            });
        }

        const results = [];
        const errors = [];

        for (const img of images) {
            try {
                const { imageKey, base64Data, cropType } = img;

                // Check if already exists
                const existing = await FirebaseCropImage.findOne({
                    farmerId,
                    testName,
                    imageKey
                });

                if (existing) {
                    results.push({
                        imageKey,
                        status: 'already_exists',
                        data: existing
                    });
                    continue;
                }

                // Convert and upload
                const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Image, 'base64');
                
                const tempDir = path.join(__dirname, '../temp');
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir, { recursive: true });
                }

                const tempFilePath = path.join(tempDir, `${Date.now()}_${imageKey}.jpg`);
                fs.writeFileSync(tempFilePath, buffer);

                const fileObject = { tempFilePath };
                const cloudinaryResult = await uploadFiles(
                    fileObject,
                    'kisan-mitra/crop-images',
                    80,
                    800
                );

                if (fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                }

                if (!cloudinaryResult || !cloudinaryResult.secure_url) {
                    errors.push({
                        imageKey,
                        error: 'Cloudinary upload failed'
                    });
                    continue;
                }

                const newImage = new FirebaseCropImage({
                    farmerId,
                    testName,
                    imageKey,
                    cloudinaryUrl: cloudinaryResult.secure_url,
                    cloudinaryPublicId: cloudinaryResult.public_id,
                    metadata: { cropType: cropType || 'unknown' }
                });

                await newImage.save();

                results.push({
                    imageKey,
                    status: 'uploaded',
                    data: newImage
                });

            } catch (imgError) {
                errors.push({
                    imageKey: img.imageKey,
                    error: imgError.message
                });
            }
        }

        res.status(200).json({
            success: true,
            message: 'Bulk upload completed',
            results,
            errors,
            stats: {
                total: images.length,
                successful: results.length,
                failed: errors.length
            }
        });

    } catch (error) {
        console.error('Error in bulkUploadCropImages:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during bulk upload',
            error: error.message
        });
    }
};

// Get all images for a specific farmer
exports.getFarmerImages = async (req, res) => {
    try {
        const { farmerId } = req.params;

        const images = await FirebaseCropImage.find({ farmerId })
            .sort({ testName: 1, timestamp: -1 })
            .select('-base64Data'); // Exclude base64 data for performance

        // Organize by test name
        const organizedData = {};
        images.forEach(img => {
            if (!organizedData[img.testName]) {
                organizedData[img.testName] = {};
            }
            organizedData[img.testName][img.imageKey] = {
                imageUrl: img.cloudinaryUrl,
                timestamp: img.timestamp,
                metadata: img.metadata,
                _id: img._id
            };
        });

        res.status(200).json({
            success: true,
            farmerId,
            data: organizedData,
            totalImages: images.length
        });

    } catch (error) {
        console.error('Error in getFarmerImages:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching farmer images',
            error: error.message
        });
    }
};

// Get images for a specific test
exports.getTestImages = async (req, res) => {
    try {
        const { farmerId, testName } = req.params;

        const images = await FirebaseCropImage.find({ farmerId, testName })
            .sort({ timestamp: -1 })
            .select('-base64Data');

        const organizedData = {};
        images.forEach(img => {
            organizedData[img.imageKey] = {
                imageUrl: img.cloudinaryUrl,
                timestamp: img.timestamp,
                metadata: img.metadata,
                _id: img._id
            };
        });

        res.status(200).json({
            success: true,
            farmerId,
            testName,
            data: organizedData,
            totalImages: images.length
        });

    } catch (error) {
        console.error('Error in getTestImages:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching test images',
            error: error.message
        });
    }
};

// Update analysis result for an image
exports.updateAnalysisResult = async (req, res) => {
    try {
        const { imageId } = req.params;
        const { analysisResult, analysisStatus } = req.body;

        const updatedImage = await FirebaseCropImage.findByIdAndUpdate(
            imageId,
            {
                'metadata.analysisResult': analysisResult,
                'metadata.analysisStatus': analysisStatus || 'analyzed'
            },
            { new: true }
        );

        if (!updatedImage) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Analysis result updated',
            data: updatedImage
        });

    } catch (error) {
        console.error('Error in updateAnalysisResult:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating analysis result',
            error: error.message
        });
    }
};

// Delete an image
exports.deleteCropImage = async (req, res) => {
    try {
        const { imageId } = req.params;

        const image = await FirebaseCropImage.findById(imageId);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        // Optional: Delete from Cloudinary as well
        // const cloudinary = require('cloudinary').v2;
        // if (image.cloudinaryPublicId) {
        //     await cloudinary.uploader.destroy(image.cloudinaryPublicId);
        // }

        await FirebaseCropImage.findByIdAndDelete(imageId);

        res.status(200).json({
            success: true,
            message: 'Image deleted successfully'
        });

    } catch (error) {
        console.error('Error in deleteCropImage:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting image',
            error: error.message
        });
    }
};

// Get statistics
exports.getImageStats = async (req, res) => {
    try {
        const { farmerId } = req.params;

        const stats = await FirebaseCropImage.aggregate([
            { $match: { farmerId } },
            {
                $group: {
                    _id: '$testName',
                    count: { $sum: 1 },
                    lastUpdate: { $max: '$timestamp' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const totalImages = await FirebaseCropImage.countDocuments({ farmerId });

        res.status(200).json({
            success: true,
            farmerId,
            totalImages,
            tests: stats
        });

    } catch (error) {
        console.error('Error in getImageStats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
};
