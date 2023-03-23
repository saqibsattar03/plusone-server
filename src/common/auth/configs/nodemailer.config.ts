import nodemailer from 'nodemailer';
import { authConfig } from './auth.config';

const user = authConfig.user;
const pass = authConfig.pass;

// const transport = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: user,
//     pass: pass,
//   },
// });

// export const sendConfirmationEmail = (email, confirmationCode) => {
//   console.log('check');
//   transport
//     .sendMail({
//       from: user,
//       to: email,
//       subject: 'Please confirm your account',
//       html: `<h1>Email Confirmation</h1>
// <!--        <h2>Hello ${name}</h2>-->
// <h2>hello testing user</h2>
//         <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
//         <a href=http://localhost:3000/confirm/${confirmationCode}> Click here</a>
//         </div>`,
//     })
//     .catch((err) => console.log(err));
// };
