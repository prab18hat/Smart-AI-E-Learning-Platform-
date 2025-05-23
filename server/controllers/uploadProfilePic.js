import { User } from "../models/user.js";
import TryCatch from "../middlewares/TryCatch.js";
import path from "path";
import fs from "fs";

export const uploadProfilePic = TryCatch(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    // Delete old profile pic if exists and is not default
    if (user.profilePic && user.profilePic !== "") {
        const oldPath = path.join(process.cwd(), "server", user.profilePic);
        if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
        }
    }
    // Save new profile pic path
    user.profilePic = `/uploads/profile-pics/${req.file.filename}`;
    await user.save();
    res.json({ profilePic: user.profilePic });
});
