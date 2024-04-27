import * as schema from "@colyseus/schema";

export class PlayerInfo extends schema.Schema {
	constructor() {
		super();
		this.players = new schema.MapSchema();
	}
}

export class PlayerPosition extends schema.Schema {
	client = "";
	x = null;
	y = null;
	z = null;

	constructor() {
		super();
		this.x = 0;
		this.y = 0;
		this.z = 0;
	}
}

export class PlayerRotation extends schema.Schema {
	client = "";
	x = null;
	y = null;
	z = null;

	constructor() {
		super();
		this.x = 0;
		this.y = 0;
		this.z = 0;
	}
}

class PlayerState extends schema.Schema {
	client = ""; // Client
	"position-x" = null;
	"position-y" = null;
	"position-z" = null;
	"rotation-x" = null;
	"rotation-y" = null;
	"rotation-z" = null;

	constructor() {
		super();
		this["position-x"] = Math.random() * 20 - 10; // Random Value between -10 and 10
		this["position-y"] = 0;
		this["position-z"] = Math.random() * 10 - 5; // Random Value between -5 and 5

		this["rotation-x"] = 0;
		this["rotation-y"] = Math.random() * Math.PI; // Random Value between 0 and Pi.
		this["rotation-z"] = 0;
	}
}

schema.defineTypes(PlayerInfo, {
	players: { map: PlayerState },
});

schema.defineTypes(PlayerPosition, {
	client: "string",
	x: "float32",
	y: "float32",
	z: "float32",
});

schema.defineTypes(PlayerRotation, {
	client: "string",
	x: "float32",
	y: "float32",
	z: "float32",
});

schema.defineTypes(PlayerState, {
	client: "string",
	"position-x": "float32",
	"position-y": "float32",
	"position-z": "float32",
	"rotation-x": "float32",
	"rotation-y": "float32",
	"rotation-z": "float32",
});
