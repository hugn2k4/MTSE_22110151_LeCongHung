import type { Request, Response } from "express";
export declare const getHomePage: (req: Request, res: Response) => Promise<void | Response<any, Record<string, any>>>;
export declare const getAboutPage: (req: Request, res: Response) => void;
export declare const getCRUD: (req: Request, res: Response) => void;
export declare const getFindAllCrud: (req: Request, res: Response) => Promise<void>;
export declare const postCRUD: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getEditCRUD: (req: Request, res: Response) => Promise<void | Response<any, Record<string, any>>>;
export declare const putCRUD: (req: Request, res: Response) => Promise<void>;
export declare const deleteCRUD: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=homeController.d.ts.map