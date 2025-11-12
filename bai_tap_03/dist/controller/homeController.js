import * as CRUDService from "../services/CRUDService.js";
export const getHomePage = async (req, res) => {
    try {
        const data = await CRUDService.getAllUsers();
        return res.render("homepage.ejs", {
            data: JSON.stringify(data),
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send("Server error");
    }
};
export const getAboutPage = (req, res) => {
    return res.render("test/about.ejs");
};
export const getCRUD = (req, res) => {
    return res.render("crud.ejs");
};
export const getFindAllCrud = async (req, res) => {
    const data = await CRUDService.getAllUsers();
    return res.render("users/findAllUser.ejs", {
        datalist: data,
    });
};
export const postCRUD = async (req, res) => {
    const message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send("Post crud to server");
};
export const getEditCRUD = async (req, res) => {
    const userId = req.query.id;
    if (userId) {
        const userData = await CRUDService.getUserInfoById(userId);
        return res.render("users/editUser.ejs", {
            data: userData,
        });
    }
    else {
        return res.send("không lấy được id");
    }
};
export const putCRUD = async (req, res) => {
    const data = req.body;
    const data1 = await CRUDService.updateUserData(data);
    return res.render("users/findAllUser.ejs", {
        datalist: data1,
    });
};
export const deleteCRUD = async (req, res) => {
    const id = req.query.id;
    if (id) {
        await CRUDService.deleteUserById(id);
        return res.send("Deleted!!!!!!!!!!!");
    }
    else {
        return res.send("Not find user");
    }
};
//# sourceMappingURL=homeController.js.map