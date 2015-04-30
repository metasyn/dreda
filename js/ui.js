//// //// //// //// modals //// //// //// //// 

$('.ui.modal').modal({
    allowMultiple: false
  });

function toggleModal(){
  $('#secondModal')
    .modal('attach events', '#firstModal .blue.button')
  ;

  $('#thirdModal')
    .modal('attach events', '#secondModal .positive.button')
  ;

  //$('#fourthModal')
  //  .modal('attach events', '#thirdModal .blue.button')
  //;

  $('#firstModal')
    .modal('show')
  ;
}

//// //// //// //// drop box //// //// //// ////  

var inputElement = document.getElementById("dropbox")
inputElement.addEventListener("change", handleFiles, false);
function handleFiles() {
  var fileList = this.files; /* now you can work with the file list */
}

dropbox = document.getElementById("dropbox");
dropbox.addEventListener("dragenter", dragenter, false);
dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("drop", drop, false);

function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}

function drop(e) {
  e.stopPropagation();
  e.preventDefault();

  var dt = e.dataTransfer;
  var files = dt.files;

  handleFiles(files);
}

//// //// //// //// side bar //// //// //// //// 

// click listener
$('.content.icon').click(function(){
  $('.ui.sidebar').sidebar('toggle');
  });


// These next two functions are unnecessary... however
// I feel that even the slight glimpse of the loader
// gives a polished look to the UI

function hideAndLoad(){
  $('.ui.sidebar').sidebar('hide');
  $('.ui.modal').modal('hide');
  $('#loader').addClass('ui active dimmer');
}
function plotExampleAndLoad(){
  setTimeout(function(){
    fetchData();
    plotData();
  $('#loader').removeClass('ui active dimmer');
  updateInfoBox();
  }, 200);

  hideAndLoad();

}

// this is all that really needs to happen
function plotExample(){
  fetchData();
  plotData();
}


// popups

$('#side-explanation a').popup({position: 'right center'})


//// //// //// //// info box //// //// //// //// 

// aka glowing / pulsing effect
$('.info.icon')
  .transition('set looping')
  .transition('pulse', '1500ms');

$('.info.icon').click(function(){
  $('#info-box').toggleClass('hidden');
});

function updateInfoBox(){
  // total size
  $('#statsSize').empty();
  $('#statsSize').append(_.size(organized));

  // number clusters
  $('#clusterSize').empty();
  $('#clusterSize').append(_.uniq(organized, Object.keys(data)[3]).length);
  $('#info-box').toggle('hidden')
}

//initalize rotateToggle
$('.ui.checkbox')
  .checkbox();

$('.ui.checkbox').click(function(){
  rotateToggle();
});