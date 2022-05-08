import { ClientUser } from 'discord.js';
import DiscordClient from '../../typings/client';
import {
	assignNestedObjects,
	capitalize,
	convertLargeNumbers,
	setActivity,
	getCommandCategories,
	getLocale,
} from '../../utils/utils';

describe('Capitalize function', () => {
	it('should return empty string', () => {
		const capitalized = capitalize('');
		expect(capitalized).toBe('');
	});

	it('should return capitalized string', () => {
		const capitalized = capitalize('hello');
		expect(capitalized).toBe('Hello');
	});

	it('should return string with number', () => {
		const capitalized = capitalize('0hello');
		expect(capitalized).toBe('0hello');
	});

	it('should return string with whitespaces', () => {
		const capitalized = capitalize('  world ');
		expect(capitalized).toBe('  world ');
	});

	it('should return passed value when not string', () => {
		const capitalized = capitalize(12 as any);
		expect(capitalized).toBe(12);
	});
});

describe('ConvertLargeNumbers function', () => {
	it('should return 2 millions', () => {
		const converted = convertLargeNumbers(2000000);
		expect(converted).toBe('2M');
	});

	it('should return 6 thousands', () => {
		const converted = convertLargeNumbers(6035);
		expect(converted).toBe('6K');
	});

	it('should return whole number', () => {
		const converted = convertLargeNumbers(256);
		expect(converted).toBe(256);
	});

	it('should round millions to 2 numbers after period', () => {
		const converted = convertLargeNumbers(5623000);
		expect(converted).toBe('5.62M');
	});

	it('should round thousands to 1 numbers after period', () => {
		const converted = convertLargeNumbers(7236);
		expect(converted).toBe('7.2K');
	});

	it('should round floor', () => {
		const converted = convertLargeNumbers(9999);
		expect(converted).toBe('9.9K');
	});
});

describe('assignNestedObjects function', () => {
	it('should assign string', () => {
		const object = {};
		const value = 'Kamil';
		assignNestedObjects(object, ['username'], value);
		expect(object).toHaveProperty('username', [value]);
	});

	it('should assign nested path to empty object', () => {
		const object = {} as any;
		const id = '12345';
		assignNestedObjects(object, ['member', 'guild', 'id'], id);
		expect(object).toHaveProperty('member', { guild: { id: [id] } });
		expect(object.member.guild.id).toEqual(expect.arrayContaining([id]));
	});

	it('should add to array as first element', () => {
		const object = {
			guild: {
				members: ['1', '2'],
			},
		};
		const value = '3';
		assignNestedObjects(object, ['guild', 'members'], value);
		expect(object).toHaveProperty('guild', { members: ['3', '1', '2'] });
		expect(object.guild.members).toEqual(expect.arrayContaining(['3', '1', '2']));
	});

	it('should not modify object, if value already exist', () => {
		const object = {
			guild: {
				members: ['1', '2', '3'],
			},
		};
		const value = '3';
		assignNestedObjects(object, ['guild', 'members'], value);
		expect(object.guild.members).toStrictEqual(['1', '2', '3']);
	});
});

describe('setActivity function', () => {
	const clientUserMock = {
		setPresence: jest.fn(),
	} as unknown as ClientUser;

	global.client = new DiscordClient({ intents: [] });

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should set customActivity and call setPresence', () => {
		const activityType = 'PLAYING';
		const activity = 'chuj';
		global.client.user = clientUserMock;
		const spySetPresence = jest.spyOn(global.client.user, 'setPresence');
		setActivity(activityType, activity);
		expect(global.client.customActivity).toStrictEqual({ name: activity, type: activityType });
		expect(spySetPresence).toHaveBeenCalledTimes(1);
	});

	it('should set without activity', () => {
		const activityType = 'LISTENING';
		global.client.user = clientUserMock;
		const spySetPresence = jest.spyOn(global.client.user, 'setPresence');
		setActivity(activityType);
		expect(global.client.customActivity).toStrictEqual({ name: undefined, type: activityType });
		expect(spySetPresence).toHaveBeenCalledTimes(1);
	});

	it('should do nothing without type', () => {
		global.client.user = clientUserMock;
		const spySetPresence = jest.spyOn(global.client.user, 'setPresence');
		setActivity(null as any);
		expect(spySetPresence).not.toHaveBeenCalled();
	});
});

describe('getCommandCategories function', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return', () => {
		const categories = getCommandCategories();
		expect(categories).toEqual(expect.arrayContaining(['Modules', 'Help', 'Moderation', 'Settings']));
	});
});

describe('getLocale function', () => {
	it('should return pl locale', () => {
		const locale = 'pl';
		const res = getLocale(locale);
		expect(res).toBe(locale);
	});

	it('should return en locale', () => {
		const locale = 'en';
		const res = getLocale(locale);
		expect(res).toBe(locale);
	});

	it('should fallback to en locale if called with unsupported locale', () => {
		const locale = 'fr';
		const res = getLocale(locale);
		expect(res).toBe('en');
	});

	it('should fallback to en locale if called with null', () => {
		const locale = null;
		const res = getLocale(locale);
		expect(res).toBe('en');
	});
});
