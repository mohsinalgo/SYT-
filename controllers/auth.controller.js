const db = require("../models");
const User = db.User;
const { validateUser, generateAuthToken } = require('../models/user')

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const saltRounds = 10;

// Create and Save a new User
exports.signup = async (req, res) => {
    
    const { error } = validateUser(req.body)
    if (error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        let isUser = await User.count({
            where: {
                email: req.body.email,
            }
        })
        if (isUser) {
            return res.status(400).json({ errors: [{ message: "Email already exists" }] });
        }
        let user = await User.create({
            ...req.body,
            password: bcrypt.hashSync(req.body.password, saltRounds)
        })

        const { userObj, token } = generateAuthToken(user)
        
        // token should be send at header e.g: 
        // return res.header('x-auth-token', token).status(201).json({ user: userObj, token });
        // return res.send({ user: userObj, token, message: "User was registered successfully!" });
        return res.status(201).json({ user: userObj, token, message: "User was registered successfully!" });
    } catch (error) {
        return res.status(400).json({ errors: error });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
        
    if (!email || !password) {
        return res.status(400).json({
            status: "error",
            message: "email and password both fields are required",
        });
    }
    let user = await User.findOne({ where: { email: email }
    });
    if (!user) {
        return res.status(404).send({ message: "Invalid Email or Password." });
    }
    var passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
        return res.status(400).json({ errors: [{ message: "Invalid Email or Password..." }] })
    }

    var newUser = user.dataValues;
    delete newUser.password
    
    var token = jwt.sign(
        newUser,
        'privateKey',
        {
            expiresIn: 86400, // 24 hours
        }
    );
    res.status(200).send({
        user: newUser,
        token,
    });
};

exports.validateEmail = async (req, res) => {
    const { email } = req.body;
    if(!email){
        return res.status(400).json({
            status: "error",
            message: "email is required",
        });
    }
    try {
        let isUser = await User.findOne({ where: { email: email }});
        if (isUser) {
            return res.status(400).json({ errors: [{ message: "Email already exists" }] });
        }
        return res.status(200).send({ message: "success", code: 1 });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }    
};

// Get a User by the id in the request
// exports.get = async (req, res) => {
//     var includeModels = [
//         {
//             model: Role,
//             attributes: ["id", "code", "name"],
//         },
//         {
//             model: Languages,
//             attributes: ["name"],
//             through: { attributes: [] },
//         },
//         {
//             model: NotaryProfile,
//             include: [
//                 {
//                     model: File,
//                     as: "insurance_policy",
//                 },
//                 {
//                     model: File,
//                     as: "passport_file",
//                 },
//                 {
//                     model: notaryTypes,
//                     through: { attributes: [] },
//                 }
//             ],
//         },
//         {
//             model: File,
//             as: "profile_picture",
//         },
//         {
//             model: UserProfile,
//         },
//     ];
//     var userId = "";

//     if (req.params.id) {
//         if (req.user.role == "admin" || req.user.id == req.params.id) {
//             userId = req.params.id;
//         } else {
//             res.status(403).send({
//                 status: "error",
//                 message: "you are unauthorized to view this user",
//             });
//         }
//     } else {
//         userId = req.user.id;
//     }

//     var user = await User.findOne({
//         where: {
//             id: req.user.id,
//         },
//         include: includeModels,
//     });
//     var newUser = user;
//     if (user.userProfile) {
//         var primaryNotaryObj = await User.findOne({
//             where: user.userProfile.notaryId,
//         });
//         newUser = user.toJSON();
//         newUser.primaryNotary = `${primaryNotaryObj.firstName} ${primaryNotaryObj.lastName}`;
//         newUser.primaryNotaryId = primaryNotaryObj.id;
//         primaryNotary = `${primaryNotaryObj.firstName} ${primaryNotaryObj.lastName}`;
//     }
//     res.status(200).send({
//         user: newUser,
//     });
// };

// exports.update = async (req, res) => {
//     if (req.body.user && req.body.user.password) {
//         res.status(400).send({ status: "error", message: "Bad Request" });
//     }

//     try {
//         var user = await User.findOne({
//             where: {
//                 id: req.user.id,
//             },
//         });
//         var includeModels = [
//             {
//                 model: Role,
//                 attributes: ["id", "code", "name"],
//             },
//             {
//                 model: Languages,
//                 attributes: ["name"],
//                 through: { attributes: [] },
//             },
//             {
//                 model: NotaryProfile,
//                 include: [
//                     {
//                         model: File,
//                         as: "insurance_policy",
//                     },
//                     {
//                         model: File,
//                         as: "passport_file",
//                     },
//                     {
//                         model: notaryTypes,
//                         through: { attributes: [] },
//                     }
//                 ],
//             },
//             {
//                 model: File,
//                 as: "profile_picture",
//             },
//             {
//                 model: UserProfile,
//             },
//         ];

