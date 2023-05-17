import { SES } from 'aws-sdk';
const ACCESS_KEY_ID = 'AKIAZR4CXEL2IAPM4S7P';
const SECRET_ACCESS_KEY = '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';
const AWS_REGION = 'eu-north-1';
const SENDER_EMAIL = ' noreply@plusoneworldwide.com';
const ses = new SES({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

const params = {
  Source: SENDER_EMAIL,
  Template: '../',
};
// const transport = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: user,
//     pass: pass,
//   },
// });

// export const sendConfirmationEmail = (email, confirmationCode) => {
//
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
