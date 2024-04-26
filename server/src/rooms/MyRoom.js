import { Room } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState.js";

export class MyRoom extends Room {
	maxClients = 4;

	onCreate(options) {
		this.setState(new MyRoomState());

		this.onMessage("roomJoin", (client, message) => {
			console.log(client, "has Joined: ", message);

			this.broadcast("roomJoinByPlayer", { client, message }); // send to all clients but sender
		});
	}

	onJoin(client, options) {
		console.log(client.sessionId, "joined!");
	}

	onLeave(client, consented) {
		console.log(client.sessionId, "left!");
	}

	onDispose() {
		console.log("room", this.roomId, "disposing...");
	}
}