//         var allowedLangs = ["French", "English", "Spanish"];
//         if (req.body.languages) {
//             var languages = [];
//             for (var i = 0; i < req.body.languages.length; i++) {
//                 var lang = await Languages.findOne({
//                     where: {
//                         name: req.body.languages[i],
//                     },
//                 });
//                 if (lang == null) {
//                     res.status(400).send({
//                         message: `Languages can only be one of these [${allowedLangs.join(
//                             ", "
//                         )}]`,
//                     });
//                 }
//                 languages.push(lang.id);
//             }

//             await user.setLanguages(languages);
//         }
//         if (req.body.user) {
//             await User.update(req.body.user, { where: { id: req.user.id } });
//         }

//         if (req.user.role == "user" && req.body.userProfile) {
//             var profile = await user.getUserProfile();

//             if (profile == null) {
//                 await user.createUserProfile(req.body.userProfile);
//             } else {
//                 await userProfile.update(req.body.userProfile, {
//                     where: { userId: req.user.id },
//                 });
//             }
//         }
//         if (req.user.role == "notary" && req.body.notaryProfile) {
//             var profile = await user.getNotaryProfile();
//             if (profile == null) {
//                 await user.createNotaryProfile(req.body.notaryProfile);
//             } else {
//                 await NotaryProfile.update(req.body.notaryProfile, {
//                     where: { userId: req.user.id },
//                 });
//                 if(req.body.notaryProfile.notaryTypes) await profile.setNotaryTypes(req.body.notaryProfile.notaryTypes);
//             }
//         }
//         user = await User.findOne({
//             where: {
//                 id: req.user.id,
//             },
//             include: includeModels,
//         });
//         var newUser = user;

//         if (user.userProfile) {
//             var primaryNotaryObj = await User.findOne({
//                 where: user.userProfile.notaryId,
//             });
//             newUser = user.toJSON();
//             newUser.primaryNotary = `${primaryNotaryObj.firstName} ${primaryNotaryObj.lastName}`;
//             newUser.primaryNotaryId = primaryNotaryObj.id;
//             primaryNotary = `${primaryNotaryObj.firstName} ${primaryNotaryObj.lastName}`;
//         }
//         //check if profile is completed for notary
//         if (newUser.Role.code == "notary") {
//             let profileCompleted = isProfileCompleted(newUser);

//             if (profileCompleted) {
//                 var profile = await user.getNotaryProfile();

//                 profile.profile_completed = 1;
//                 await profile.save();

//                 newUser.notaryProfile.profile_completed = 1;
//             } else {
//                 var profile = await user.getNotaryProfile();
//                 profile.profile_completed = 0;
//                 await profile.save();
//                 newUser.notaryProfile.profile_completed = 0;
//             }
//         }

//         res.status(200).send({
//             user: newUser,
//         });
//     } catch (err) {
//         console.log(err);
//         var error;
//         if (
//             err.name === "SequelizeValidationError" ||
//             err.name === "SequelizeForeignKeyConstraintError"
//         ) {
//             if (err.name === "SequelizeValidationError") {
//                 error = {
//                     err: err.errors[0].message,
//                 };
//             }
//             if (err.name === "SequelizeForeignKeyConstraintError") {
//                 error = {
//                     err: err.parent.sqlMessage,
//                 };
//             }
//         } else {
//             error = {
//                 err: err,
//             };
//         }
//         res.status(500).send(error);
//     }
// };

// Delete a User with the specified id in the request
// exports.delete = (req, res) => { };

// // Transporter for email
// const transporter = nodemailer.createTransport({
//   host: "manta.websitewelcome.com",
//   secure: true,
//   port: 465,
//   auth: {
//     user: "testing@codup.io",
//     pass: "click@12345",
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// exports.password_reset = async (req, res) => {
//     const { email } = req.body;

//     if (!email) {
//         res.status(500).send({ status: "error", message: "Email cannot be empty" });
//     }

//     const code = randomstring.generate({
//         length: 6,
//         charset: "alphanumeric",
//     });

//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//         return res.status(422).json({
//             error: "No user found for such email",
//         });
//     }

//     const used = await Code.update(
//         { is_used: true },
//         { where: { user_id: user.id } }
//     );

//     var codeObj = {
//         user_id: user.id,
//         code,
//         expiry: Date.now() + 3600000,
//         is_used: false,
//     };
//     const savedCode = await Code.create(codeObj);

//     let html = await utils.GetParsedTemplate("forgot-password", {
//         code: savedCode.code,
//     });

//     let emailObj = {
//         to: user.email, // list of receivers
//         from: "<" + process.env.senderEmail + ">", // sender address
//         subject: "User Reset Password Notification", // Subject line
//         text: html,
//         // html: html, // html body
//     };

//     let info;
//     info = await emailService.SendEmail(emailObj);
//     if (info) {

