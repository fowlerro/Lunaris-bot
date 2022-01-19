import { WelcomeMessageFormat } from "types"
import { formatWelcomeMessageList } from "../../commands/Settings/WelcomeMessage/list"
import { WelcomeMessageModel } from "../../database/schemas/WelcomeMessage"
import WelcomeMessage from "../../modules/WelcomeMessage"
import { translate } from "../../utils/languages/languages"

jest.mock('../../database/schemas/WelcomeMessage', () => ({
    WelcomeMessageModel: {
        findOne: jest.fn(({ guildId }) => Promise.resolve({ guildId })),
        create: jest.fn(() => Promise.resolve())
    }
}))

describe('Welcome Message Module', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("Get welcome message config", () => {
        it('should return undefined without guildId', async () => {
            expect.assertions(1)
            const config = await (WelcomeMessage as any).get()
            expect(config).toBeUndefined()
        })

        it('should return finded config', async () => {
            expect.assertions(5)
            const guildId = '12345'
            const config = await WelcomeMessage.get(guildId)
            expect(WelcomeMessageModel.findOne).toHaveBeenCalledTimes(1)
            expect(WelcomeMessageModel.findOne).toHaveBeenCalledWith({ guildId })
            expect(WelcomeMessageModel.create).not.toHaveBeenCalled()
            expect(config).toBeDefined()
            expect(config).toEqual(expect.objectContaining({ guildId }))
        })
    })
    
    describe("FormatWelcomeMessageList in 'welcome list' command", () => {
        it('Empty list', () => {
            const list: WelcomeMessageFormat[] = []
            const language = "en"

            const formatted = formatWelcomeMessageList(list, language)
            expect(formatted).toBe(translate(language, 'cmd.welcome.listEmpty'))
        })

        it('Should format list', () => {
            const list: WelcomeMessageFormat[] = [
                { message: "Welcome {{username}}", event: 'join' },
                { message: "Hi {{username}}", event: 'join' },
                { message: "Hello {{username}}", event: 'leave' }
            ]
            const language = "en"

            const formatted = formatWelcomeMessageList(list, language)
            expect(formatted).toEqual(expect.stringContaining(`1. ${list[0].message} | ${list[0].event}\n`))
            expect(formatted).toEqual(expect.stringContaining(`2. ${list[1].message} | ${list[1].event}\n`))
            expect(formatted).toEqual(expect.stringContaining(`3. ${list[2].message} | ${list[2].event}\n`))
        })
    })
})