const User = require('../models/user');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const Blog = require('../models/blog');
const { errorHandler } = require('../helpers/dbErrorHandler');
const _ = require('lodash');
const {OAuth2Client} = require('google-auth-library');
const fs =  require('fs'); 

//SES
const AWS = require('aws-sdk');

exports.preSignup = (req, res) => {
    const { username, name, email, password } = req.body;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if(user) {
            return res.status(400).json({
                error: 'Email already exsist!'
            });
        }

        User.findOne({username: username.toLowerCase()}, (err, user) => {
            if(user) {
                return res.status(400).json({
                    error: 'Username already exsist!'
                });
            }

            const token = jwt.sign({ username, name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '10m' });

            const SESConfig = {
                apiVersion: '2010-12-01',
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_SES_REGION
            };            

            var params = {
                Source: 'authentication@inbrief.dev',
                Destination: {
                    ToAddresses:[
                        `${email}`
                    ]
                },
                ReplyToAddresses: [
                    'bhavinkamani.inbrief@gmail.com'
                ],
                Message: {
                    Body: {
                        Html: {
                            Charset: "UTF-8",
                            Data: `<!doctype html>
                            <html>
                              <head>
                                <meta name="viewport" content="width=device-width">
                                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                                <title>Welcome Onboard!</title>
                                <style>
                                @media only screen and (max-width: 620px) {
                                  table[class=body] h1 {
                                    font-size: 28px !important;
                                    margin-bottom: 10px !important;
                                  }
                                  table[class=body] p,
                                        table[class=body] ul,
                                        table[class=body] ol,
                                        table[class=body] td,
                                        table[class=body] span,
                                        table[class=body] a {
                                    font-size: 16px !important;
                                  }
                                  table[class=body] .wrapper,
                                        table[class=body] .article {
                                    padding: 10px !important;
                                  }
                                  table[class=body] .content {
                                    padding: 0 !important;
                                  }
                                  table[class=body] .container {
                                    padding: 0 !important;
                                    width: 100% !important;
                                  }
                                  table[class=body] .main {
                                    border-left-width: 0 !important;
                                    border-radius: 0 !important;
                                    border-right-width: 0 !important;
                                  }
                                  table[class=body] .btn table {
                                    width: 100% !important;
                                  }
                                  table[class=body] .btn a {
                                    width: 100% !important;
                                  }
                                  table[class=body] .img-responsive {
                                    height: auto !important;
                                    max-width: 100% !important;
                                    width: auto !important;
                                  }
                                }
                                @media all {
                                  .ExternalClass {
                                    width: 100%;
                                  }
                                  .ExternalClass,
                                        .ExternalClass p,
                                        .ExternalClass span,
                                        .ExternalClass font,
                                        .ExternalClass td,
                                        .ExternalClass div {
                                    line-height: 100%;
                                  }
                                  .apple-link a {
                                    color: inherit !important;
                                    font-family: inherit !important;
                                    font-size: inherit !important;
                                    font-weight: inherit !important;
                                    line-height: inherit !important;
                                    text-decoration: none !important;
                                  }
                                  #MessageViewBody a {
                                    color: inherit;
                                    text-decoration: none;
                                    font-size: inherit;
                                    font-family: inherit;
                                    font-weight: inherit;
                                    line-height: inherit;
                                  }
                                  .btn-primary table td:hover {
                                    background-color: rgb(255,153,0); !important;
                                  }
                                  .btn-primary a:hover {
                                    background-color: rgb(255,153,0); !important;
                                    border-color: rgb(255,153,0); !important;
                                  }
                                }
                                </style>
                              </head>
                              <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
                                <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">This is preheader text. Some clients will show this text as a preview.</span>
                                <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
                                  <tr>
                                    <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
                                    <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
                                      <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
                            
                                        <!-- START CENTERED WHITE CONTAINER -->
                                        <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">
                            
                                          <!-- START MAIN CONTENT AREA -->
                                          <tr>
                                            <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                                              <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                                <tr>
                                                  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                                                    <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hi ${name},</p>
                                                    <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">You are just a click away from writing your blogs on InBrief. Please Click on Verify Email to get started.</p>
                                                    <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
                                                      <tbody>
                                                        <tr>
                                                          <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
                                                            <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                                              <tbody>
                                                                <tr>
                                                                  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center;"> <a href="${process.env.CLIENT_URL}/auth/account/activate/${token}" target="_blank" style="display: inline-block; color: #ffffff; background-color: rgb(255,153,0); border: solid 1px rgb(255,153,0); border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize;">Verify Email</a> </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Express yourself to world!</p>
                                                  </td>
                                                </tr>
                                              </table>
                                            </td>
                                          </tr>
                            
                                        <!-- END MAIN CONTENT AREA -->
                                        </table>
                            
                                        <!-- START FOOTER -->
                                        <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
                                          <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                            <tr>
                                              <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
                                                <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">InBrief Inc, India</span>
                                                <br> This is a system generated Mail. Please do not reply.
                                              </td>
                                            </tr>
                                            <tr>
                                              <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
                                                Powered by <a href="https://www.inbrief.dev" style="color: #999999; font-size: 12px; text-align: center; text-decoration: none;">InBrief</a>.
                                              </td>
                                            </tr>
                                          </table>
                                        </div>
                                        <!-- END FOOTER -->
                            
                                      <!-- END CENTERED WHITE CONTAINER -->
                                      </div>
                                    </td>
                                    <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
                                  </tr>
                                </table>
                              </body>
                            </html>`
                        }
                    },
                    Subject: {
                        Charset: "UTF-8",
                        Data: "Welcome Onboard! Your authentication for InBrief."
                    }
                }
            };

            new AWS.SES(SESConfig).sendEmail(params).promise().then(()=>{
                return res.json({
                            message: `Email has been sent to ${email}. Follow the instructions to activate your account.`
                        });
            }).catch(error => {
                console.log(error);
            });
        });
    });

}


