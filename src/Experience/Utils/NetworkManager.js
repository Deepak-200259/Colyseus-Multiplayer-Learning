import Experience from "../Experience";
import * as Colyseus from "colyseus.js";

export default class NetworkManager {
	constructor() {
		this.experience = new Experience();
		this.joinServer();
	}

	joinServer() {
		this.client = new Colyseus.Client("http://localhost:2567/");
	}

	createOrJoin = async (customRoomName = "my_room", e) => {
		const playerName = document.getElementById("player-name").value;
		const roomName = document.getElementById("room-name").value;
		e.preventDefault();
		const room = await this.client.join(
			customRoomName ? customRoomName : roomName,
		);
		console.log(room);
		room.send("roomJoin", { player: playerName });
		room.onMessage("roomJoinByPlayer", (data) => this.onMessage(data));
	};

	onMessage(data) {
		console.log(data);
		this.experience.world.addPlayer(data.message.player);
	}
}
