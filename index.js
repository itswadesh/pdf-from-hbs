const Fs = require('fs')
const Path = require('path')
const Util = require('util')
const Puppeteer = require('puppeteer')
const Handlebars = require('handlebars')
const ReadFile = Util.promisify(Fs.readFile)

class Invoice {
  async html() {
    try {
      const data = {
        your: 'data',
        total: '$ 2100',
        due_date: '31-Jan-2019',
        purchase_date: '01-Jan-2019',
        firstName: 'Swadesh Behera',
        product: { name: 'Your Shop Name' },
        invoice_details: [
          { 'description': 'Fort colins', amount: 100 },
          { 'description': 'Fort colins 2', amount: 200 },
          { 'description': 'Fort colins 3', amount: 300 },
          { 'description': 'Fort colins 4', amount: 400 }
        ]
      }

      const templatePath = Path.resolve('template', 'invoice.html')
      const content = await ReadFile(templatePath, 'utf8')

      // compile and render the template with handlebars
      const template = Handlebars.compile(content)

      return template(data)
    } catch (error) {
      throw new Error('Cannot create invoice HTML template.')
    }
  }

  async pdf() {
    const html = await this.html()
    const browser = await Puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(html)
    await page.pdf({ path: 'exports/invoice-' + Math.random() * 1000 + '.pdf' })
    await browser.close()
  }
}

let i = new Invoice()
i.pdf()