exports.signup = (req, res) => {
    const token = req.body.token
    if(token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
            if(err) {
                return res.status(401).json({
                    error: 'Expired link. Signup again'
                })
            }

            const {username, name, email, password} = jwt.decode(token)
            let profile = `${process.env.CLIENT_URL}/profile/${username}`;

            const user = new User({name, email, password, profile, username})
            
            //Default Profile Photo
            // user.photo.data = fs.readFileSync();
            // user.photo.contentType = `png`;
            //
            user.save((err, user) => {
                if(err) {
                    return res.status(401).json({
                        error: errorHandler(err)
                    });
                }
                return res.json({
                    message: 'Signup success! Please signin'
                });
            });

        })
    } else {
        return res.json({
            message: 'Something went wrong. Try again!'
        });
    }
}

exports.signin = (req, res) => {
    const { email, password } = req.body;
    // check if user exist
    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please signup.'
            });
        }
        // authenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email and password do not match.'
            });
        }
        // generate a token and send to client
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, { expiresIn: '1d' });
        const { _id, username, name, email, role } = user;
        return res.json({
            token,
            user: { _id, username, name, email, role }
        });
    });
};

exports.signout = (req, res) => {
    res.clearCookie('token');
    res.json({
        message: 'Signout success'
    });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET
});

exports.authMiddleware = (req, res, next) => {
    const authUserId = req.user._id;
    User.findById({ _id: authUserId }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        req.profile = user;
        next();
    });
};

exports.adminMiddleware = (req, res, next) => {
    const adminUserId = req.user._id;
    User.findById({ _id: adminUserId }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        if (user.role !== 1) {
            return res.status(400).json({
                error: 'Admin resource. Access denied'
            });
        }

        req.profile = user;
        next();
    });
};

