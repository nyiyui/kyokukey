class Session {
	prefix: string;

	constructor(prefix: string) {
		this.prefix = prefix;
	}
}

const sessions = new Map<string, Session>();
sessions.set('2022-04-10', new Session('2022-04-10'));

export { Session, sessions };
