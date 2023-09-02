import { NextFunction, Router, Request, Response } from "express";
import { User } from "../../models/user";
import { authenticationService } from "../../../common";
import jwt from 'jsonwebtoken';

const router = Router()

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
    if (!user) {
        const err: CustomError = new Error('Wrong credentials');
        err.status = 401
        return next(err);
    } 

    const isEqual = await authenticationService.pwdCompare(user.password, password);

    if (!isEqual) {
        const err: CustomError = new Error('Wrong credentials');
        err.status = 409
        return next(err);
    }
        
    const token = jwt.sign({ email, userId: user._id }, process.env.JWT_KEY!, { expiresIn: '1h' })

    res.status(200).send({ user, token })

});

export { router as loginRouter }