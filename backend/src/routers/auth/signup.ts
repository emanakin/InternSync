import { Router, Request, Response, NextFunction } from 'express'
import { User } from '../../models/user'
import jwt from 'jsonwebtoken';
 
const router = Router();

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
        const err: CustomError = new Error('User with the email already exist');
        err.status = 409
        return next(err);
    }    

    const newUser = new User({
        email,
        password
    });

    await newUser.save();
    
    const token = jwt.sign({ email, userId: newUser._id }, process.env.JWT_KEY!, { expiresIn: '1h' })

    res.status(201).send({ ...newUser._doc, token });

});

export { router as signupRouter };