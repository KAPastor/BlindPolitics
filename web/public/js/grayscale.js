var party = '';
var twitter_handle = '';
var tweet = '';

function load_stats(){
  console.log('LOADING STATS')
  // Lets just load the number of total guesses and the total number correct and wrong vs dem or Rep.
  // Need to collect the stats here by calling from python
  $.ajax('/load_stats', {
    success: function(data) {
      data = JSON.parse(data);
      $('#total_num').html("TOTAL NUMBER OF GUESSES: " + data['total_num']);
      $('#p_correct').html("PERCENT CORRECT GUESSES: " + parseFloat(100*data['p_correct']).toFixed(2));
      console.log(data);
    },
    error: function() {
    }
  });


}

function load_tweet(){
  $.ajax('/load_tweet', {
    success: function(data) {
      data = JSON.parse(data);
      party = data.party;
      twitter_handle = data.twitter_handle;
      tweet = data.tweet;

      // Split the tweet by spaces then http and remove the link.
      var tweet_split = tweet.split("http");
      var new_tweet = '';
      $.each(tweet_split,function(idx,tw){
        if (tw.indexOf("://") == -1){
          new_tweet = new_tweet + " " + tw;
        }
      })

      $('#choices').fadeOut(function(){
        html_str = '<p class="intro-text tweet">' + new_tweet + '</p>';
        html_str = html_str + '<div id="the_buttons" class="row">';
        html_str = html_str + '<div class="col-lg-4"><a onclick="guess(\'Democrat\')" href="#" class="btn btn-primary btn-lg">DEMOCRAT</a></div>';
        html_str = html_str + '<div class="col-lg-4 twitter_handle"></div>';
        html_str = html_str + '<div class="col-lg-4"><a onclick="guess(\'Republican\')" href="#" class="btn btn-danger btn-lg">REPUBLICAN</a></div>';
        html_str = html_str + '</div>';
        $('#choices').html(html_str);
        $('#choices').fadeIn();
      });
    },
    error: function() {
        html_str = '<p class="intro-text tweet">WOAH! Can\'t find a tweet right now :(</p>';
        $('#choices').html(html_str);
        $('#choices').fadeIn();
    }
  });
}

function guess(guess){
  $('#the_buttons').fadeOut(function(){
    html_str = '<div class="col-lg-6 twitter_handle"><a href="https://www.twitter.com/'+twitter_handle+'" target="_blank"><i class="fa fa-twitter" aria-hidden="true"></i> @' + twitter_handle + '</a></div>';
    html_str = html_str + '<div class="col-lg-6"><a onclick="location.reload()" href="#" class="btn btn-info btn-lg">Next Tweet</a></div>';
    $('#the_buttons').html(html_str);
    $('#the_buttons').fadeIn();
  })

  $.getJSON("http://jsonip.com/?callback=?", function (data) {
    // Once we have the ID address we can call the ajax method
    $.ajax('/add_guess', {
      data: {
        party:party,
        twitter_handle:twitter_handle,
        tweet:tweet,
        guess:guess,
        location:data.ip,
      },
      success: function(data) {},
      error: function() {}
    });

    // As this is going on we will update the actual outcome
    if (party=='Democrat'){
      $('.dem').animate({color: '#232066'}, "slow");
    }else {
      $('.rep').animate({color: '#E91D0E'}, "slow");
    }
  });
}

