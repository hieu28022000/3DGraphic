import * as THREE from './js/three.module.js';
import { OrbitControls } from './js/OrbitControls.js';
import { TransformControls } from './js/TransformControls.js';
import { TeapotBufferGeometry } from './js/TeapotBufferGeometry.js';
import { GLTFLoader } from './js/GLTFloader.js';

// Environment
var camera, scene, renderer, control, orbit;
var mesh, texture;
var raycaster, light, PointLightHelper, meshplan;
var type_material = 3;
var material = new THREE.MeshBasicMaterial({ color: 0xC0C0C0 });
material.needsUpdate = true;
var mouse = new THREE.Vector2();
scene = new THREE.Scene();
scene.background = new THREE.Color(0x26456B);
var size = 300;
var divisions = 50;
var gridHelper = new THREE.GridHelper(size, divisions, 0xFFFFFF);
scene.add(gridHelper);

// Camera
camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 1, 1000);
camera.position.set(50, 100, 180);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// Geometry
var BoxGeometry = new THREE.BoxGeometry(40, 40, 40, 50, 50, 50);
var SphereGeometry = new THREE.SphereGeometry(25, 50, 50);
var ConeGeometry = new THREE.ConeGeometry(15, 55, 50, 50);
var CylinderGeometry = new THREE.CylinderGeometry(15, 15, 55, 50, 50);
var TorusGeometry = new THREE.TorusGeometry(25, 5, 50, 50);
var TeapotGeometry = new TeapotBufferGeometry(20, 50);
var DodecahedronGeometry = new THREE.DodecahedronBufferGeometry(25);
var IcosahedronGeometry = new THREE.IcosahedronBufferGeometry(25);
var OctahedronGeometry =  new THREE.OctahedronBufferGeometry(35);
var TetrahedronGeometry = new THREE.TetrahedronBufferGeometry(35);
window.RenderGeo = RenderGeo;

// Surface
window.SetMaterial = SetMaterial
window.SetTexture = SetTexture;

// Light
window.SetPointLight = SetPointLight;
window.RemoveLight = RemoveLight;

// Animation
var mesh = new THREE.Mesh();
var spinx, spiny, leftright, updown, around;
window.Spin_X = Spin_X;
window.RemoveSpin_X = RemoveSpin_X;
window.Spin_Y = Spin_Y;
window.RemoveSpin_Y = RemoveSpin_Y;
const position_x = mesh.position.x;
var kt1 = 0;
window.Left_Right = Left_Right;
window.RemoveLeft_Right = RemoveLeft_Right;
const position_y = mesh.position.y;
var kt2 = 0;
window.Up_Down = Up_Down;
window.RemoveUp_Down = RemoveUp_Down;
window.RemoveAllAnimation = RemoveAllAnimation;

// Model
const loader = new GLTFLoader();
window.Load_model = Load_model;

// Impact
window.Translate = Translate;
window.Rotate = Rotate;
window.Scale = Scale;

// Contrrol
window.setFOV = setFOV;
window.setFar = setFar;
window.setNear = setNear;

// Renderer
raycaster = new THREE.Raycaster();
renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize( window.innerWidth, window.innerHeight )
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById("rendering").addEventListener('mousedown', onMouseDown, false);
document.getElementById("rendering").appendChild(renderer.domElement);
window.addEventListener('resize', () => {
	var width = window.innerWidth
	var height = window.innerHeight
	renderer.setSize(width, height)
	camera.aspect = width / height
	camera.updateProjectionMatrix()
	render()
})
orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();
orbit.addEventListener('change', render);
control = new TransformControls(camera, renderer.domElement);
console.log(control)
control.addEventListener('change', render);
control.addEventListener('dragging-changed', function (event) {
	orbit.enabled = !event.value;
});
render();

///// Function

// Renderer
function render() {
	renderer.render(scene, camera);
}
////////////////////