//         if (info.messageId) {
//             res.status(200).json({
//                 message: "check your email", userId: user.id
//             });
//         } else if (info.status == "error") {
//             res.status(400).json({
//                 message: "error in sending email",
//             });
//         }
//     }

//     //   const message = {
//     //     from: "talhaanwer300@gmail.com",
//     //     to: user.email,
//     //     subject: "password reset",
//     //     html: `
//     //             <p>You requested for password reset</p>
//     //             <h5>${savedCode.code}</h5>
//     //         `,
//     //   };
//     //   transporter.sendMail(message, (err, info) => {
//     //     if (err) {
//     //       res.status(400).json({
//     //         message: "error in sending email",
//     //         err,
//     //       });
//     //     } else {
//     //       res.status(200).json({
//     //         message: "check your email",
//     //       });
//     //     }
//     //   });
// };

// exports.reset_code = async (req, res) => {
//     const { code, user_id } = req.body;
//     const user = await User.findOne({ where: { id: user_id } })

//     const savedCode = await Code.findOne({
//         where: { user_id, is_used: false, code, expiry: { [Op.gt]: Date.now() } },
//     });

//     let codeCompare = savedCode.code.localeCompare(code)
//     let emailObj = {
//         to: user.email, // list of receivers
//         from: "<" + process.env.senderEmail + ">", // sender address
//     };
//     let html;

//     if (!savedCode || codeCompare != 0) {
//         emailObj.subject = "Password Request Change Failed"
//         html = await utils.GetParsedTemplate("forgot-password-abort", {});
//         emailService.SendEmail(emailObj);
//         return res.status(422).json({ error: "Invalid Code, Try again!" });
//     } else {

//         emailObj.subject = "Password Reset Confirmation"
//         html = await utils.GetParsedTemplate("forgot-password-confirm", {});
//         emailService.SendEmail(emailObj);
//         return res.status(200).json({
//             message: "Validation successful",
//         });
//     }
// };

// exports.new_password = async (req, res) => {
//     const { newPassword, confirmPassword, user_id } = req.body;
//     if (!newPassword || !confirmPassword) {
//         res
//             .status(500)
//             .send({ status: "error", message: "Please add all the fields" });
//     }

//     if (newPassword != confirmPassword) {
//         res
//             .status(400)
//             .send({ status: "error", message: "Password does not match" });
//     }
//     if (newPassword.length < 8) {
//         res.status(500).send({
//             status: "error",
//             message: " minimum of 8 characters are required",
//         });
//     }

//     hashedPassowrd = bcrypt.hashSync(newPassword, saltRounds);

//     let user = await User.update(
//         { password: hashedPassowrd },
//         {
//             where: {
//                 id: user_id,
//             },
//         }
//     );

//     let updatedCode = Code.update(
//         { is_used: true },
//         { where: { user_id, is_used: false } }
//     );

//     if (user) {
//         return res.status(200).json({
//             message: "Password updated successfully",
//             Success: user,
//         });
//     }
// };

// let isProfileCompleted = function (user) {
//     var bool = true;
//     if (user.notaryProfile == null || !user.Languages.length) {
//         bool = false;
//     }
//     var userFields = [
//         "firstName",
//         "lastName",
//         "phone",
//         "address",
//         "city",
//         "state",
//         "zip",
//     ];
//     var notaryFields = [
//         "commissionNo",
//         "notaryExpiry",
//         "commisionState",
//         "passport",
//         "insurancePolicy"
//     ];
//     userFields.forEach((field) => {
//         if (user[field] == "" || user[field] == null) {
//             bool = false;
//         }
//     });
//     notaryFields.forEach((field) => {
//         if (
//             user["notaryProfile"][field] == "" ||
//             user["notaryProfile"][field] == null
//         ) {
//             bool = false;
//         }
//     });
//     return bool;
// };


// exports.redirectToLogin = async (req, res) => {
//     var code = req.params.code;
//     //check if code exists
//     var codeExists = await NotaryProfile.findOne({
//         where: {
//             refCode: code
//         }
//     });
//     if (codeExists) {
//         return res.redirect(`${process.env.baseUrl}/#/auth/registration?ref=${code}`);
//     }
//     res.redirect(`${process.env.baseUrl}/#/auth/registration`);

// }


// exports.getEmailLogs = async (req, res) => {
//     try {

//         let search = {}
//         let offset;

//         let page = req.query?.page ? req.query.page : 1
//         search.where = { status: req.query.status }

//         search.limit = req.query?.limit ? parseInt(req.query?.limit) : 10;
//         if (page) {

//             offset = search.limit * (page - 1);
//             search.offset = offset;
//         }
//         if (req.query.sortBy) {
//             order = [[req.query.sortField, req.query.sortBy]]
//             search.order = order;
//         }

//         let logs = await emailLogService.getLogs(search)

//         res.status(200).send({ logs: logs });

//     } catch (err) {
//         console.log('catch', err);
//         res.status(500).send({ status: 'error', message: err.raw.message });
//     };
// }