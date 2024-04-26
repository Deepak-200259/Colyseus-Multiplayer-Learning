import * as Colyseus from "colyseus.js"; // not necessary if included via <script> tag.
import Experience from "./Experience/Experience.js";
import * as THREE from "three";
var client = new Colyseus.Client("http://localhost:2567/");

const experience = new Experience(document.querySelector("canvas.webgl"));

const btn = document.getElementsByClassName("create-room");

btn[0].addEventListener("click", async (e) => {
	e.preventDefault();
	document.getElementById("webgl").style.zIndex = 10;
	// const playerName = document.getElementById("player-name").value;
	// const roomName = document.getElementById("room-name").value;
	experience.networkManager.createOrJoin("my_room", e);
	// const room = await client.join(roomName);

	// const canvas = document.createElement("canvas");
	// canvas.className = "webgl";
	// document.body.appendChild(canvas);
	// const scene = new THREE.Scene();

	// room.send("roomJoin", { player: playerName });

	// room.onMessage("roomJoinByPlayer", (data) => {
	// 	experience.world.addPlayer(data.message.player);
	// });
	// .then((room) => {
	// 	const canvas = document.createElement("canvas");
	// 	canvas.className = "webgl";
	// 	document.body.appendChild(canvas);
	// 	const experience = new Experience(
	// 		document.querySelector("canvas.webgl"),
	// 		room,
	// 	);
	// 	console.log(experience);
	// 	room.send("roomJoin", { player: playerName });
	// })
	// .catch((e) => {
	// 	console.log("JOIN ERROR", e);
	// });
});
