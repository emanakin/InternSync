import { Router, Request, Response, NextFunction } from 'express'
import { User } from '../../models/user'
import jwt from 'jsonwebtoken';
 
const router = Router();

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
        return res.status(409).send({ error: 'User with the same email already exist' });
    }    

    const newUser = new User({
        email,
        password
    });

    await newUser.save();
    
    const token = jwt.sign({ email, userId: newUser._id }, process.env.JWT_KEY!, { expiresIn: '6h' })

    req.session = {
        jwt: token
    };

    res.status(201).send({
        ...newUser._doc,
        token
    });

});

export { router as signupRouter };