import type { Request, Response } from "express";
import * as CRUDService from "../services/CRUDService.js";

export const getHomePage = async (req: Request, res: Response) => {
  try {
    const data = await CRUDService.getAllUsers();
    return res.render("homepage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("Server error");
  }
};

export const getAboutPage = (req: Request, res: Response) => {
  return res.render("test/about.ejs");
};

export const getCRUD = (req: Request, res: Response) => {
  return res.render("crud.ejs");
};

export const getFindAllCrud = async (req: Request, res: Response) => {
  const data = await CRUDService.getAllUsers();
  return res.render("users/findAllUser.ejs", {
    datalist: data,
  });
};

export const postCRUD = async (req: Request, res: Response) => {
  const message = await CRUDService.createNewUser(req.body);
  console.log(message);
  return res.send("Post crud to server");
};

export const getEditCRUD = async (req: Request, res: Response) => {
  const userId = req.query.id as string | undefined;
  if (userId) {
    const userData = await CRUDService.getUserInfoById(userId);
    return res.render("users/editUser.ejs", {
      data: userData,
    });
  } else {
    return res.send("không lấy được id");
  }
};

export const putCRUD = async (req: Request, res: Response) => {
  const data = req.body;
  const data1 = await CRUDService.updateUserData(data);
  return res.render("users/findAllUser.ejs", {
    datalist: data1,
  });
};

export const deleteCRUD = async (req: Request, res: Response) => {
  const id = req.query.id as string | undefined;
  if (id) {
    await CRUDService.deleteUserById(id);
    return res.send("Deleted!!!!!!!!!!!");
  } else {
    return res.send("Not find user");
  }
};
