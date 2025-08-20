const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asyncHandler = require('express-async-handler')
const User = require("../model/userModel")
const nodemailer = require("nodemailer");

//@desc Register new User
//@route POST /api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password) {
        res.status(400)
        throw new Error("Please fill in all fields") //restituisce l'errore in html per ricevere un json vedere ./middleware 
    }
    //check if user exist 
    const userExists = await User.findOne({ email });
    if(userExists) {
        res.status(400)
        throw new Error("email exists") //restituisce l'errore in html per ricevere un json vedere ./middleware 
    }

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(password, salt)

    //create user
    const user = await User.create({ name, email, password: hashedPass })

    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("invalid user data")
    }
})


//@desc Authenticate a User
//@route POST /api/users/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    //check user
    const user = await User.findOne({email})
    if(user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("invalid credential")
    }
})

//@desc Get User data
//@route GET /api/users/me
//@access Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
})

//@desc Get User data by id
//@route GET /api/users/getUserById
//@access Private
const getUserById = asyncHandler(async (req, res) => {
    const userId = req.query.id;
    const user = await User.findOne({_id: userId})
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.status(200).json(user);
})

const requestPasswordReset = asyncHandler(async (req, res, next) => {
    const email = req.body.mail;

    try {
        const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    const secret = process.env.JWT + user.password;
    const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '1h' });

     const resetURL = `${process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'https://budget-fe.onrender.com/'}resetpassword?token=${token}`;

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "tommasoversetto@gmail.com",
            pass:  process.env.GOOGLE_SMTP_PASS,
        },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: 'Reset Your Password',
      html: `
      
<!doctype html>
<html lang="en-US">

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    
    <meta name="description" content="Reset Password Email Template.">
    <style type="text/css">
        a:hover {text-decoration: underline !important;}
    </style>
</head>

<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                          <a href="https://rakeshmandal.com" title="logo" target="_blank">
<!--                             <img width="60" src="https://i.ibb.co/hL4XZp2/android-chrome-192x192.png" title="logo" alt="logo"> -->
                          </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h3 style="color:#1e1e2d; font-weight:500; margin:0;font-family:'Rubik',sans-serif;">Hello ${user.name || ''}</h3>
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                            requested to reset your password</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            We cannot simply send you your old password. A unique link to reset your
                                            password has been generated for you. To reset your password, click the
                                            following link and follow the instructions.
                                        </p>
                                        <a href="${resetURL}"
                                            style="background:rgb(38,38,38);text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                            Password</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                             
                        </td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>

</html>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset link sent' });
  } catch (error) {
    console.log(error, "weeoere --------------------");
    
    res.status(500).json({ message: 'Something went wrong' });
  }
}); 


const resetPassword = async (req, res, next) => {
  console.log(req.body, "req.body --------------------");

  const { password, paramToken } = req.body.userData;

  try {
    const decoded = jwt.decode(paramToken);
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(400).json({ message: "User not exists!" });
    }

    const secret = process.env.JWT + user.password;

    // Verify token
    try {
      jwt.verify(paramToken, secret);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(password, salt)

    await User.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          password: hashedPass,
        },
      }
    );


    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


//generate JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}


module.exports = {
    registerUser,
    loginUser,
    getMe,
    getUserById,
    requestPasswordReset,
    resetPassword
}


// ESEMPI BASE PER TESTARE LE ROTTE IN POSTMAN
// //@desc Authenticate a User
// //@route POST /api/users/login
// //@access Public
// const loginUser = (req, res) => {
//     res.json({message: "logged in user"})
// }
// //@desc Get User data
// //@route GET /api/users/me
// //@access Public
// const getMe = (req, res) => {
//     res.json({message: "user data"})
// }