// Geometry
function RenderGeo(id) {
	mesh = scene.getObjectByName("mesh1");
	scene.remove(mesh);
	switch (id) {
		case 1:
			mesh = new THREE.Mesh(BoxGeometry, material);
			break;
		case 2:
			mesh = new THREE.Mesh(SphereGeometry, material);
			break;
		case 3:
			mesh = new THREE.Mesh(ConeGeometry, material);
			break;
		case 4:
			mesh = new THREE.Mesh(CylinderGeometry, material);
			break;
		case 5:
			mesh = new THREE.Mesh(TorusGeometry, material);
			break;
		case 6:
			mesh = new THREE.Mesh(TeapotGeometry, material);
			break;
		case 7:
			mesh = new THREE.Mesh(IcosahedronGeometry, material);
			break;
		case 8:
			mesh = new THREE.Mesh(DodecahedronGeometry, material);
			break;
		case 9:
			mesh = new THREE.Mesh(OctahedronGeometry, material);
			break;
		case 10:
			mesh = new THREE.Mesh(TetrahedronGeometry, material);
			break;
	}
    mesh.name = "mesh1";
    mesh.castShadow = true;
	mesh.receiveShadow = true;
	scene.add(mesh);
	control_transform(mesh);
	render();
}
////////////////////

// Surface
function SetMaterial(mat) {
	function CloneMesh(dummy_mesh) {
		mesh.name = dummy_mesh.name;
		mesh.position.set(dummy_mesh.position.x, dummy_mesh.position.y, dummy_mesh.position.z);
		mesh.rotation.set(dummy_mesh.rotation.x, dummy_mesh.rotation.y, dummy_mesh.rotation.z);
		mesh.scale.set(dummy_mesh.scale.x, dummy_mesh.scale.y, dummy_mesh.scale.z);
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		scene.add(mesh);
		control_transform(mesh);
	}

	mesh = scene.getObjectByName("mesh1");
	light = scene.getObjectByName("pl1");
	type_material = mat;
	if (mesh) {
		const dummy_mesh = mesh.clone();
		scene.remove(mesh);

		switch (type_material) {
			case 1:
				material = new THREE.PointsMaterial({ color: 0x48D1CC, size: 0.5 });
				mesh = new THREE.Points(dummy_mesh.geometry, material);
				CloneMesh(dummy_mesh);
				break;
			case 2:
				material = new THREE.MeshBasicMaterial({ color: 0xFA8072, wireframe: true });
				mesh = new THREE.Mesh(dummy_mesh.geometry, material);
				CloneMesh(dummy_mesh);
				break;
			case 3:
				if (!light)
					material = new THREE.MeshBasicMaterial({ color: 0xC0C0C0 });
				else
					material = new THREE.MeshPhongMaterial({ color: 0xC0C0C0 });
				mesh = new THREE.Mesh(dummy_mesh.geometry, material);
				CloneMesh(dummy_mesh);
				break;
			case 4:
				if (!light)
					material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
				else
					material = new THREE.MeshLambertMaterial({ map: texture, transparent: true });
				mesh = new THREE.Mesh(dummy_mesh.geometry, material);
				CloneMesh(dummy_mesh);
				break;
		}
		render();
	}
}
function SetTexture(url) {
	mesh = scene.getObjectByName("mesh1");
	if (mesh) {
		texture = new THREE.TextureLoader().load(url, render);
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		SetMaterial(4);
	}
}
////////////////////

// Light
function SetPointLight() {
	light = scene.getObjectByName("pl1");

	if (!light) {
        {
            const planeSize = 400;
			const loader = new THREE.TextureLoader();
			const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
			const planeMat = new THREE.MeshPhongMaterial({side: THREE.DoubleSide,});
			meshplan = new THREE.Mesh(planeGeo, planeMat);
			meshplan.receiveShadow = true;
			meshplan.rotation.x = Math.PI * -.5;
			meshplan.position.y += 0.5;
            scene.add(meshplan);
        }
		const color = '#FFFFFF';
		const intensity = 2;
		light = new THREE.PointLight(color, intensity);
		light.castShadow = true;
		light.position.set(100, 50, 40);
		light.name = "pl1";
		scene.add(light);
		control_transform(light);
		if (type_material == 3 || type_material == 4) {
			SetMaterial(type_material);
		}
		PointLightHelper = new THREE.PointLightHelper(light);
		PointLightHelper.name = "plh1";
		scene.add(PointLightHelper);
		render();
	}
}
function RemoveLight() {

	scene.remove(light);
	scene.remove(PointLightHelper);
	scene.remove(meshplan);
	if (type_material == 3 || type_material == 4) {
		SetMaterial(type_material);
	}
	render();
}
function onMouseDown(event) {
	event.preventDefault();
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	// find intersections
	raycaster.setFromCamera(mouse, camera);
	var intersects = raycaster.intersectObjects(scene.children);
	let check_obj = 0;
	if (intersects.length > 0) {
		var obj;
		for (obj in intersects) {
			if (intersects[obj].object.name == "mesh1") {
				check_obj = 1;
				control_transform(intersects[obj].object);
				break;
			}
			if (intersects[obj].object.type == "PointLightHelper") {
				check_obj = 1;
				control_transform(light);
				break;
			}
		}
	}
	if (check_obj == 0 && control.dragging == 0) control.detach();
	render();
}
////////////////////

