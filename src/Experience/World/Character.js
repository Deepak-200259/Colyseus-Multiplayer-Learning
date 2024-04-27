import Experience from "../Experience";
import * as THREE from "three";
import CharacterController from "./CharacterController";
import { getPhysicsBody } from "../Utils/physicsBodyHelper";
import { ShapeType } from "three-to-cannon";
// import CannonUtils from "../Utils/CannonUtils";
import * as Cannon from "cannon-es";
export default class Character {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;
		this.time = this.experience.time;
		this.debug = this.experience.debug;
		this.physicsWorld = this.experience.physicsWorld;

		// Debug
		if (this.debug.active) {
			this.debugFolder = this.debug.ui.addFolder("character");
		}

		// Resource
		this.resource = this.resources.items.character;

		this.keysPressed = {};
	}

	addPlayer() {
		this.setModel();
		this.registerKeys();
	}

	registerKeys() {
		document.addEventListener("keydown", (event) => {
			this.keysPressed[event.key.toLowerCase()] = true;
		});
		document.addEventListener("keyup", (event) => {
			this.keysPressed[event.key.toLowerCase()] = false;
		});
	}

	cloneGLTFHavingSkinnedMesh = (model) => {
		const clone = {
			animations: model.animations,
			scene: model.clone(true),
		};
		const skinnedMeshes = {};
		model.traverse((child) => {
			if (child.isSkinnedMesh) skinnedMeshes[child.name] = child;
		});
		const cloneBones = {};
		const cloneSkinnedMeshes = {};
		clone.scene.traverse((node) => {
			if (node.isBone) cloneBones[node.name] = node;
			if (node.isSkinnedMesh) cloneSkinnedMeshes[node.name] = node;
			node.castShadow = true;
		});

		for (let name in skinnedMeshes) {
			const skinnedMesh = skinnedMeshes[name];
			const skeleton = skinnedMesh.skeleton;
			const cloneSkinnedMesh = cloneSkinnedMeshes[name];
			const orderedCloneBones = [];
			for (const i of skeleton.bones) {
				const cloneBone = cloneBones[i.name];
				orderedCloneBones.push(cloneBone);
			}
			cloneSkinnedMesh.bind(
				new THREE.Skeleton(orderedCloneBones, skeleton.boneInverses),
				cloneSkinnedMesh.matrixWorld,
			);
		}
		return clone;
	};

	setModel(data) {
		this.model = this.cloneGLTFHavingSkinnedMesh(this.resource).scene;
		this.model.scale.set(1.5, 1.5, 1.5);
		this.scene.add(this.model);
		// this.addBodyForCharacter();

		this.model.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				child.castShadow = true;
			}
		});
		const animations = this.model.animations;
		this.model.animations = [];
		this.experience.characterAnimations.items.walk.animations[0].name = "walk";
		this.experience.characterAnimations.items.run.animations[0].name = "run";
		this.experience.characterAnimations.items.idle.animations[0].name = "idle";
		if (this.experience.characterAnimations) {
			this.model.animations.push(
				this.experience.characterAnimations.items.walk.animations[0],
			);
			this.model.animations.push(
				this.experience.characterAnimations.items.run.animations[0],
			);
			this.model.animations.push(
				this.experience.characterAnimations.items.idle.animations[0],
			);
		}
		this.modelAnimations = this.model.animations;
		this.animationMixer = new THREE.AnimationMixer(this.model);
		this.animationsMap = new Map();

		this.modelAnimations
			.filter((anim) => anim.name != "TPose")
			.forEach((anim) => {
				this.animationsMap.set(anim.name, this.animationMixer.clipAction(anim));
			});
		this.characterController = new CharacterController(
			this.model,
			this.animationMixer,
			this.animationsMap,
			this.experience.camera.controls,
			this.experience.camera.instance,
			"idle",
		);
	}

	addBodyForCharacter() {
		this.characterBody = getPhysicsBody(
			this.model,
			ShapeType.CYLINDER,
			new Cannon.Material("CharacterMaterial"),
			60,
		);
		this.characterBody.position.y = 100;
		this.physicsWorld.addBody(this.characterBody);
	}

	update() {
		if (this.characterController)
			this.characterController.update(
				this.experience.time.delta * 0.1,
				this.keysPressed,
			);
	}
}
