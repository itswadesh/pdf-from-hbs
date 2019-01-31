'use strict'

let pdf = require('handlebars-pdf')
let document = {
  template: '<h1>{{msg}}</h1>' +
    '<p style="color:red">Red text</p>' +
    '<img src="https://archive.org/services/img/image" />',
  context: {
    msg: 'Hello world'
  },
  path: "./test-" + Math.random() + ".pdf"
}

pdf.create(document)
  .then(res => {
    console.log(res)
  })
  .catch(error => {
    console.error(error)
  })