(function($) {
//   "use strict"; // Start of use strict
//
//   Highcharts.theme = {
//    colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
//       '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
//    chart: {
//       backgroundColor: {
//          linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
//          stops: [
//             [0, '#000000'],
//             [1, '#000000']
//          ]
//       },
//       style: {
//          fontFamily: '\'Unica One\', sans-serif'
//       },
//       plotBorderColor: '#606063'
//    },
//    title: {
//       style: {
//          color: '#E0E0E3',
//          textTransform: 'uppercase',
//          fontSize: '20px'
//       }
//    },
//    subtitle: {
//       style: {
//          color: '#E0E0E3',
//          textTransform: 'uppercase'
//       }
//    },
//    xAxis: {
//       gridLineColor: '#707073',
//       labels: {
//          style: {
//             color: '#E0E0E3'
//          }
//       },
//       lineColor: '#707073',
//       minorGridLineColor: '#505053',
//       tickColor: '#707073',
//       title: {
//          style: {
//             color: '#A0A0A3'
//
//          }
//       }
//    },
//    yAxis: {
//       gridLineColor: '#707073',
//       labels: {
//          style: {
//             color: '#E0E0E3'
//          }
//       },
//       lineColor: '#707073',
//       minorGridLineColor: '#505053',
//       tickColor: '#707073',
//       tickWidth: 1,
//       title: {
//          style: {
//             color: '#A0A0A3'
//          }
//       }
//    },
//    tooltip: {
//       backgroundColor: 'rgba(0, 0, 0, 0.85)',
//       style: {
//          color: '#F0F0F0'
//       }
//    },
//    plotOptions: {
//       series: {
//          dataLabels: {
//             color: '#B0B0B3'
//          },
//          marker: {
//             lineColor: '#333'
//          }
//       },
//       boxplot: {
//          fillColor: '#505053'
//       },
//       candlestick: {
//          lineColor: 'white'
//       },
//       errorbar: {
//          color: 'white'
//       }
//    },
//    legend: {
//       itemStyle: {
//          color: '#E0E0E3'
//       },
//       itemHoverStyle: {
//          color: '#FFF'
//       },
//       itemHiddenStyle: {
//          color: '#606063'
//       }
//    },
//    credits: {
//       style: {
//          color: '#666'
//       }
//    },
//    labels: {
//       style: {
//          color: '#707073'
//       }
//    },
//
//    drilldown: {
//       activeAxisLabelStyle: {
//          color: '#F0F0F3'
//       },
//       activeDataLabelStyle: {
//          color: '#F0F0F3'
//       }
//    },
//
//    navigation: {
//       buttonOptions: {
//          symbolStroke: '#DDDDDD',
//          theme: {
//             fill: '#505053'
//          }
//       }
//    },
//
//    // scroll charts
//    rangeSelector: {
//       buttonTheme: {
//          fill: '#505053',
//          stroke: '#000000',
//          style: {
//             color: '#CCC'
//          },
//          states: {
//             hover: {
//                fill: '#707073',
//                stroke: '#000000',
//                style: {
//                   color: 'white'
//                }
//             },
//             select: {
//                fill: '#000003',
//                stroke: '#000000',
//                style: {
//                   color: 'white'
//                }
//             }
//          }
//       },
//       inputBoxBorderColor: '#505053',
//       inputStyle: {
//          backgroundColor: '#333',
//          color: 'silver'
//       },
//       labelStyle: {
//          color: 'silver'
//       }
//    },
//
//    navigator: {
//       handles: {
//          backgroundColor: '#666',
//          borderColor: '#AAA'
//       },
//       outlineColor: '#CCC',
//       maskFill: 'rgba(255,255,255,0.1)',
//       series: {
//          color: '#7798BF',
//          lineColor: '#A6C7ED'
//       },
//       xAxis: {
//          gridLineColor: '#505053'
//       }
//    },
//
//    scrollbar: {
//       barBackgroundColor: '#808083',
//       barBorderColor: '#808083',
//       buttonArrowColor: '#CCC',
//       buttonBackgroundColor: '#606063',
//       buttonBorderColor: '#606063',
//       rifleColor: '#FFF',
//       trackBackgroundColor: '#404043',
//       trackBorderColor: '#404043'
//    },
//
//    // special colors for some of the
//    legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
//    background2: '#505053',
//    dataLabelsColor: '#B0B0B3',
//    textColor: '#C0C0C0',
//    contrastTextColor: '#F0F0F3',
//    maskColor: 'rgba(255,255,255,0.3)'
// };
//
// // Apply the theme
// Highcharts.setOptions(Highcharts.theme);
//
//
//   Highcharts.chart('container', {
//
//       chart: {
//           type: 'heatmap',
//           marginTop: 40,
//           marginBottom: 80,
//           plotBorderWidth: 1
//       },
//
//
//       title: {
//           text: 'Sales per employee per weekday'
//       },
//
//       xAxis: {
//           categories: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas', 'Maria', 'Leon', 'Anna', 'Tim', 'Laura']
//       },
//
//       yAxis: {
//           categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
//           title: null
//       },
//
//       colorAxis: {
//           min: 0,
//           minColor: '#FFFFFF',
//           maxColor: Highcharts.getOptions().colors[0]
//       },
//
//       legend: {
//           align: 'right',
//           layout: 'vertical',
//           margin: 0,
//           verticalAlign: 'top',
//           y: 25,
//           symbolHeight: 280
//       },
//
//       tooltip: {
//           formatter: function () {
//               return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> sold <br><b>' +
//                   this.point.value + '</b> items on <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
//           }
//       },
//
//       series: [{
//           name: 'Sales per employee',
//           borderWidth: 1,
//           data: [[0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67], [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48], [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52], [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16], [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115], [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120], [6, 0, 13], [6, 1, 44], [6, 2, 88], [6, 3, 98], [6, 4, 96], [7, 0, 31], [7, 1, 1], [7, 2, 82], [7, 3, 32], [7, 4, 30], [8, 0, 85], [8, 1, 97], [8, 2, 123], [8, 3, 64], [8, 4, 84], [9, 0, 47], [9, 1, 114], [9, 2, 31], [9, 3, 48], [9, 4, 91]],
//           dataLabels: {
//               enabled: true,
//               color: '#000000'
//           }
//       }]
//
//   });


  load_tweet();

  load_stats();




  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 48)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 54
  });

  // Collapse Navbar
  var navbarCollapse = function() {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  };
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);

})(jQuery); // End of use strict

