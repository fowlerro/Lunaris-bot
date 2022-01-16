import { formatWelcomeMessageList } from "../../commands/Settings/WelcomeMessage/list"
import { translate } from "../../utils/languages/languages"

describe('Welcome Message Module', () => {
    
    describe("FormatWelcomeMessageList in 'welcome list' command", () => {
        it('Empty list', () => {
            const list: string[] = []
            const language = "en"

            const formatted = formatWelcomeMessageList(list, language)
            expect(formatted).toBe(translate(language, 'cmd.welcome.listEmpty'))
        })

        it('Should format list', () => {
            const list: string[] = ["Welcome {{username}}", "Hi {{username}}", "Hello {{username}}"]
            const language = "en"

            const formatted = formatWelcomeMessageList(list, language)
            expect(formatted).toEqual(expect.stringContaining(`1. ${list[0]}\n`))
            expect(formatted).toEqual(expect.stringContaining(`2. ${list[1]}\n`))
            expect(formatted).toEqual(expect.stringContaining(`3. ${list[2]}\n`))
        })
    })
})