
// function iaziVerifyCaptcha(response) {
// 	console.log(response);
// 	// this.iaziGetClient();
// }

// function iaziGetClient() {
// 	// need to fetch this from an element
// 	try {
// 		const alg = 'SHA-512';
// 		const enc = 'B64';
// 		const encInit = 'TEXT';
// 		const x = '3FA5CA0FAC524008A16A4A91C3F473829C1FE75877514A17AA168F64FA10CD80';
// 		const z = 'de7a3576-b0f8-4dc4-8aa2-99df4c91c94d-34c6cc8a-7940-4561-99c6-3baf3e237f33';
// 		const t = moment().unix();
// 		const h = x + t + z;
// 		const shaObj = new jsSHA(alg, encInit);
// 		shaObj.update(h);
// 		const hash = shaObj.getHash(enc);
// 		document.getElementById('hash').value = hash;
// 		console.log(x);
// 		console.log(t);
// 		console.log(hash);
// 		// console.log('hallo');
// 		const request = new XMLHttpRequest();
// 		const testUrl = 'https://testservices.iazi.ch/api/hedolight/v1/getclient';
// 		request.open("GET", testUrl);
// 		request.setRequestHeader('Content-Type', 'application/json');
// 		request.setRequestHeader('x', x);
// 		request.setRequestHeader('t', t);
// 		request.setRequestHeader('h', hash);
// 		request.onload = function () {
// 			var users = JSON.parse(request.responseText);
// 			if (request.readyState == 4 && request.status == "200") {
// 				console.log(users);
// 			} else {
// 				console.log(users);
// 			}
// 		}
// 		request.send(null);
// 	} catch (error) {
// 		console.log(error);
// 	}
// }

jQuery( function () {
	"use strict";

	(function($){

		var maxHeight = -1;

		$('.casawp-lg_slide').each(function() {
		    maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
		});

		$('#clgFormAnchor').outerHeight(maxHeight);

		$(window).resize(function(){
			$('.casawp-lg_slide').each(function() {
			    maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
			});

			$('.casawp-lg-wrapper_inner').outerHeight(maxHeight);
		})

		$('.btn-forward').click(function(e){
			e.preventDefault();
			var $this = $(this).parent().parent().parent().parent().parent();
			if ($this.find('#pac-input').length) {
				if ($('#cityName').val()) {
					nextSlide($this);
				} else {
					$('#pac-input').css('border-color', 'red');
				}
			} else {
				nextSlide($this);
			}
			return false;
		});

		$('.btn-backward').click(function(e){
			e.preventDefault();
			var $this = $(this).parent().parent().parent().parent().parent();
			prevSlide($this);
			return false;
		});

		function prevSlide(currentSlide){
			$(currentSlide).removeClass('active');
			$(currentSlide).prev().addClass('active').removeClass('old');
		}

		function nextSlide(currentSlide){
			$(currentSlide).removeClass('active').addClass('old');
			$(currentSlide).next().addClass('active');
		}

		$('input[type="range"]').rangeslider({
		    polyfill : false,
		    onInit : function() {
		        this.output = $( '<div class="range-output" />' ).insertAfter( this.$range ).html( this.$element.val() );
		    },
		    onSlide : function( position, value ) {
		        this.output.html( value );
		    }
		});

		if ($('input[name="extra_data[propertyType]"]:checked').val() == 'single-family-house') {
			$('#casawp-lg-property-surface').parent().show();
			$('#casawp-lg-bathroom').parent().hide();
		}

		$('input[type="radio"][name="extra_data[propertyType]"]').change(function(){
			if ($('input[name="extra_data[propertyType]"]:checked').val() == 'single-family-house') {
				$('#casawp-lg-property-surface').parent().show();
				$('#casawp-lg-bathroom').parent().hide();
			} else {
				$('#casawp-lg-property-surface').parent().hide();
				$('#casawp-lg-bathroom').parent().show();
			}
		});

		function initAutocomplete() {
	        var map = new google.maps.Map(document.getElementById('casawp-lg_map'), {
	          center: {lat: 47.377960, lng: 8.539920},
	          zoom: 10,
	          mapTypeId: 'roadmap',
	          disableDefaultUI: true
	        });

	        // Create the search box and link it to the UI element.
	        var card = document.getElementById('pac-card');
	        var input = document.getElementById('pac-input');
	        var searchBox = new google.maps.places.SearchBox(input);
	        map.controls[google.maps.ControlPosition.TOP_CENTER].push(card);

	        // Bias the SearchBox results towards current map's viewport.
	        map.addListener('bounds_changed', function() {
	          searchBox.setBounds(map.getBounds());
					});
					
					google.maps.event.addDomListener(input, 'keydown', function(event) {
						if (event.keyCode === 13) {
							// ENTER
							event.preventDefault();
						} 
					});

	        var markers = [];
	        // Listen for the event fired when the user selects a prediction and retrieve
	        // more details for that place.
	        searchBox.addListener('places_changed', function() {
	          var places = searchBox.getPlaces();

						if (places.length == 0) {
	            return;
	          }

	          // Clear out the old markers.
	          markers.forEach(function(marker) {
	            marker.setMap(null);
	          });
	          markers = [];

	          // For each place, get the icon, name and location.
	          var bounds = new google.maps.LatLngBounds();
						var country = '';
	          places.forEach(function(place) {
	            if (!place.geometry) {
	              console.log("Returned place contains no geometry");
	              return;
							}
							if (place.address_components) {
								var countryItem = place.address_components.find(function(item) {
									return item.types.indexOf('country') !== -1;
								});
								if (countryItem) {
									country = countryItem.short_name ? countryItem.short_name : '';
								}
							}
							document.getElementById('countryName').value = country;
	          	document.getElementById('cityName').value = place.name;
              document.getElementById('cityLat').value = place.geometry.location.lat();
              document.getElementById('cityLng').value = place.geometry.location.lng();
              
              $('#pac-input').css('border-color', 'transparent');

	            // Create a marker for each place.
	            markers.push(new google.maps.Marker({
	              map: map,
	              title: place.name,
	              position: place.geometry.location
	            }));

	            if (place.geometry.viewport) {
	              // Only geocodes have viewport.
	              bounds.union(place.geometry.viewport);
	            } else {
	              bounds.extend(place.geometry.location);
	            }
	          });
	          map.fitBounds(bounds);
	        });
	      }

	      if ($('#casawp-lg_map').length) {
	      	initAutocomplete();
	      }

	}(jQuery));

} );
