const nodemailer = require("nodemailer");
const fs = require("fs");
const { parse } = require("csv-parse");
const { config } = require("dotenv");
config();
const donePath = "./data/done.json";
const attachmentsPath = "./data/attachments";
const subjectPath = "./data/subject.txt";
const reciepientsPath = "./data/reciepients.csv";
const templatePath = "./data/template.html";

const tester =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

function isValidEmail(email) {
  if (!email) return false;

  var emailParts = email.split("@");

  if (emailParts.length !== 2) return false;

  var account = emailParts[0];
  var address = emailParts[1];

  if (account.length > 64) return false;
  else if (address.length > 255) return false;

  var domainParts = address.split(".");

  if (
    domainParts.some(function (part) {
      return part.length > 63;
    })
  )
    return false;

  return tester.test(email);
}

function randomString(length) {
  let result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const MAX_EMAILS = +process.env.MAX_EMAILS;
const WAIT_TIME = +process.env.WAIT_BETWEEN_MAILS * 1000;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const subject = fs.readFileSync(subjectPath).toString();
const template = fs.readFileSync(templatePath).toString();

const attachments = fs
  .readdirSync(attachmentsPath)
  .filter((file) => fs.lstatSync(`${attachmentsPath}/${file}`).isFile())
  .map((file) => ({
    filename: file,
    path: `${attachmentsPath}/${file}`,
    cid: randomString(20),
  }));

async function sendEmail(email, subject, body) {
  const info = await transporter
    .sendMail({
      from: `"${process.env.SENDER_NAME}" <${process.env.EMAIL}>`,
      to: email,
      subject: subject,
      html: body,
      attachments,
    })
    .catch(console.error);

  return info ? info.messageId : null;
}

async function send() {
  let done = [];
  try {
    const doneFile = JSON.parse(fs.readFileSync(donePath).toString());
    done = doneFile;
  } catch (e) {}

  const reciepients = (
    await parse(fs.readFileSync(reciepientsPath), {}).toArray()
  ).filter(([companyName, phone, personName, email]) => isValidEmail(email));
  const toSend = reciepients.filter(
    ([companyName, phone, personName, email]) => !done.includes(email)
  );
  let count = 0;
  for ([companyName, phone, personName, email] of toSend) {
    await new Promise((res) => setTimeout(() => res(), WAIT_TIME));
    await sendEmail(email, subject, template);
    console.log(`${email}`);
    done.push(email);
    if (++count >= MAX_EMAILS) break;
  }

  console.log(`${count} mail sent`);
  if (done.length === reciepients.length) {
    if (fs.existsSync(donePath)) fs.rmSync(donePath);
    console.log(`Reciepients cycle finished`);
  } else fs.writeFileSync(donePath, JSON.stringify(done));
}
send();
