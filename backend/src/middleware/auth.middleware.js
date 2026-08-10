import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

const authenticate = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decode.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};

export default authenticate;