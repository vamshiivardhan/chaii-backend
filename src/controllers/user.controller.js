import { asyncHandler } from '../utils/asyncHandler.js';



const registerUser = asyncHandler(async (req, res) => {
    // Implementation for user registration
    res.status(200).json({ 
        message: 'ok' 
    });
}); 