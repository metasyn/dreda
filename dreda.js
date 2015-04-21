/*
 * DREDA
 * 
 * Lots of help from stemkoski.github.io
 */

// globals
var container, scene, camera, renderer, controls, stats;

// custom globals
var mesh;

init();
animate();

////////////////
// functions //
////////////// 

function init()
{

  // create a new scene
  scene = new THREE.Scene();
  
  // add a camera
  var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.inner_height;
  var VIEW_ANGLE = 45;
  var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
  var NEAR = 0.1;
  var FAR = 20000;
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(0,150,400);
  camera.lookAt(scene.position);

  // create the renderer
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  
  // attach to container
  container = document.getElementById('main');
  container.appendChild(renderer.domElement);
 
  // events
  THREEx.WindowResize(renderer, camera);
  //THREEx.FullScreen.bindKey({ charCode: 'm'.charCodeAt(0) });
  // I don't think we need this ?

  // controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  // stats
  // TODO: Add Stats

  // add lights
  var light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(100,300,100);
  scene.add(light);

  // add grid
  var gridxz = new THREE.GridHelper(100,10);
  gridxz.setColors(new THREE.Color(0x006600), new THREE.Color(0x006600));
  gridxz.position.set(100,0,100);
  scene.add(gridxz);
}

function animate(){
  requestAnimationFrame(animate);
  render();
  update();
}

function update(){
  controls.update();
  // stats.update();
}

function render(){
  renderer.render(scene,camera);
}
