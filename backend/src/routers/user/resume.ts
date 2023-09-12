import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../../models/user';
import jwt from 'jsonwebtoken';
import tokenize from '../../algo/tokenize';
import parseResume from '../../algo/parse';

const router = Router();

router.post('/update-resume', async (req: Request, res: Response, next: NextFunction) => {
    
    const { email, resume } = req.body;

    if (!email || !resume) {
        const err: CustomError = new Error('Email and resume fields are required.');
        err.status = 400;
        return next(err);
    }

    // Fetch the user based on email
    const user = await User.findOne({ email });

    // If user doesn't exist, return an error
    if (!user) {
        const err: CustomError = new Error('User not found.');
        err.status = 404;
        return next(err);
    }

    // Update the user's resume reference
    const parsedText = await parseResume(resume);
    // console.log('text extracted', parsedText);
    user.resume = await tokenize(parsedText, resume);
    await user.save();

    res.status(200).send({ message: 'Resume reference updated successfully.' });
});

export { router as resumeRouter };
