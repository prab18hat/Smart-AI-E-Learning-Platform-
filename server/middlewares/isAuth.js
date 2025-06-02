import jwt from 'jsonwebtoken';
import { paths } from '../utils/paths.js';
import { importModule } from '../utils/paths.js';

// Import User model dynamically
let User;
importModule(`${paths.models}/User.js`).then(module => {
    User = module.default;
});

export const isAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.Jwt_Sec);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
