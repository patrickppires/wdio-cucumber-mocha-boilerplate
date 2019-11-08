const faker = require('faker')
faker.locale = 'pt_BR'

const fakeFirstName = () => faker.name.firstName()

const fakeLastName = () => faker.name.lastName()

const fakeStreetName = () => faker.address.streetName()

const fakeSecondaryAddress = () => faker.address.secondaryAddress()

const fakeCityName = () => faker.address.city()

const fakePostalCode = () => faker.address.zipCode('#####')

const fakePhoneNumber = () => faker.phone.phoneNumber()

const fakeEmail = () => faker.internet.email()

const fakePassword = () => faker.internet.password()

const fakeCompanyName = () => faker.company.companyName()

const fakeLorem = () => faker.lorem.paragraph(2)

const fakeNumber = (min, max) => Math.floor(Math.random() * (max - min)) + min

module.exports = {
    fakeCityName,
    fakeCompanyName,
    fakeEmail,
    fakeFirstName,
    fakeLastName,
    fakeLorem,
    fakeNumber,
    fakePassword,
    fakePhoneNumber,
    fakePostalCode,
    fakeSecondaryAddress,
    fakeStreetName
}
