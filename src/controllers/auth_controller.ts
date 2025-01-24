import {NextFunction, Request, Response} from 'express';
import userModel,{IUser} from '../models/users_model';
import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';


// register function to create a new user with email and password 
const register = async (req: Request, res: Response): Promise<void> => {

    const email = req.body.email; // get email from request
    const password = req.body.password; // get password from request
    const username = req.body.username; // get user name from request
 

    if (!email || !password) { // if email or password is not provided, send error response
        console.log("Missing email or password");
        res.status(400).send("Missing email or password");
        return;
    }
    try {
        // Check if the email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {   
           res.status(409).json({ message: 'Email already exists' });
           return;
        }
        
        //Hash the password
        const salt = await bcrypt.genSalt(10); // generate salt with 10 rounds 
        const hashedPassword = await bcrypt.hash(password, salt); // hash the password with the salt

        //Create a new user with the email and hashed password
        const user = await userModel.create({  
            email,
            password: hashedPassword,
            username,
        }); 
   

        res.status(200).json({ message: 'User registered successfully!', user }); // send the user object as response
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });  // send the error object as response
    }
};

const getUserInfo = async (req: Request, res: Response): Promise<void> => {
    console.log("Entered GetUserInfo");
    const userId = req.userId;
    console.log("Got User ID:", userId);
    const user= await userModel.findById(new Types.ObjectId(userId));
    console.log("User ID:", user?._id);

    if (user) {
        const image = user.image ? user.image : null;
        const username = user.username ? user.username : null;
        const userId=user._id.toString();
        console.log("User ID:", userId);
        console.log("Username:", username);
        console.log("Image:", image);
        res.status(200).json({ userId, username, image });
    }else{
        res.status(400).json({ error: 'User not found' });
    }

}


const generateTokens = (_id:string):{accessToken: string, refreshToken:string} |null => {
    //Create and assign a token
    const random = Math.floor(Math.random() * 1000000); // generate a random token number
    if(!process.env.TOKEN_SECRET) {
        return null;
    }
    const accessToken = jwt.sign(
        {
         _id: _id,
         random: random,
        },
         process.env.TOKEN_SECRET,
        {expiresIn: process.env.TOKEN_EXPIRES}); // create a token with the user id and secret key 

    const refreshToken = jwt.sign(
        {
         _id: _id,
         random: random,
        },
        process.env.TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRATION}); // create a refresh token with the user id and secret key
    return {accessToken, refreshToken};
};

// login function to authenticate the user with email and password
const login = async (req: Request, res: Response) => {
    const email = req.body.email; // get email from request
    const password = req.body.password; // get password from request
    if (!email || !password) { // if email or password is not provided, send error response
        res.status(400).send("Wrong username or password");
        return;
    }
    try {
        //Verify user
        const user = await userModel.findOne({ email: email }); // find the user with the email  
        if (!user) { // if user not found, send error response
            res.status(400).send('Wrong username or password');
            return;
        } 
        //Verify password
        if (typeof user.password !== 'string') {
            res.status(400).send('Invalid password format');
            return;
        }
        const validPassword = await bcrypt.compare(password, user.password); // compare the password with the hashed password   
        if (!validPassword) { // if password is invalid, send error response
            res.status(400).send('Wrong username or password');
            return;
        }
        const userId:string = user._id.toString();
        const tokens = generateTokens(userId); // generate access and refresh tokens 
        if(!tokens) {
            res.status(400).send("Missing auth configuration");
            return;
        }

        if(user.refreshTokens==null) {
            user.refreshTokens = [];
        }
        user.refreshTokens.push(tokens.refreshToken);  
        await user.save(); // save the user object          
        res.status(200).send({
            email: user.email,
            _id: user._id,
            username: user.username,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            }); // send the token as response
    } catch (err) {
        res.status(400).send(err); 
    }
}; 
const client = new OAuth2Client();
const googleLogin = async (req: Request, res: Response):Promise<void> => {
    const { credential } = req.body;

    if (!credential) {
        res.status(400).json({ message: 'Missing Google credential' });
        return;
    }
    try {
        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        // Get user info
        const payload = ticket.getPayload();
        if (!payload) {
            res.status(400).json({ message: 'Invalid Google token' });
            return;
        }

        const { email, name } = payload;
        // Check if user exists
        let user = await userModel.findOne({ email });
        console.log(user);
        
        if (!user) {
            // Create a new user if not exists
            console.log("check12");
            user = await userModel.create({ email, username: name });
            console.log("check");
            console.log("User email:", user.email);
            console.log("Username:", user.username);
        }
        // Generate tokens
        const tokens = generateTokens(user._id.toString());
        res.status(200).json({
            email: user.email,
            _id: user._id,
            username: user.username,
            accessToken: tokens?.accessToken,
            refreshToken: tokens?.refreshToken,
        });
        user.refreshTokens.push(tokens?.refreshToken as string);
        await user.save();
    } catch (error) {
        res.status(400).json({ message: 'Google login failed', error });
    }
};



