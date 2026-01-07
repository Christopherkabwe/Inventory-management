// pages/api/auth/verify.js
import { verify } from 'jsonwebtoken';

export default function handler(req, res) {
    try {
        const token = req.body.token;
        const decoded = verify(token, process.env.JWT_SECRET);
        res.status(200).json({ valid: true, user: decoded });
    } catch (error) {
        res.status(401).json({ valid: false, error: error.message });
    }
}