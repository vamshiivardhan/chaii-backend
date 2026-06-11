import asyncHandler from '../utils/asyncHandler.js';




const registerUser = asyncHandler(async (req, res) => {
    // Implementation for user registration
   return res.status(200).json({ 
        message: 'ok' 
    });
});  
export { registerUser };