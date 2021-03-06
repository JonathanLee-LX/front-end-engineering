const minimist = require('minimist')

module.exports = () => {
    const args = minimist(process.argv.slice(2))
    const cmd = args._[0]
    console.log(Object.keys(args))

    if(.version || args.v){
        cmd = 'version'
    }

    if(args.help || args.h){
        cmd = 'help'
    }

    switch(cmd){
        case 'today':
            require('./cmds/today')()
            break
        case 'version':
            require('./cmds/version')()
            break
        case 'help':
            require('./cmds/help')()
            break
        default:
            console.error(`${cmd} is not a valid cmd.`)
            break
    }
}
