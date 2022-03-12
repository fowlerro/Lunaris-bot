import axios from 'axios';
import { PartialUser } from 'discord.js';
import CryptoJS from 'crypto-js';
import { DISCORD_API_URL } from '../../utils/constants';
import { decrypt } from '../../utils/utils';

export async function getAuthService(encryptedAccessToken: string) {
	const decrypted = decrypt(encryptedAccessToken);
	const accessToken = decrypted.toString(CryptoJS.enc.Utf8);
	return axios.get<PartialUser>(`${DISCORD_API_URL}/users/@me`, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
}
