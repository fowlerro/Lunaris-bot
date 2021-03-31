const { convertPerms, mapToObject, daysInMonth, msToTime } = require("../utils/utils");


// convertPerms
test("Konwertowanie permisji z bitów na nazwy", () => {
    const permisje = convertPerms('flags', 8256);
    expect(permisje).toEqual(["ADD_REACTIONS", "MANAGE_MESSAGES"]);
    const permisje2 = convertPerms('flags', 67141888);
    expect(permisje2).toEqual(["PRIORITY_SPEAKER", "ATTACH_FILES", "CHANGE_NICKNAME"]);
});


// mapToObject
test("Konwertowanie obiektu Map na zwykły obiekt", () => {
    const map = new Map();
    map.set("Dwa", 2)
    map.set("obj", {Trzy: 3, 4: "Cztery"})
    const obj = mapToObject(map);
    expect(obj).toMatchObject({Dwa: 2, obj: {Trzy: 3, 4: "Cztery"}});
});

test("Sprawdzanie czy mapToObject zwraca obiekt", () => {
    const map = new Map();
    map.set("Dwa", 2)
    map.set("obj", {Trzy: 3, 4: "Cztery"})
    const obj = mapToObject(map);
    expect(typeof obj).toBe('object');
});

// daysInMonth
test("Sprawdzanie dni w miesiącu", () => {
    const dniLutego = daysInMonth(2, 2021);
    expect(dniLutego).toBe(28);
    const dniMarca = daysInMonth(3, 2021);
    expect(dniMarca).toBe(31);
});

// setGuildConfig

// msToTime
test("Konwertowanie milisekund na sformatowany tekst czasu", () => {
    const time = msToTime(44100000);
    expect(time).toBe("12h 15m");
    const time2 = msToTime(216930000);
    expect(time2).toBe("2d 12h 15m 30s");
})