const logout = async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken; // get the refresh token from the request
    if (!refreshToken) { // if refresh token is not provided, send error response
        res.status(400).send("Missing Refresh Token");
        return;
    }
    //first validate the refresh token
    if(!process.env.TOKEN_SECRET) {
        res.status(400).send("Missing auth configuration");
        return;
    }
    jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err:any,data:any)=> {
        if(err) {
            res.status(403).send('Invalid Refresh Token');
            return;
        }
        const payload = data as JwtPayload;
        try{
            const user = await userModel.findById({_id:payload._id}); 
            if(!user) {
                res.status(400).send('Invalid Token');
                return;
            }
            if(!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
                res.status(400).send('Invalid Token');
                user.refreshTokens = [];
                await user.save();
                return;
            }
            const tokens = user.refreshTokens.filter((token)=> token!==refreshToken);
            user.refreshTokens = tokens;
            await user.save();
            res.status(200).json({ message: 'Logged out successfully.' });
        } catch(err) {
            res.status(400).send("Invalid Token");
        }
    });       
};

const refresh = async (req: Request, res: Response) => {
   //first validate the refresh token
   const refreshToken = req.body.refreshToken; // get the refresh token from the request
    if (!refreshToken) { // if refresh token is not provided, send error response
         res.status(400).send("Invalid Token");
         return;
    }
    if(!process.env.TOKEN_SECRET) {
        res.status(400).send("Missing auth configuration");
        return;
    }
    jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err:any,data:any)=> {
        if(err) {
            res.status(403).send('Invalid Refresh Token');
            return;
        }
        //find the user
        const payload = data as JwtPayload;
        try{
            const user = await userModel.findById({_id:payload._id});
            if(!user) {
                res.status(400).send('Invalid Token');
                return;
            }
            //check that the token exists in the user
            if(!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
                user.refreshTokens = [];
                await user.save();
                res.status(400).send('Invalid Token');
                return;
            }
            //generate a new access token
            const newTokens = generateTokens(user._id.toString());
            if(!newTokens) {
                user.refreshTokens = [];
                await user.save();
                res.status(400).send("Missing auth configuration");
                return;
            }
            //delete the old refresh token
            user.refreshTokens = user.refreshTokens.filter((token)=> token!==refreshToken);

            //save the new refresh token in the user
            user.refreshTokens.push(newTokens.refreshToken);
            await user.save();

            //return the new access token and refresh token
            res.status(200).send({
                accessToken: newTokens.accessToken,
                refreshToken: newTokens.refreshToken,
            });
        } catch(err) {
            res.status(400).send("Invalid Token");
        }
    });
};


type JwtPayload = {
    _id: string
    
};
declare module 'express-serve-static-core' {
    interface Request {
      userId?: string;
    }
  }
//Middleware to authenticate the user with token
export const authMiddleware = (req: Request, res: Response, next:NextFunction) => {
    const authorization = req.header('authorization'); // get the token from the header
    const token = authorization && authorization.split(' ')[1]; // get the token from the header 
    console.log("Request Headers:", req.headers);
    console.log("Recived Token:", token);
    // if token is not found, send error response
    if(!token) { 
        res.status(401).send('Missing Token');
        return;
    }
    if(!process.env.TOKEN_SECRET) {
        res.status(500).json({ message: "Missing authentication configuration" });
        return;
    }

    // verify the token with the secret key
    jwt.verify(token, process.env.TOKEN_SECRET,(err,decoded)=>{
        if(err) {
            res.status(403).send('Invalid Token');
            return;
        }
       
        // Safely cast the decoded token to our defined JwtPayload type
        const payload = decoded as JwtPayload;

        // Set the user ID on the request object
        req.userId = payload._id;
        next();
    }); 
    
};


export default { register, login ,logout,refresh, authMiddleware,googleLogin,getUserInfo};


