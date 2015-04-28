/*
 * DREDA
 *
 */

// globals
var scene, camera, renderer, controls, stats;
var canvas = document.getElementById('data-canvas')

// custom globals
var data;
var organized = [];

// colors (rainbow husl, 30 shades)
colors = _.shuffle( 
['#f68870',
'#f76773',
'#f33279',
'#db3188',
'#ca3191',
'#bb3197',
'#ad319c',
'#9e31a1',
'#8e31a5',
'#7731aa',
'#4f31b0',
'#325cb1',
'#337ab0',
'#348cae',
'#3499ad',
'#35a4ac',
'#36aeab',
'#37b9aa',
'#38c5a8',
'#39d4a6',
'#3beca3',
'#6ef49a',
'#94f491',
'#b1f486',
'#ccf479',
'#e7f466',
'#f4e35f',
'#f5cc65',
'#f5b769',
'#f6a26d']);

// analytics area size
var edge = 500;

// calls
init();
animate();

////////////////
// functions //
////////////// 

function init()
{

// get canvas
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

// create a new scene
scene = new THREE.Scene();

// add a camera
var VIEW_ANGLE = 45;
var ASPECT = canvas.clientWidth / canvas.clientHeight;
var NEAR = 0.1;
var FAR = 20000;
camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
scene.add(camera);
camera.position.set(0,150,400);
camera.lookAt(scene.position);

// create the renderer
renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, canvas: canvas});
renderer.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight)  
renderer.setClearColor( 0x1A1A1A, 1);

// attach to container
//document.getElementById('viz').appendChild(renderer.domElement);

// controls
controls = new THREE.OrbitControls(camera, renderer.domElement);

// stats
// TODO: Add Stats

// add lights
var light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(100,300,100);
scene.add(light);

// add grid
var gridxz = new THREE.GridHelper(edge,edge*.1);          //size, step
gridxz.setColors(
  new THREE.Color(0x006600),                              //chill green
  new THREE.Color(0x006600)
);
gridxz.position.set(0,0,0);
scene.add(gridxz);

// add y axis
var lineGeometry = new THREE.Geometry();
var vertArray = lineGeometry.vertices;
vertArray.push( new THREE.Vector3(0, -edge, 0), new THREE.Vector3(0, edge, 0) );
lineGeometry.computeLineDistances();
var lineMaterial = new THREE.LineDashedMaterial( { color: 0xffffff, dashSize: 1, gapSize: 3 } );
var line = new THREE.Line( lineGeometry, lineMaterial );
scene.add(line);

// get the data
$.getJSON('./data/sample_data.json', function(json){
  data = json 
  }
)
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

// resize - listener

canvas.addEventListener('resize', function () {
canvas.width  = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  renderer.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight);
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
});

  
////////
////////
// DATA PROCESSING
///////
///////

function loadData(){
  // Wow I love Underscore.js
  for (var i=0; i < _.size(_.values(data)[0]); i++){
    organized.push({x: data.x[i], y: data.y[i], z: data.z[i], cid: data.cid[i]})
  }
}


function plotData(){

  loadData();

  var sprite = THREE.ImageUtils.loadTexture( "./data/disc.png" );
  console.log("Data Loaded");

  // zip and group
  var grouped = _.groupBy(organized, 'cid') // cid = 3 now
  var groupedSize = _.size(grouped);
  
  for (var i=0; i<groupedSize; i++){

    console.log("group  " + i);
    // create new point cloud material
    var pointGeometry = new THREE.Geometry();
    pointColors = [];

    // loop through points
    for (var j=0; j < grouped[i].length; j++){

      // update console
      console.log(grouped[i].length + " points in cluster " + i)

      var vertex = new THREE.Vector3();
      vertex.x = grouped[i][j].x; 
      vertex.y = grouped[i][j].y; 
      vertex.z = grouped[i][j].z;
      pointGeometry.vertices.push(vertex);
      // assign colors
      pointColors[j] = new THREE.Color(colors[i]);
      //pointColors[j].setHSL( ( vertex.x + 1000 ) / 2000, 0.5, 0.5 );
    }
    
    pointGeometry.colors = pointColors

    // create new point cloud
    var pointCloudMaterial= new THREE.PointCloudMaterial({size: edge*.05, color: colors[i], vertexColors: THREE.VertexColors, alphaTest: 0.5, transparent: true, map: sprite});
    
    // Use this to change the entire material 
    //point_cloud_mesh.color.setHSL( 1.0, 0.2, 0.7 );

    var pointCloud= new THREE.PointCloud(pointGeometry, pointCloudMaterial)
    scene.add(pointCloud)
    console.log(_.size(grouped))
    console.log(colors[i])
  }
  return true
}

function plot(){
  setTimeout(function(){
    plotData();
  $('#loader').removeClass('ui active dimmer');
    
  }, 1000);
  $('#loader').addClass('ui active dimmer');
}