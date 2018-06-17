// Global Variables declaration
var map, ID, Secret;

function AppModel() {
    var self = this;
    this.searchOption = ko.observable("");
    this.markers = [];
    // This function populates  infowindow when marker is clicked.
    this.populateInfoWindow = function(marker, infowindow) {
        if (infowindow.marker != marker) {
            infowindow.setContent('');
            infowindow.marker = marker;
            // Foursquare API id and secret
            ID = "AAHJLZTKUKIIU3CWZZ4DC5MSGVNRFFZYCIZUM54ZRZNIFHMN";
            Secret =
                "2P2C5SFOKV2GEXTSHB3YIN3VC4W3LMVNQXFBCUL05E0IMUSH";
            // URI for Foursquare API
            var apiUrl = 'https://api.foursquare.com/v2/venues/search?ll=' +
                marker.lat + ',' + marker.lng + '&client_id=' + ID +
                '&client_secret=' + Secret + '&query=' + marker.title +
                '&v=20170708' + '&m=foursquare';
            // Foursquare API
            $.getJSON(apiUrl).done(function(marker) {
                var response = marker.response.venues[0];
                self.place = response.location.formattedAddress[1];
                self.country = response.location.formattedAddress[3];
                self.stree = response.location.formattedAddress[0];
                self.category = response.categories[0].shortName;

                self.htmlContentFoursquare =
                    '<h4 class="subtitle">(' + self.category +
                    ')</h4>' + '<div>' +
                    '<h5 class="address_title"> Address: </h5>' +
                    '<p class="address">' + self.stree + '</p>' +
                    '<p class="address">' + self.place + '</p>' +
                    '<p class="address">' + self.country + '</p>' +
                     '</div>' + '</div>';

                infowindow.setContent(self.htmlContent + self.htmlContentFoursquare);
            }).fail(function() {
                // Send alert
                alert(
                    "There was an issue loading API."
                );
            });

            this.htmlContent = '<div>' + '<h2 class="iw_title">' + marker.title +
                '</h2>';

            infowindow.open(map, marker);
            infowindow.addListener('closeclick', function() {
                
                infowindow.marker = null;
            });
        }
    };

    this.populateAndBounceMarker = function() {

        self.populateInfoWindow(this, self.largeInfoWindow);

        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
                  this.setAnimation(null);
        }).bind(this), 1400);
    };

    this.initMap = function() {
        var mapCanvas = document.getElementById('map');
        
        var mapOptions = {
            center: new google.maps.LatLng(17.4374617, 78.4123472),
            zoom: 13,
            styles: styles
        };
        // only center and zoom are required.
        map = new google.maps.Map(mapCanvas, mapOptions);

        // Set InfoWindow code
        this.largeInfoWindow =  new google.maps.InfoWindow();
        for (var i = 0;  i < myLocations.length; i++) {
            this.markerTitle = myLocations[i].title;
            this.markerLati = myLocations[i].lat;
            this.markerLngi = myLocations[i].lng;
            // Google Maps marker setup code
            this.marker = new google.maps.Marker({
                  map: map,
                position: {
                    lat: this.markerLati,
                    lng: this.markerLngi
                },
                title: this.markerTitle,
                lat: this.markerLati,
                lng: this.markerLngi,
                id: i,
                animation: google.maps.Animation.DROP
            });
            this.marker.setMap(map);
            this.markers.push(this.marker);

            this.marker.addListener('click', self.populateAndBounceMarker);
        }
    };

    
    this.initMap();

    
    // This block appends our locations to list using data-bind
    this.myLocationsFilter = ko.computed(function() {
         var result = [];
        for (var i = 0; i < this.markers.length; i++) {

            var markerLocation = this.markers[i];
            if (markerLocation
                    .title.toLowerCase()
                    .includes(this.searchOption()
                    .toLowerCase())) {
                result.push(markerLocation);
                this.markers[i].setVisible(true);

            } else {
                this.markers[i].setVisible(false);

            }
        }
        return result;
    }, this);
}
// about the google error
googleError = function googleError() {
    alert(
        'Google Maps did not load. Please refresh the page!'
    );
};

function startApp() {
    ko.applyBindings(new AppModel());
}


$(document).ready(function() {
    function setHeight() {
      windowHeight = $(window).innerHeight();
      
      $('#map').css('min-height', windowHeight);

      $('#sidebar').css('min-height', windowHeight);
    };
    setHeight();
  
    $(window).resize(function() {
      setHeight();
    });
  });