// Google Maps Scripts
var map = null;
// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);
google.maps.event.addDomListener(window, 'resize', function() {
  map.setCenter(new google.maps.LatLng(43.467, -79.727748));
});

function init() {
  // Basic options for a simple Google Map
  // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
  var mapOptions = {
    // How zoomed in you want the map to start at (always required)
    zoom: 15,

    // The latitude and longitude to center the map (always required)
    center: new google.maps.LatLng(43.467, -79.727748), // New York

    // Disables the default Google Maps UI components
    disableDefaultUI: true,
    scrollwheel: false,
    draggable: false,

    // How you would like to style the map.
    // This is where you would paste any style found on Snazzy Maps.
    styles: [{
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{
        "color": "#000000"
      }, {
        "lightness": 17
      }]
    }, {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [{
        "color": "#000000"
      }, {
        "lightness": 20
      }]
    }, {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [{
        "color": "#000000"
      }, {
        "lightness": 17
      }]
    }, {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [{
        "color": "#000000"
      }, {
        "lightness": 29
      }, {
        "weight": 0.2
      }]
    }, {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [{
        "color": "#000000"
      }, {
        "lightness": 18
      }]
    }, {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [{
        "color": "#000000"
      }, {
        "lightness": 16
      }]
    }, {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [{
        "color": "#000000"
      }, {
        "lightness": 21
      }]
    }, {
      "elementType": "labels.text.stroke",
      "stylers": [{
        "visibility": "on"
      }, {
        "color": "#000000"
      }, {
        "lightness": 16
      }]
    }, {
      "elementType": "labels.text.fill",
      "stylers": [{
        "saturation": 36
      }, {
        "color": "#000000"
      }, {
        "lightness": 40
      }]
    }, {
      "elementType": "labels.icon",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [{
        "color": "#000000"
      }, {
        "lightness": 19
      }]
    }, {
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [{
        "color": "#000000"
      }, {
        "lightness": 20
      }]
    }, {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [{
        "color": "#000000"
      }, {
        "lightness": 17
      }, {
        "weight": 1.2
      }]
    }]
  };

  // Get the HTML DOM element that will contain your map
  // We are using a div with id="map" seen below in the <body>
  var mapElement = document.getElementById('map');

  // Create the Google Map using out element and options defined above
  map = new google.maps.Map(mapElement, mapOptions);

  // Custom Map Marker Icon - Customize the map-marker.png file to customize your icon
  var image = 'img/map-marker.svg';
  var myLatLng = new google.maps.LatLng(40.6700, -73.9400);
  var beachMarker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    icon: image
  });
}
