// const Fs = require('fs')
// const Path = require('path')
// const Util = require('util')
// const Puppeteer = require('puppeteer')
// const Handlebars = require('handlebars')
// const axios = require('axios')
// const dotenv = require('dotenv')
// const ReadFile = Util.promisify(Fs.readFile)
// dotenv.load({ path: '.env' })
import { Invoice } from './../../base'
let i = new Invoice()
exports.handler = async (event, context) => {
    if (event.httpMethod !== "GET") {
        return { statusCode: 405, body: "Only GET:Request Allowed" };
    }
    const orderNo = event.path.replace("mail", "").replace("//", "").replace("/", "") || "5c5534c7888c00411d5fb3f7";
    // const name = event.queryStringParameters.name || "";
    try {
        await i.pdf(orderNo)
    } catch (e) {
        console.log('err from base ctrl...', e);
    }
    return {
        statusCode: 200,
        body: `Hello, ${orderNo}`
    };
};
// exports.pdf = async (orderNo) => {
//     const { order, html } = await this.html(orderNo)
//     const browser = await Puppeteer.launch()
//     const page = await browser.newPage()
//     await page.setContent(html)
//     const invoiceNo = order.address.phone + '-' + order.orderNo
//     await page.pdf({ path: 'exports/invoice/' + invoiceNo + '.pdf' })
//     await browser.close()
//     const emailObj = {
//         to: order.email,
//         subject: 'Litekart: New Order #' + order.orderNo,
//         template: 'order/created',
//         context: order,
//         attachments: [{   // file on disk as an attachment
//             filename: 'Invoice ' + invoiceNo + '.pdf',
//             path: 'exports/invoice/' + invoiceNo + '.pdf'
//         }]
//     }
//     try {
//         await this.email(emailObj)
//     }
//     catch (e) {
//         console.log('Email error...', e);
//     }
// }
// exports.html = async (orderNo) => {
//     try {
//         axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.TOKEN}`
//         const { data, status } = await axios.get(`${process.env.API}/orders/${orderNo}`)
//         // compile and render the template with handlebars
//         const templatePath = Path.resolve('templates', 'invoice', 'gst.html')
//         const content = await ReadFile(templatePath, 'utf8')
//         const template = Handlebars.compile(content)

//         return { order: data, html: template(data) }
//     } catch (e) {
//         throw new Error('Cannot create invoice HTML template.', e.response.status, e.response.data)
//     }
// }
// exports.email = async ({ to, subject, bcc, template, html, context, attachments }) => {
//     const { EMAIL_ADDRESS, MAILGUN_API_KEY } = process.env
//     const nodemailer = require('nodemailer')
//     const hbs = require('nodemailer-express-handlebars')
//     var options = {
//         viewEngine: {
//             extname: '.hbs',
//             layoutsDir: 'templates/',
//             defaultLayout: 'order/created',
//             partialsDir: 'views/partials/'
//         },
//         viewPath: 'templates/',
//         extName: '.hbs'
//     };

//     var mg = require('nodemailer-mailgun-transport');

//     var auth = {
//         auth: {
//             api_key: MAILGUN_API_KEY,
//             domain: 'angularcode.com'
//         }
//     }
//     var mailer = nodemailer.createTransport(mg(auth));
//     mailer.use('compile', hbs(options));
//     try {
//         const info = await mailer.sendMail({ from: EMAIL_ADDRESS, to, subject, template, context, attachments })
//         console.log('email success...', info);
//         return info
//     } catch (e) {
//         throw new Error(e)
//     }
// }
