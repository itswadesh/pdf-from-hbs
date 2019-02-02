const Fs = require('fs')
const Path = require('path')
const Util = require('util')
const Puppeteer = require('puppeteer')
const Handlebars = require('handlebars')
const axios = require('axios')
const dotenv = require('dotenv')
const ReadFile = Util.promisify(Fs.readFile)
dotenv.load({ path: '.env' })

class Invoice {
  async pdf(orderNo) {
    const { order, html } = await this.html(orderNo)
    const browser = await Puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(html)
    const invoiceNo = order.address.phone + '-' + order.orderNo
    await page.pdf({ path: 'exports/invoice/' + invoiceNo + '.pdf' })
    await browser.close()
    const emailObj = {
      to: order.email,
      subject: 'Litekart: New Order #' + order.orderNo,
      template: 'order/created',
      context: order,
      attachments: [{   // file on disk as an attachment
        filename: 'Invoice ' + invoiceNo + '.pdf',
        path: 'exports/invoice/' + invoiceNo + '.pdf'
      }]
    }
    try {
      this.email(emailObj)
    }
    catch (e) {
      console.log('Email error...', e);
    }
  }
  async html(orderNo) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.TOKEN}`
      const { data, status } = await axios.get(`${process.env.API}/orders/${orderNo}`)
      // compile and render the template with handlebars
      const templatePath = Path.resolve('templates', 'invoice', 'gst.html')
      const content = await ReadFile(templatePath, 'utf8')
      const template = Handlebars.compile(content)
      return { order: data, html: template(data) }
    } catch (e) {
      throw new Error('Cannot create invoice HTML template.', e)
    }
  }

  async email({ to, subject, bcc, template, html, context, attachments }) {
    const { EMAIL_ADDRESS, SENDGRID_API_KEY } = process.env
    const nodemailer = require('nodemailer')
    const hbs = require('nodemailer-express-handlebars')
    var hbsOptions = {
      viewEngine: {
        extname: '.hbs',
        layoutsDir: 'templates/',
        defaultLayout: 'order/created',
        partialsDir: 'views/partials/'
      },
      viewPath: 'templates/',
      extName: '.hbs'
    };

    var sg = require('nodemailer-sendgrid-transport');

    var options = {
      auth: {
        api_key: SENDGRID_API_KEY
      }
    }
    var mailer = nodemailer.createTransport(sg(options));
    mailer.use('compile', hbs(hbsOptions));
    try {
      const info = await mailer.sendMail({ from: EMAIL_ADDRESS, to, subject, template, context, attachments })
      console.log('email success...', info);
      return info
    } catch (e) {
      throw new Error(e)
    }
  }
}

let i = new Invoice()
i.pdf('5c5534c7888c00411d5fb3f7')