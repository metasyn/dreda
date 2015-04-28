// click listener
$('.content.icon').click(function(){
    $('.ui.sidebar').sidebar('toggle');
  });

// add loaders

function plot(){
  setTimeout(function(){
    plotData();
  $('#loader').removeClass('ui active dimmer');
  }, 1);
  $('#loader').addClass('ui active dimmer');
}