import {NextFunction, Request, Response} from 'express';
import userModel from '../models/users_model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// register function to create a new user with email and password 
const register = async (req: Request, res: Response) => {
    try {
        const password = req.body.password; // get password from request    
        const salt = await bcrypt.genSalt(10); // generate salt with 10 rounds 
        const hashedPassword = await bcrypt.hash(password, salt); // hash the password with the salt 
        const user = await userModel.create({  // create a new user with the email and hashed password
            email: req.body.email,
            password: hashedPassword
        }); 
        res.status(200).send(user); // send the user object as response
    } catch (err) {
        res.status(400).send(err);  // send the error object as response
    }
};  

// login function to authenticate the user with email and password
const login = async (req: Request, res: Response) => {
    try {
        //Verify user
        const user = await userModel.findOne({ email: req.body.email }); // find the user with the email  
        if (!user) { // if user not found, send error response
            res.status(400).send('Wrong username or password');
            return
        } 
        //Verify password
        const validPassword = await bcrypt.compare(req.body.password, user.password); // compare the password with the hashed password   
        if (!validPassword) { // if password is invalid, send error response
            res.status(400).send('Wrong username or password');
            return;
        } 
        
        if(!process.env.TOKEN_SECRET) {
            res.status(500).send("Server Error");
            return;
        }

        //Create and assign a token
        const token = jwt.sign({ _id: user._id },
             process.env.TOKEN_SECRET,
            {expiresIn: process.env.TOKEN_EXPIRES}); // create a token with the user id and secret key  
        res.status(200).send({token: token, _id: user._id}); // send the token as response
    } catch (err) {
        res.status(400).send(err); 
    }
}; 

type Payload = {
    _id: string
};

//Middleware to authenticate the user with token
export const authMiddleware = (req: Request, res: Response, next:NextFunction) => {
    const authorization = req.header('authorization'); // get the token from the header
    const token = authorization && authorization.split(' ')[1]; // get the token from the header 

    // if token is not found, send error response
    if(!token) { 
        res.status(401).send('Access Denied');
        return;
    }
    if(!process.env.TOKEN_SECRET) {
        res.status(500).send("Server Error");
        return;
    }

    // verify the token with the secret key
    jwt.verify(token, process.env.TOKEN_SECRET,(err,payload)=>{
        if(err) {
            res.status(401).send('Access Denied');
            return;
        }
        req.params.userId = (payload as Payload)._id;
        next();
    }); 
    
};
export default { register, login };