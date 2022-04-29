class DataVersion2 {
	version: number;
	first: boolean;
	lastReset: number;
	lastChange: number;
	firstChange: number;
	text: string;
	target: string
	targetIndex: number;
	errCount: number;
	attemptID: string;
	sessionName: string;
	strokes: Array<Stroke>;
}

class Stroke {
	received: number;
	add: string;
	rm: number;

	constructor(received: Date, add: string, rm: string) {
		received = received;
		add = add;
		rm = rm;
	}
}

export { DataVersion2, Stroke };
