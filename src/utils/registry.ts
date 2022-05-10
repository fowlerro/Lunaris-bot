import path from 'path';
import fs from 'fs/promises';

import BaseEvent from './structures/BaseEvent';
import BaseModule from './structures/BaseModule';
import * as clientConfig from '../database/config.json';

export async function registerEvents(dir = '') {
	const filePath = path.join(__dirname, dir);
	const files = await fs.readdir(filePath);
	for (const file of files) {
		const stat = await fs.lstat(path.join(filePath, file));
		if (stat.isDirectory()) registerEvents(path.join(dir, file));
		if (process.env.NODE_ENV === 'production' ? file.endsWith('.js') : file.endsWith('.ts')) {
			const { default: Event } = await import(path.join(dir, file));
			if (Event.prototype instanceof BaseEvent) {
				const event = new Event();
				client.events.set(event.getName(), event);
				client.on(event.getName(), event.run.bind(event));
			}
		}
	}
}

export async function registerModules(dir = '') {
	const filePath = path.join(__dirname, dir);
	const files = await fs.readdir(filePath);
	for (const file of files) {
		const stat = await fs.lstat(path.join(filePath, file));
		if (stat.isDirectory()) registerModules(path.join(dir, file));
		if (file === (process.env.NODE_ENV === 'production' ? 'index.js' : 'index.ts')) {
			const { default: Module } = await import(path.join(filePath, file));
			if (Module instanceof BaseModule) Module.run();
		}
	}
}

export function registerPresence() {
	client.user?.setPresence({
		status: (clientConfig.presence.status as any) || 'online',
		activities: [
			{
				name: clientConfig.presence.activity.name || '',
				type: (clientConfig.presence.activity.type as any) || 'PLAYING',
			},
		],
	});
}
