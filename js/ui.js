//// modals ////

function toggleModal(){
  $('.ui.modal')
    .modal('show')
  ;
}

//// side bar ////

// click listener
$('.content.icon').click(function(){
  $('.ui.sidebar').sidebar('toggle');
  });

// add loader
function plot(){
  setTimeout(function(){
    plotData();
  $('#loader').removeClass('ui active dimmer');
  }, 1);
  $('#loader').addClass('ui active dimmer');
}

// toggle sidebar first
function togglePlot(){
  setTimeout(function(){
    plot();
  }, 1);
	$('.ui.sidebar').sidebar('toggle')
}

//// info box ////

// aka glowing / pulsing info icon
$('.info.icon')
  .transition('set looping')
  .transition('pulse', '2500ms')
;

$('.info.icon').click(function(){
  $('#info-box').toggleClass('hidden')
  console.log('hi')
})

function updateInfoBox(){
  $('#statsSize').append(_.size(organized));
  $('#clusterSize').append(_.uniq(organized, Object.keys(data)[3]).length);
}
