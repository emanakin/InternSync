import { Router, Request, Response, NextFunction } from 'express'
import { User } from '../../models/user'
import jwt from 'jsonwebtoken';
 
const router = Router();

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    
    const { email, password, resume, profile_picture, first_name, last_name } = req.body.user;
    

    const user = await User.findOne({ email });

    if (user) {
        const err: CustomError = new Error('User with the email already exist');
        err.status = 409
        return next(err);
    }    

    const userData: any = {
        email,
        password,
        first_name,
        last_name
    };
    
    if (resume) userData.resume = resume;
    if (profile_picture) userData.profile_picture = profile_picture;

    const newUser = new User(userData);
    await newUser.save();
    
    const token = jwt.sign({ resumeUrl: newUser.resume, imgUrl: newUser.profile_picture, email, first_name: newUser.first_name, last_name: newUser.last_name, userId: newUser._id }, process.env.JWT_KEY!, { expiresIn: '1h' })

    res.status(201).send({ ...newUser._doc, token });

});

export { router as signupRouter };