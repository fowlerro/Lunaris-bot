import TextFormatter from '../../utils/Formatter'

describe('TextFormatter function', () => {
    test('without variables', () => {
        const format = "Welcome {{username}}"
        const formatted = TextFormatter(format, {})
        expect(formatted).toBe(format)
    })

    test('format without formatting', () => {
        const format = "Welcome username"
        const formatted = TextFormatter(format, {})
        expect(formatted).toBe(format)
    })
    
    test('format with valid formatting', () => {
        const format = "Welcome {{username}}, {{nickname}}"
        const variables = {
            member: {
                nickname: 'Pseudonim',
                user: {
                    username: 'Name'
                }
            }
        }
        const formatted = TextFormatter(format, variables)
        expect(formatted).toBe("Welcome Name, Pseudonim")
    })

    test('format with missing variable', () => {
        const format = "Welcome {{username}}, {{nickname}}"
        const variables = {
            member: {
                nickname: 'Pseudonim',
                user: {}
            }
        }
        const formatted = TextFormatter(format, variables)
        expect(formatted).toBe("Welcome {{username}}, Pseudonim")
    })
    
    test('format with additional brackets and missing variable', () => {
        const format = "Welcome {{nickname}}}, {{{nickname}}}, {{{username}}}"
        const variables = {
            member: {
                nickname: 'Pseudonim',
                user: {}
            }
        }
        const formatted = TextFormatter(format, variables)
        expect(formatted).toBe("Welcome Pseudonim}, {Pseudonim}, {{{username}}}")
    })
   
    test('format with numeric variables', () => {
        const format = "Welcome {{username}}, {{nickname}}"
        const variables = {
            member: {
                nickname: 'Pseudonim',
                user: {
                    username: 2
                }
            }
        }
        const formatted = TextFormatter(format, variables)
        expect(formatted).toBe("Welcome 2, Pseudonim")
    })
    
    test('format with array/object variables', () => {
        
        const format = "Welcome {{username}}, {{nickname}}"
        const variables = {
            member: {
                nickname: { nickname: 'Pseudonim' },
                user: {
                    username: ['user', 'name']
                }
            }
        }
        const formatted = TextFormatter(format, variables)
        expect(formatted).toBe("Welcome {{username}}, {{nickname}}")
    })
    
});