exports.canUpdateDeleteBlog = (req, res, next) => {
    const slug = req.params.slug.toLowerCase()
    Blog.findOne({slug}).exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        let authorizedUser = data.postedBy._id.toString() === req.profile._id.toString()
        if(!authorizedUser) {
            return res.status(400).json({
                error: 'You are not authorized'
            })
        }
        next();
    })
}

exports.forgotPassword = (req, res) => {
    const {email} = req.body;

    User.findOne({email}, (err, user) => {
        if(err || !user) {
            return res.status(401).json({
                error: 'User with entered email doesn\'t exsist'
            })
        }

        const token = jwt.sign({_id: user._id}, process.env.JWT_RESET_PASSWORD, {expiresIn: '10m'})
        
        const SESConfig = {
            apiVersion: '2010-12-01',
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_SES_REGION
        };            

        var params = {
            Source: 'authentication@inbrief.dev',
            Destination: {
                ToAddresses:[
                    `${email}`
                ]
            },
            ReplyToAddresses: [
                'bhavinkamani.inbrief@gmail.com'
            ],
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<!doctype html>
                        <html>
                          <head>
                            <meta name="viewport" content="width=device-width">
                            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                            <title>Inbrief Support</title>
                            <style>
                            @media only screen and (max-width: 620px) {
                              table[class=body] h1 {
                                font-size: 28px !important;
                                margin-bottom: 10px !important;
                              }
                              table[class=body] p,
                                    table[class=body] ul,
                                    table[class=body] ol,
                                    table[class=body] td,
                                    table[class=body] span,
                                    table[class=body] a {
                                font-size: 16px !important;
                              }
                              table[class=body] .wrapper,
                                    table[class=body] .article {
                                padding: 10px !important;
                              }
                              table[class=body] .content {
                                padding: 0 !important;
                              }
                              table[class=body] .container {
                                padding: 0 !important;
                                width: 100% !important;
                              }
                              table[class=body] .main {
                                border-left-width: 0 !important;
                                border-radius: 0 !important;
                                border-right-width: 0 !important;
                              }
                              table[class=body] .btn table {
                                width: 100% !important;
                              }
                              table[class=body] .btn a {
                                width: 100% !important;
                              }
                              table[class=body] .img-responsive {
                                height: auto !important;
                                max-width: 100% !important;
                                width: auto !important;
                              }
                            }
                            @media all {
                              .ExternalClass {
                                width: 100%;
                              }
                              .ExternalClass,
                                    .ExternalClass p,
                                    .ExternalClass span,
                                    .ExternalClass font,
                                    .ExternalClass td,
                                    .ExternalClass div {
                                line-height: 100%;
                              }
                              .apple-link a {
                                color: inherit !important;
                                font-family: inherit !important;
                                font-size: inherit !important;
                                font-weight: inherit !important;
                                line-height: inherit !important;
                                text-decoration: none !important;
                              }
                              #MessageViewBody a {
                                color: inherit;
                                text-decoration: none;
                                font-size: inherit;
                                font-family: inherit;
                                font-weight: inherit;
                                line-height: inherit;
                              }
                              .btn-primary table td:hover {
                                background-color: rgb(255,153,0); !important;
                              }
                              .btn-primary a:hover {
                                background-color: rgb(255,153,0); !important;
                                border-color: rgb(255,153,0); !important;
                              }
                            }
                            </style>
                          </head>
                          <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
                            <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">This is preheader text. Some clients will show this text as a preview.</span>
                            <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
                              <tr>
                                <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
                                <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
                                  <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
                        
                                    <!-- START CENTERED WHITE CONTAINER -->
                                    <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">
                        
                                      <!-- START MAIN CONTENT AREA -->
                                      <tr>
                                        <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                                          <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                            <tr>
                                              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                                                <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hi there,</p>
                                                <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">You can reset your password by click Reset Password below.</p>
                                                <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
                                                  <tbody>
                                                    <tr>
                                                      <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
                                                        <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                                          <tbody>
                                                            <tr>
                                                              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center;"> <a href="${process.env.CLIENT_URL}/auth/password/reset/${token}" target="_blank" style="display: inline-block; color: #ffffff; background-color: rgb(255,153,0); border: solid 1px rgb(255,153,0); border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize;">Reset Password</a> </td>
                                                            </tr>
                                                          </tbody>
                                                        </table>
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                                <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">This e-mail may contain sensitive information!</p>
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                        
                                    <!-- END MAIN CONTENT AREA -->
                                    </table>
                        
                                    <!-- START FOOTER -->
                                    <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
                                      <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                        <tr>
                                          <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
                                            <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">InBrief Inc, India</span>
                                            <br> This is a system generated Mail. Please do not reply.
                                          </td>
                                        </tr>
                                        <tr>
                                          <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
                                            Powered by <a href="https://www.inbrief.dev" style="color: #999999; font-size: 12px; text-align: center; text-decoration: none;">InBrief</a>.
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                    <!-- END FOOTER -->
                        
                                  <!-- END CENTERED WHITE CONTAINER -->
                                  </div>
                                </td>
                                <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
                              </tr>
                            </table>
                          </body>
                        </html>`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: "Password Reset for your InBrief Account."
                }
            }
        };

        // db
        return user.updateOne({resetPasswordLink: token}, (err, success) => {
            if(err) {
                return res.json({
                    error: errorHandler(err)
                }) 
            } else {
                new AWS.SES(SESConfig).sendEmail(params).promise().then(()=>{
                    return res.json({
                                message: `Email has been sent to ${email}. Follow the instructions to reset your password. Mail expiers in 10 mins.`
                            });
                }).catch(error => {
                    console.log(error);
                });
            }
        });
    });
}

exports.resetPassword = (req, res) => {
    const {resetPasswordLink, newPassword} = req.body;

    if(resetPasswordLink) {
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(err, decoded) {
            if(err) {
                return res.status(401).json({
                    error: 'Expired link. Try again!'
                })
            }
            User.findOne({resetPasswordLink}, (err, user) => {
                if(err || !user) {
                    return res.status(401).json({
                        error: 'Something went wrong. Try later!'
                    }); 
                }

                const updatedFields = {
                    password: newPassword,
                    resetPasswordLink: ''
                }

                user = _.extend(user, updatedFields)

                user.save((err, result) => {
                    if(err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        })
                    }
                    res.json({
                        message: `Password reseted successfully!`
                    })
                })

            })
        })
    }

};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
exports.googleLogin = (req, res) => {
    const idToken = req.body.tokenId
    client.verifyIdToken({idToken, audience: process.env.GOOGLE_CLIENT_ID}).then(response => {
        const {email_verified, name, email, jti} = response.payload
        if(email_verified) {
            User.findOne({email}).exec((err, user) => {
                if(user) {
                    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
                    res.cookie('token', token, {expiresIn: '1d'})
                    const {_id, email, name, role, username} = user;
                    return res.json({token, user:{_id, email, name, role, username}})
                } else {
                    let username = shortId.generate()
                    let profile = `${process.env.CLIENT_URL}/profile/${username}`
                    let password = jti + process.env.JWT_SECRET;
                    user = new User({name, email, profile, username, password})
                    user.save((err, data)=> {
                        if(err) {
                            return res.status(400).json({
                                error: errorHandler(err)
                            })
                        }
                        const token = jwt.sign({_id: data._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
                        res.cookie('token', token, {expiresIn: '1d'})
                        const {_id, email, name, role, username} = data;
                        return res.json({token, user:{_id, email, name, role, username}});
                    })
                }
            })
        } else {
            return res.status(400).json({
                error: 'Google login failed. Try again!!'
            })
        }
    }).catch(error => {
        console.log(error);
    });
}