# Nodejs Authentication System 	:closed_lock_with_key:

## About the Application :clipboard:

This is an Authentication system, where user can create their accounts, sign in to their account and reset their passwords if required. User can also choose to sign up from google. The passwords are hashed before storing in DB. Account activation and reset links are sent via nodemailer. This system can be used as a starter code for creating any new user application.

> [!IMPORTANT]
> In the project etheral dummy SMTP service has been used. As a part of project setup please create a dummy email and password from 'etheral.email'. All the emails will be send to the dummy email inbox you create, you can keep the inbox open by clicking on 'Open Mailbox' right beside the dummy email you create. 

### Steps to use the application

- Run "npm i" or "npm install" on terminal.
- Go to "https://ethereal.email/" and create a dummy email and password. After creating your dummy email, click on 'Open Mailbox' (We will be using ethereal that provides dummy SMTP service, to send activation and reset links on email)
- Please keep the tab open you'll need the ethereal mailbox to check for activation and reset links.  
- Go to authController and replace the etherealEmail and etherealPass values with the dummy email and password you've created from ethereal.email
- Run "npm start" on terminal.
- The terminal should display a log saying "Server started at port 5000" and "Server connected to MongoDB"
- Once done, open your browser and on provide "http://localhost:5000/". You will be redirected to homepage successfully.

### Creating a new user or Signing up

- Once you've reached the homepage after following the above steps. Click on "register" button to create new account.
- You will be redirected to a sign up form page, you also will have a link below the form to signup with google.
- If you don't wish to sign up with google, then just fill up the provided form with your 'Name', 'Email', 'Password' and 'Confirm password' (Make sure password and confirm passwords are similar). And click on 'Sign up' button to submit.
- You'll be redirected to 'login page' and receive a notification on the login form itself saying 'Activation link sent to email ID. Please check your email'
- Go to the ethereal.email mailbox, and refresh the page, youll see your mail, with the activation link.
- copy the link and paste on a new tab URL. Once done Your account will be automatically created.
- Now go back to the login page and enter your email and password.
- You'll be successfully logged in to your account.

### Signing in to your account

- If you already have an account created, then just enter your email and password and click on sign in.

### Resetting your password

If you have forgotten your password, then follow these steps to reset your password and recover your account,

- Click on reset link below the sign-in form, you will be redirected to a page that asks your registered email
- enter your email and submit
- A notification will pop saying activation link sent to your email
- We have used Ethereal email so you'll again need the same ethereal inbox, reset link will be sent to the same inbox
- Copy paste the activation link in a tab and you'll be guided to reset page
- Enter your new password and confirm the same password and submit
- You'll receive a notification saying 'password reset successfully
- Sign in with your new password

## Techstack

1. Nodejs
2. Expressjs
3. MongoDB
4. Google oauth2 (For authentication via google)
5. Json web token
6. Nodemailer (For sending Emails)
7. Ejs (Templating engine)
8. Bootstrap (For frontend Ui)

