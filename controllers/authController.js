const nodemailer = require('nodemailer');
const passport = require('passport');
const bcryptjs = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_KEY = "jwtactive987";
const JWT_RESET_KEY = "jwtreset987";
const saltRounds = 10;


// Ethereal fake SMTP service has been used.
// Go to ethereal.email and create your dummy email & pass 
// All nodemailer emails will be send to that mail you can check it in ethereal.email inbox
const etherealEmail = 'rosalinda.wyman@ethereal.email';
const etherealPass = 'BvPmWbVpuCH2mZgZ84';

// ------- User Model ------- //
const User = require('../models/user');

exports.create = async (req, res) => {

  const  {name, email, password, confirmPassword} = req.body;
  let errors = [];

  // ------ Checking the required fields ------ //
  if(!name || !email || !password || !confirmPassword) {
    errors.push({msg: "Please enter all fields"});
  }

  // ----- Checking if password and confirmPassword match ----- //
  if(password !== confirmPassword) {
    errors.push({msg: "Passwords do not match"});
  }
  // ----- Checking password length ----- //
  if (password.length < 8) {
    errors.push({ msg: 'Password must be at least 8 characters' });
  }
  if(errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  } else {
    User.findOne({ email: email })
      .then(user=>{
        if(user) {
          // ----- User already exists ----- //
          errors.push({ msg: 'Email ID already registered' });
          res.render('register',{
            errors,
            name,
            email,
            password,
            confirmPassword
          });
        } else {

          const token = jwt.sign({name, email, password}, JWT_KEY, {expiresIn: '1h'});
          const CLIENT_URL = 'http://' + req.headers.host;

          const output = `
          <h2>Please click on below link to activate your account</h2>
          <a>${CLIENT_URL}/auth/activate/${token}</a>
          <p><b>NOTE: </b> The above activation link expires in 30 minutes.</p>
          `;

          const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
              user: etherealEmail,
              pass: etherealPass,
            },
          });
              // send mail with defined transport object
            const mailOptions = {
            from: '"Auth Admin" <admin@example.com>', // sender address
            to: email, // list of receivers
            subject: "Account Verification: NodeJS Auth ✔", // Subject line
            generateTextFromHTML: true,
            html: output, // html body
          };
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  console.log(error);
                  req.flash(
                      'error_msg',
                      'Something went wrong on our end. Please register again.'
                      );
                    res.redirect('/auth/login');
              }
                else {
                  console.log('Mail sent : %s', info.response);
                  req.flash(
                      'success_msg',
                      'Activation link sent to email ID. Please check your email'
                  );
                    res.redirect('/auth/login');
                  }
              })
              
        }
      });
  }
}

// --------- Activate account --------- //

exports.activateAccount = (req, res) => {
  const token = req.params.token;
  let errors = [];

  if(token) {
    jwt.verify(token, JWT_KEY, (err, decodedToken)=> {
      if(err){
        req.flash(
          'error_msg',
          'Incorrect or expired link! register again'
        );
        res.redirect('/auth/signUp');
      } else {
        const {name, email, password} = decodedToken;
        User.findOne({email}).then(user=>{
          if(user){
            req.flash(
              'error_msg',
              'Email already exists! Please Log in'
            );
            res.redirect('/auth/login');
          } else {
            // Hashing the password before storing in DB
            const hashPassword = bcryptjs.hashSync(password, saltRounds);
            const newUser = User.create({
              name,
              email,
              password : hashPassword
            })
             
          }
        })
      }
    })
  } else {
    console.log("Activation error")
  }
}

// ------ Forgot password controller action ------>>
exports.forgotPassword = async (req, res) => {
  const{email} = req.body;
  let errors = [];
  if(!email){
    errors.push({msg: 'Please enter your email Id'})
  }
  if(errors.length>0){
    res.render('forgot', {
      errors,
      email
    });
  } else {
    try{
      const user = await User.findOne({email});
      if(!user){
        errors.push({msg: 'User does not exist'});
        return res.render('forgot',{
          errors,
          email,
        })
      }
      const token = jwt.sign({ _id: user._id }, JWT_RESET_KEY, { expiresIn: '30m' });
      const CLIENT_URL = 'http://' + req.headers.host;
      const output = `
          <h2>Please click on below link to reset your account password</h2>
          <p>${CLIENT_URL}/auth/forgot/${token}</p>
          <p><b>NOTE: </b> The activation link expires in 30 minutes.</p>
      `;
      await User.updateOne({resetLink : token});
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: etherealEmail,
          pass: etherealPass,
        },
      });
      // send mail with defined transport object ----->>
      const mailOptions = {
        from: '"Auth Admin" <admin@example.com>', // sender address
        to: email, // list of receivers
        subject: "Account Password Reset: NodeJS Auth ✔", // Subject line
        generateTextFromHTML: true,
        html: output, // html body
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            req.flash(
                'error_msg',
                'Something went wrong on our end. Please Try again.'
                );
              res.redirect('/auth/forgot');
        }
          else {
            console.log('Mail sent : %s', info.response);
            req.flash(
                'success_msg',
                'Password reset link sent to email ID. Please activate to log in.'
            );
              res.redirect('/auth/login');
            }
        })


    } catch(err){

    }
  }

}


// -------- Reset password controller action -------->>
exports.resetFromEmailLink =  (req, res)=> {
  const {token} = req.params;
  if(token){
    jwt.verify(token, JWT_RESET_KEY, async (err, decodedToken)=> {
      if(err){
        req.flash(
          'error_msg',
          'Incorrect or expired link, try again'
        );
        res.redirect('/auth/login');
      } else {
        const {_id} = decodedToken;
        const userFound = await User.findById(_id);
        if(!userFound){
          req.flash(
            'error msg',
            'user with email does not exist, try again',
          );
          res.redirect('/auth/login');
        }
        res.redirect(`/auth/reset/${_id}`);
      }
    })
  } else {
    console.log("Password reset error!")
  }
}

exports.resetPassword = async (req, res)=> {
  let {password, password2} = req.body;
  const id = req.params.id;
  let errors = [];
  if(!password || !password2){
    req.flash(
      'error_msg',
      'please enter all fields'
    );
    res.redirect(`/auth/reset/${id}`);
  }
  // ------- Password length ------>>
  else if(password.length< 0){
    req.flash(
      'error_msg',
      'password too short',
    );
    res.redirect(`/auth/reset/${id}`);
  }
  else if(password != password2){
      req.flash(
        'error_msg',
        'Password do not match',
      );
      res.redirect(`/auth/reset/${id}`);
    }
   
  else {
    // Hashing the password with Bcrypt ---->>
    const hashPassword = bcryptjs.hashSync(password, saltRounds);
    const foundUser = await User.findByIdAndUpdate({_id : id},{password : hashPassword});
    if(!foundUser){
      req.flash(
        'error_msg',
        'Password do not match',
      );
      res.redirect(`/auth/reset/${id}`);
    }
    req.flash(
      'success_msg',
      'Password reset successfully!'
    );
    res.redirect('/auth/login');
  }
}


// ------ Login controller action ------>>
exports.login = (req, res, next) => {
  passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/auth/login',
      failureFlash: true
  })(req, res, next);
}

// ------ Logout controller action ------>>
exports.logout = (req, res) => {
  req.logout(() =>{
      req.flash('success_msg', 'You are logged out');
      res.redirect('/auth/login');
  });
  
}
