import bcrypt from "bcryptjs";
import User from "../models/user.js";
const saltRounds = 10;
export const hashUserPassword = (password) => {
    return bcrypt.hash(password, saltRounds);
};
export const createNewUser = async (data) => {
    try {
        const hashed = await hashUserPassword(data.password);
        const user = new User({
            email: data.email,
            password: hashed,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            phoneNumber: data.phoneNumber,
            gender: data.gender === "1" ? true : false,
            roleId: data.roleId,
            positionId: data.positionId,
            image: data.image,
        });
        await user.save();
        return "OK create a new user successful";
    }
    catch (e) {
        throw e;
    }
};
export const getAllUsers = async () => {
    const users = await User.find({}).lean();
    return users.map((u) => {
        delete u.password;
        return u;
    });
};
export const getUserInfoById = async (userId) => {
    const user = await User.findById(userId).lean();
    if (!user)
        return {};
    delete user.password;
    return user;
};
export const updateUserData = async (data) => {
    const update = {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        roleId: data.roleId,
        positionId: data.positionId,
    };
    if (data.image)
        update.image = data.image;
    await User.findByIdAndUpdate(data.id, update, { new: true });
    return getAllUsers();
};
export const deleteUserById = async (userId) => {
    await User.findByIdAndDelete(userId);
};
//# sourceMappingURL=CRUDService.js.map