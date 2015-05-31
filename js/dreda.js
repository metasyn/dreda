/*
 * DREDA
 *
 */

// globals
var scene, camera, renderer, controls, stats;
var canvas = document.getElementById('data-canvas')

// custom globals for data
var data;
var organized = [];
var grouped;
var groupedSize;
var groupedKeys;

// color options (rainbow husl, 30 shades)
colors = _.shuffle( 
['#f79987',
 '#f7818a',
 '#f85d8c',
 '#ed3694',
 '#da369d',
 '#cb36a4',
 '#bc36aa',
 '#ac36af',
 '#9a36b3',
 '#8136b9',
 '#5735bf',
 '#3764c0',
 '#3884be',
 '#3997bd',
 '#3aa6bc',
 '#3ab1bb',
 '#3bbcba',
 '#3cc8b8',
 '#3dd5b7',
 '#3ee6b4',
 '#59f6af',
 '#86f5a8',
 '#a3f5a0',
 '#bbf598',
 '#d2f58e',
 '#eaf580',
 '#f6e67b',
 '#f6d27f',
 '#f6bf82',
 '#f7ae85']);

// ratios
var edge                    = 500;
var pointToEdgeRatio        = .05;
var edgePaddingMultiplier   = 1.3;
var lineToEdgeRatio         = .002;
var lineGapToEdgeRatio      = .002;
var lineDashToEdgeRatio     = .006;

// camera ratios
var cameraYToEdgeRatio      = 1.1;
var cameraZToEdgeRatio      = 1.1;
var cameraXToEdgeRatio      = -1.1;

// calls
init();
animate();

////////////////
// functions //
////////////// 

function init(){

  // get canvas
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  // create a new scene
  scene = new THREE.Scene();

  // add a camera
  var VIEW_ANGLE = 45;
  var ASPECT = canvas.clientWidth / canvas.clientHeight;
  var NEAR = 0.1;
  var FAR = edge * 20;
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);

  // inital camera position is relativized to the overall scale
  camera.position.set(
    edge * cameraXToEdgeRatio,
    edge * cameraYToEdgeRatio, 
    edge * cameraZToEdgeRatio);
  camera.lookAt(scene.position);

  // create the renderer
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, canvas: canvas});
  renderer.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight)  
  renderer.setClearColor( 0x1A1A1A, 1);

  // attach to container
  //document.getElementById('viz').appendChild(renderer.domElement);

  // controls
  controls = new THREE.OrbitControls(camera, document, renderer.domElement);
  controls.autoRotate = true;

  // stats
  // TODO: Add Stats

  // add lights
  var light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(100,300,100);
  scene.add(light);

  // add grid
  var gridxz = new THREE.GridHelper(edge,edge*.1);          //size, step
  gridxz.setColors(
    new THREE.Color(0x323232),                              //chill green
    new THREE.Color(0x323232)
  );
  gridxz.position.set(0,0,0);
  scene.add(gridxz);

  // add x axis line
  var lineGeometry = new THREE.Geometry();
  var vertArray = lineGeometry.vertices;
  vertArray.push( new THREE.Vector3(-edge, 0, 0), new THREE.Vector3(edge, 0, 0) );
  lineGeometry.computeLineDistances();
  var lineMaterial = new THREE.LineDashedMaterial( { color: 0xf68870, lineWidth: edge*lineToEdgeRatio, gapSize: lineGapToEdgeRatio, dashSize: lineDashToEdgeRatio} );
  var line = new THREE.Line( lineGeometry, lineMaterial );
  scene.add(line);

  // add y axis line
  var lineGeometry = new THREE.Geometry();
  var vertArray = lineGeometry.vertices;
  vertArray.push( new THREE.Vector3(0, -edge, 0), new THREE.Vector3(0, edge, 0) );
  lineGeometry.computeLineDistances();
  var lineMaterial = new THREE.LineDashedMaterial( { color: 0x325cb1, lineWidth: edge*lineToEdgeRatio, gapSize: lineGapToEdgeRatio, dashSize: lineDashToEdgeRatio} );
  var line = new THREE.Line( lineGeometry, lineMaterial );
  scene.add(line);

  // add z axis line
  var lineGeometry = new THREE.Geometry();
  var vertArray = lineGeometry.vertices;
  vertArray.push( new THREE.Vector3(0, 0, -edge), new THREE.Vector3(0, 0, edge) );
  lineGeometry.computeLineDistances();
  var lineMaterial = new THREE.LineDashedMaterial( { color: 0x3beca3, lineWidth: edge*lineToEdgeRatio, gapSize: lineGapToEdgeRatio, dashSize: lineDashToEdgeRatio} );
  var line = new THREE.Line( lineGeometry, lineMaterial );
  scene.add(line);

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