// Animation
function Spin_X() {
	cancelAnimationFrame(spinx);
	mesh.rotation.x += 0.01;
	render();
	spinx = requestAnimationFrame(Spin_X);
}
function RemoveSpin_X() {
	cancelAnimationFrame(spinx);
}
function Spin_Y() {
	cancelAnimationFrame(spiny);
	mesh.rotation.y += 0.01;
	render();
	spiny = requestAnimationFrame(Spin_Y);
}
function RemoveSpin_Y() {
	cancelAnimationFrame(spiny);
}
function Left_Right() {	
	cancelAnimationFrame(leftright);
	var positionx = mesh.position.x;
	if (positionx < position_x + 30 && kt1 == 0) 
	{ 
		mesh.position.x += 0.3;
	}
	if (positionx > position_x + 30) kt1 += 1;
	if (kt1 > 1 && positionx > position_x) 
	{ 
		mesh.position.x -= 0.3;
	}
	if (positionx < position_x) kt1 = 0;
	render();
	leftright = requestAnimationFrame(Left_Right);
}
function RemoveLeft_Right() {
	cancelAnimationFrame(leftright);
}
function Up_Down() {
	cancelAnimationFrame(updown);
	var positiony = mesh.position.y;
	if (positiony < position_y + 30 && kt2 == 0) 
	{ 
		mesh.position.y += 0.3;
	}
	if (positiony > position_y + 30) kt2 += 1;
	if (kt2 > 1 && positiony > position_y) 
	{ 
		mesh.position.y -= 0.3;
	}
	if (positiony < position_y) kt2 = 0;
	render();
	updown = requestAnimationFrame(Up_Down);
}
function RemoveUp_Down() {
	cancelAnimationFrame(updown);
}
function RemoveAllAnimation() {
	cancelAnimationFrame(spinx);
	cancelAnimationFrame(spiny);
	cancelAnimationFrame(leftright);
	cancelAnimationFrame(updown);
	mesh.rotation.set(0, 0, 0);
	render();
}
////////////////////

// Model
function Load_model(id) {
	// model_name = getObjectByName('model')
	// scene.remove(model_name);
	switch (id) {
		case 1:
			var model_path = 'models/car/scene.gltf'
			break;
		case 2:
			var model_path = 'models/body/scene.gltf'
			break; 
	}
	loader.load(
		model_path,
		function ( gltf ) {
			scene.add( gltf.scene );

			gltf.scene.scale.set(35,35,35)
			const box = new THREE.Box3().setFromObject( gltf.scene );
			const center = box.getCenter( new THREE.Vector3() );
			gltf.scene.position.x += ( gltf.scene.position.x - center.x );
			gltf.scene.position.y += ( gltf.scene.position.y - center.y );
			gltf.scene.position.y += 9
			gltf.scene.position.z += ( gltf.scene.position.z - center.z );
			
			gltf.animations;
			gltf.scene; 
			gltf.scenes;
			gltf.cameras;
			gltf.asset;
	});
}
////////////////////

// Impact
function Translate() {
	control.setMode("translate");
}
function Rotate() {
	control.setMode("rotate");
}
function Scale() {
	control.setMode("scale");
}
////////////////////

// Control
function setFOV(value) {
	camera.fov = Number(value);
	camera.updateProjectionMatrix();
	render();
}
function setFar(value) {
	camera.far = Number(value);
	camera.updateProjectionMatrix();
	render();
}
function setNear(value) {
	camera.near = Number(value);
	camera.updateProjectionMatrix();
	render();
}
////////////////////



function control_transform(mesh) {
	control.attach(mesh);
	scene.add(control);
	console.log(control);
	window.addEventListener('keydown', function (event) {
		switch (event.keyCode) {
			case 84: // T
				Translate(); break;
			case 82: // R
				Rotate(); break;
			case 83: // S
				Scale(); break;
			case 88: // X
				control.showX = !control.showX; break;
			case 89: // Y
				control.showY = !control.showY; break;
			case 90: // Z
				control.showZ = !control.showZ; break;
			case 76: // L
				SetPointLight(); break;
			case 32: // spacebar
				RemoveLight(); break;
		}
	});
}