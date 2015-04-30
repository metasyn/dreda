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
var groupedSize;

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
  controls = new THREE.OrbitControls(camera, renderer.domElement);
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

  
////////
////////
// DATA PROCESSING
///////
///////

function fetchData(){
  // get the data
  // although async: false generates a deprecated warning,
  // we need the data to finish fetching file before loading
  //
  // TODO: Add .when / use deferred 
  $.ajaxSetup({'async': false})
  $.getJSON('./data/dp_data.clean.json', function(json){
    data = json 
    }
  );
  console.log('Data Fetched');
}

function loadData(){

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
  console.log("Data Loaded");

  // zip and group
  var keys = Object.keys(data)
  var grouped = _.groupBy(organized, keys[3]) // group by color
  var groupedSize = _.size(grouped);
  
  for (var i=0; i<groupedSize; i++){

    console.log("group  " + i);
    // create new point cloud material
    var pointGeometry = new THREE.Geometry();
    pointColors = [];

    // loop through points
    for (var j=0; j < grouped[i].length; j++){

      var vertex = new THREE.Vector3();
      vertex.x = grouped[i][j][keys[0]]; 
      vertex.y = grouped[i][j][keys[1]]; 
      vertex.z = grouped[i][j][keys[2]];
      pointGeometry.vertices.push(vertex);
      // assign colors
      pointColors[j] = new THREE.Color(colors[i]);
    }
    
    console.log(grouped[i].length + " points in cluster " + i)
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
    console.log(_.size(grouped))
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
    potentialEdges.push(Math.abs(min), max);
  }
  return _.max(potentialEdges);
}

function rotateToggle(){
  controls.autoRotate = !controls.autoRotate
}
