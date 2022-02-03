const loggerColors = {
    lightRed: "\x1b[1m\x1b[31m",
    red: '\x1b[31m',
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    reset: "\x1b[0m"
}

const logColor = (color: keyof typeof loggerColors) => process.env.DEVELOPMENT === "DEV" ? loggerColors[color] : ''

const logger = {
    debug: (message: any, ...params: any[]) => { console.debug(`${logColor('cyan')}[DEBUG] ${message instanceof Error ? message.stack : message}`, ...params)},
    info: (message: any, ...params: any[]) => { console.info(`${logColor('blue')}[INFO] ${message instanceof Error ? message.stack : message}`, ...params)},
    warn: (message: any, ...params: any[]) => { console.warn(`${logColor('lightRed')}[WARN] ${message instanceof Error ? message.stack : message}`, ...params)},
    error: (message: any, ...params: any[]) => { console.error(`${logColor('red')}[ERROR] ${message instanceof Error ? message.stack : message}`, ...params)},
    log: (message: any, ...params: any[]) => { console.error(`${logColor('reset')}[LOG] ${message instanceof Error ? message.stack : message}`, ...params)},
}
    
export default logger
