const fs = require('fs')

const takeScreenshot = (path, image) => {
    fs.access(path, fs.F_OK, (err) => {
        if (err) {
            console.info("File path doesn't exists ... Let's create!")
            fs.mkdir(path, {recursive: true}, err => new Error(err))
        }
        browser.saveScreenshot(path + image)
    })
}

const getBrowserTitle = () => browser.getTitle()

const getPageHeader = () => $('.page-heading').getText()

module.exports = {
    takeScreenshot,
    getBrowserTitle,
    getPageHeader
}
