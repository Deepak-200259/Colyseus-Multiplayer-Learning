import { Room } from "@colyseus/core";
import { PlayerInfo } from "./schema/MyRoomState.js";

export class MyRoom extends Room {
	maxClients = 4;

	onCreate(options) {
		const playerInfo = new PlayerInfo();
		this.setState(playerInfo);
		console.log(playerInfo);

		this.onMessage("roomJoin", (client, message) => {
			console.log(client, "has Joined: ", message);

			this.broadcast("roomJoinByPlayer", { client, message }); // send to all clients but sender
		});

		this.setSimulationInterval((delta) => this.update(delta));
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

	update(deltaTime) {}
}