window.addEventListener('resize', function () {
canvas.width  = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  renderer.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight);
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
});


function rotateToggle(){
  controls.autoRotate = !controls.autoRotate
}

function resetCamera(){
  camera.position.set(
    edge * cameraXToEdgeRatio,
    edge * cameraYToEdgeRatio, 
    edge * cameraZToEdgeRatio);
  camera.lookAt(scene.position);
}
  
////////
////////
// DATA PROCESSING
///////
///////

function fetchData(f){
  // get the data
  // although async: false generates a deprecated warning,
  // we need the data to finish fetching file before loading
  //
  // TODO: Add .when / use deferred

    $.ajaxSetup({'async': false})
    $.getJSON('./data/' + f + '.json', function(json){
      data = json 
      }
    );
    console.log('Data Fetched');
}

function loadData(){

  // clear container
  organized = [];

  dataLength =  _.size(_.values(data)[0]);

  for (var i=0; i < dataLength; i++){
    point = {};
    for (p in data){
      if (data.hasOwnProperty(p)){
        point[p] = data[p][i]
      }
    }
    organized.push(point);
  }
}

function plotData(){

  // get those points
  loadData();

  // resize edge based on max min & reinitialize planes
  edge = getLimits() * edgePaddingMultiplier
  init();

  var sprite = THREE.ImageUtils.loadTexture( "./data/disc.png" );
  console.log("Initalized");

  // zip and group
  var keys = Object.keys(data)
  grouped = _.groupBy(organized, keys[3]) // group by color
  groupedSize = _.size(grouped);
  groupedKeys = Object.keys(grouped)
  
  for (var i=0; i<groupedSize; i++){

    // create new point cloud material
    var pointGeometry = new THREE.Geometry();
    pointColors = [];

    // loop through points
    for (var j=0; j < grouped[groupedKeys[i]].length; j++){

      var vertex = new THREE.Vector3();
      vertex.x = grouped[groupedKeys[i]][j][keys[0]];
      vertex.y = grouped[groupedKeys[i]][j][keys[1]]; 
      vertex.z = grouped[groupedKeys[i]][j][keys[2]];
      pointGeometry.vertices.push(vertex);
      // assign colors
      pointColors[j] = new THREE.Color(colors[i]);
    }
    

    console.log(grouped[groupedKeys[i]].length + " points in cluster " + groupedKeys[i])
    pointGeometry.colors = pointColors

    // create new point cloud
    var pointCloudMaterial= new THREE.PointCloudMaterial({
        size: edge*pointToEdgeRatio, 
        color: colors[i], 
        vertexColors: THREE.VertexColors, 
        alphaTest: 0.5, 
        transparent: true,
        opacity: 0.8, 
        map: sprite});

    // Use this to change the entire material 
    //pointCloudMaterial.color.setHSL( 3.0, 0.8, 0.8 );

    var pointCloud= new THREE.PointCloud(pointGeometry, pointCloudMaterial)
    scene.add(pointCloud)
    console.log(colors[i])
  }
  return true
}

function getLimits(){
  // container for potential x-z grid size
  potentialEdges = [];
  for (col in data){
    // http://stackoverflow.com/questions/11142884
    var min = _.min(data[col]);
    var max = _.max(data[col]);
    if (isFinite(min) && isFinite(max)) {
    potentialEdges.push(Math.abs(min), max);
    }
  }
  return _.max(potentialEdges);
}


