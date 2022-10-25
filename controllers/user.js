const user = require('../models/config_models').user;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const fs = require('fs');
const ejs = require('ejs');
require('dotenv').config();


async function login(req, res) {
    const email = req.body.email;
    user.getUserByEmail(email)
        .then(async(result) => {
            if (!result.length) {
                return res.status(401).json({ message: 'Email not found, please try again.' });
            };

            const userPassword = result[0].password;
            const isUserConfirmed = parseInt(result[0].confirmed);

            const isPasswordCorrect = await bcrypt.compare(req.body.password, userPassword);

            if (!isPasswordCorrect) {
                return res.status(401).json({ message: 'Incorrect password.' });
            };

            if (!isUserConfirmed) {
                return res.status(401).json({ message: 'Please confirm the email sent to you to verify your account.' });
            };

            const thisUser = { name: email };
            const accessToken = jwt.sign(thisUser, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: 60 * 60,
            });

            // res.setHeader('Set-Cookie','novoUser=true')
            res.cookie("jwt", accessToken, {
                maxAge: 1000 * 60 * 60,
                httpOnly: true,
            });

            res.status(200).json({ message: 'Login successful!', user: email, accessToken: accessToken, userId: result[0].user_id });
        })
        .catch((error) => {
            return res.status(401).send({ message: JSON.stringify(error) });
        })
};

async function register(req, res) {
    if (!req.body) {
        const message = { message: 'Body cannot be empty.' };
        return res.status(400).send(message);
    };

    const body = req.body;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(body.password, salt);

    const confirmationToken = jwt.sign(
        req.body.email,
        process.env.ACCESS_TOKEN_SECRET
    );

    const record = [body.firstName, body.lastName, body.phone, body.email, confirmationToken, hashPassword];

    user.registerUser(record)
        .then((result) => {
            sendEmail(body.email, confirmationToken, req, res)
        })
        .catch((error) => {
            var response = JSON.stringify(error);
            if (error.toUpperCase().includes('DUPLICATE ENTRY')) {
                response = "We couldn't create an account with that e-mail. If you have created an account with that e-mail address before please contact our support.";
            };
            console.log('Unable to add user, error:', error, response);
            res.status(400).send({ message: response });
        });
};

async function sendEmail(recipients, confirmationToken, req, res) {
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    }));

    const PORT = process.env.PORT;
    const REMOTE_URL = process.env.REMOTE_URL;

    const template = fs.readFileSync('./views/email_verification.ejs', 'utf8');
    const html = ejs.render(template, { confirmationUrl: REMOTE_URL + PORT + '/api/users/auth/confirm/' + confirmationToken });

    var mailOptions = {
        from: `"Team Based Learning Platform" <${process.env.EMAIL_USER}>`,
        to: recipients,
        subject: 'TBL Platform sign up confirmation',
        text: 'Pending account activation',
        html: html
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('Unable to sent e-mail, error:', error);

            user.deleteUser(recipients)
                .then((result) => {
                    console.log('User deleted with success.')
                })
                .catch((error) => {
                    console.log('Unable to delete user, error:', error);
                });

            res.status(400).send({ message: 'An error has occurred, please verify the inserted email.' });
        } else {
            console.log('E-mail sent: ' + info.response);
            var response = { message: 'An email was sent to you, please confirm your account!' };
            res.status(201).send(response);
        }
    });
};

async function verifyUser(req, res) {
    const confirmationCode = req.params.confirmationCode;
    user
        .activateUser(confirmationCode)
        .then(() => {
            const html = fs.readFileSync('./views/confirmation_page.html', 'utf8');
            return res.send(html);
        })
        .catch((error) => {
            console.log(error);
            return res.status(400).send({
                message: JSON.stringify(response),
            });
        });
};


module.exports = {
    login,
    register,
    verifyUser,
};
