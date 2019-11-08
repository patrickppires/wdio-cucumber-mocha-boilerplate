const DBMigrate = require('db-migrate')

const defaultDbConfig = require('./config/database.json')

const dbInstance = () => {
    const maasConsoleConfig = {
        config: defaultDbConfig,
        cmdOptions: {
            config: defaultDbConfig,
            env: 'postgresql'
        },
        env: 'postgresql'
    }
    return DBMigrate.getInstance(true, maasConsoleConfig)
}

module.exports = {
    dbInstance
}
