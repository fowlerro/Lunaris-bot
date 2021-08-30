const { translate, localeList } = require("../utils/languages/languages");

// translate();
describe('translate() function', () => {
    it("Tłumaczenie tekstu", () => {
        let translation = translate('en', 'general.reason');
        expect(translation).toBe('Reason');
        translation = translate('pl', 'general.reason');
        expect(translation).toBe('Powód');
    });
    
    it("Tłumaczenie z niepoprawnym językiem", () => {
        let translation = translate('fr', 'general.reason');
        expect(translation).toBe('Reason');
    });
    
    it("Tłumaczenie brakującego tekstu", () => {
        let translation = translate('en', 'permissions.ADMINISTRATOR');
        expect(translation).toBe('Administrator');
        translation = translate('pl', 'permissions.ADMINISTRATOR');
        expect(translation).toBe('Administrator');
    });
    
    it("Tłumaczenie ze zmiennymi", () => {
        let translation = translate('en', 'cmd.prefixMessage');
        expect(translation).toBe('The prefix is set to: %VAR%');
        translation = translate('en', 'cmd.prefixMessage', '!');
        expect(translation).toBe('The prefix is set to: !');
    });
});


// localeList();
describe('localeList() function', () => {
    it("Zawiera en oraz pl", () => {
        let list = localeList();
        expect(list).toEqual(expect.arrayContaining(['en', 'pl']));
    });
});