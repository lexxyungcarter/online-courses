import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	if (locals.user) {
		return {
			user: locals.user,
			accessToken: cookies.get('session')
		};
	}
};
