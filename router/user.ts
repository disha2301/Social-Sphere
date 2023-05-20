/**
 * User Router
 */

// Dependencies
import express, { NextFunction, Request, Response } from 'express';
import { zParse } from '../utils/zParse';
import {
	loginUserSchema,
	newUserAccountSchema,
	userIsUniqueSchema,
	userProfileTitleSchema,
} from '../schema/user';
import {
	loginUserController,
	newUserAccountController,
	userIsUniqueController,
	userProfileTitleController,
} from '../controller/user';
import { auth } from '../middleware/auth';
const Router = express.Router();

Router.post(
	'/is-unique',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = await zParse(userIsUniqueSchema, req);
			const { isUnique } = await userIsUniqueController(data);
			return res.json({ isUnique, message: 'user/unique-checked' });
		} catch (error) {
			return next(error);
		}
	}
);

Router.post('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = await zParse(newUserAccountSchema, req);
		const { user, token } = await newUserAccountController(data);
		return res
			.status(201)
			.json({ user, token, message: 'user/signup-successful' });
	} catch (error) {
		return next(error);
	}
});

Router.post(
	'/login',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = await zParse(loginUserSchema, req);
			const { user, token } = await loginUserController(data);
			return res.json({ user, token, message: 'user/login-successful' });
		} catch (error) {
			return next(error);
		}
	}
);

Router.post(
	'/profile/title',
	auth,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = await zParse(userProfileTitleSchema, req);
			await userProfileTitleController(data, res.locals.user);
			return res.json({ message: 'user/title-updated' });
		} catch (error) {
			return next(error);
		}
	}
);

export default Router;
