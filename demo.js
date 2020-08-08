var start = {},end={};
var submit = document.getElementById("calculate_route");
function initMap() {
    var source = document.getElementById('pac-input-1');
    var destination = document.getElementById('pac-input-2');
    var autocompleteSource = new google.maps.places.Autocomplete(source);
    var autocompleteDestination = new google.maps.places.Autocomplete(destination);
    autocompleteSource.setFields(
        ['address_components', 'geometry', 'icon', 'name']);
    autocompleteDestination.setFields(
        ['address_components', 'geometry', 'icon', 'name']);


    autocompleteSource.addListener('place_changed', function () {
        
        var place = autocompleteSource.getPlace();
        console.log('Source is ');
        start ={
            lat:place.geometry.location.lat(),
            lng:place.geometry.location.lng()
        } ;
        console.log(source);
        if (!place.geometry) {
        window.alert("No details available for input: '" + place.name + "'");
        return;
        }
        else mapmark(start);

        //start.value = source.lat;

    });

    autocompleteDestination.addListener('place_changed', function () {
        
        var place = autocompleteDestination.getPlace();
        console.log('Destination is');
        console.log(place);
        end = {
            lat:place.geometry.location.lat(),
            lng:place.geometry.location.lng()
        };
        if (!place.geometry) {
        window.alert("No details available for input: '" + place.name + "'");
        return;
        }
        else mapmark(end);
    });
     
    submit.addEventListener("click",()=>{
        console.log(start,end);
        var router = platform.getRoutingService(null, 8),
            routeRequestParams = {
              routingMode: 'fast',
              transportMode: 'car',
              origin: start.lat + "," + start.lng, // Brandenburg Gate
              destination: end.lat + "," +end.lng,
              alternatives: 10,
              return: 'polyline,turnByTurnActions,actions,instructions,travelSummary'
            };
      
      
        router.calculateRoute(
          routeRequestParams,
          onSuccess,
          onError
        );
    });
}
   /**
     * Boilerplate map initialization code starts below:
     */

    // set up containers for the map  + panel
    var mapContainer = document.getElementById('map'),
    routeInstructionsContainer = document.getElementById('panel');

    //Step 1: initialize communication with the platform
    // In your own code, replace variable window.apikey with your own apikey
    var platform = new H.service.Platform({
        apikey: 'D5XqebfcOmFhU5Qfw9sXuIiP1C4WRzF6qZ0SZa1L5Vs'
    });

    var defaultLayers = platform.createDefaultLayers();
    console.log(defaultLayers);
    //Step 2: initialize a map - this map is centered over Berlin
    var map = new H.Map(mapContainer,
    defaultLayers.vector.normal.map,{
        center: {lat:52.5160, lng:13.3779},
        zoom: 13,
        pixelRatio: window.devicePixelRatio || 1
    });
    //map.addLayer(defaultLayers.vector.normal.traffic);
    // add a resize listener to make sure that the map occupies the whole container
    window.addEventListener('resize', () => map.getViewPort().resize());

    //Step 3: make the map interactive
    // MapEvents enables the event system
    // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    // Create the default UI components
    var ui = H.ui.UI.createDefault(map, defaultLayers);

    // Hold a reference to any infobubble opened
    var bubble;

/**
 * Opens/Closes a infobubble
 * @param  {H.geo.Point} position     The location on the map.
 * @param  {String} text              The contents of the infobubble.
 */
function openBubble(position, text){
 if(!bubble){
    bubble =  new H.ui.InfoBubble(
      position,
      // The FO property holds the province name.
      {content: text});
    ui.addBubble(bubble);
  } else {
    bubble.setPosition(position);
    bubble.setContent(text);
    bubble.open();
  }
}
function mapmark(start){
    var svgMarkup = '<svg width="24" height="24" ' +
    'xmlns="http://www.w3.org/2000/svg">' +
    '<rect stroke="white" fill="#1b468d" x="1" y="1" width="22" ' +
    'height="22" /><text x="12" y="18" font-size="12pt" ' +
    'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
    'fill="white">H</text></svg>';
    var icon = new H.map.Icon(svgMarkup),
    marker = new H.map.Marker(start, {icon: icon});
    map.addObject(marker);
    map.setCenter(start);
    console.log(start);
}



/**
   * This function will be called once the Routing REST API provides a response
   * @param  {Object} result          A JSONP object representing the calculated route
   *
   * see: http://developer.here.com/rest-apis/documentation/routing/topics/resource-type-calculate-route.html
   */
  function onSuccess(result) {
    let route = result.routes[0];
    addRouteShapeToMap(route);
    addManueversToMap(route);
    addWaypointsToPanel(route);
    addManueversToPanel(route);
    addSummaryToPanel(route);
    // result.routes.forEach((element)=>{
    //   addRouteShapeToMap(element);
    //   addManueversToMap(element);
    // //addWaypointsToPanel(element);
    // addManueversToPanel(element);
    // addSummaryToPanel(element);
    // })
  }
  
  /**
   * This function will be called if a communication error occurs during the JSON-P request
   * @param  {Object} error  The error message received.
   */
  function onError(error) {
    alert('Can\'t reach the remote server');
  }
/**
 * Creates a H.map.Polyline from the shape of the route and adds it to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
function addRouteShapeToMap(route){
  route.sections.forEach((section) => {
    // decode LineString from the flexible polyline
    let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

    // Create a polyline to display the route:
    var routeOutline = new H.map.Polyline(linestring, {
      style: {
        lineWidth: 10,
        strokeColor: 'rgba(0, 128, 255, 0.7)',
        lineTailCap: 'arrow-tail',
        lineHeadCap: 'arrow-head'
      }
    });
    // Create a patterned polyline:
    var routeArrows = new H.map.Polyline(linestring, {
      style: {
        lineWidth: 10,
        fillColor: 'white',
        strokeColor: 'rgba(255, 255, 255, 1)',
        lineDash: [0, 2],
        lineTailCap: 'arrow-tail',
        lineHeadCap: 'arrow-head' }
      }
    );
    var routeLine = new H.map.Group();
    routeLine.addObjects([routeOutline, routeArrows]);
    // Add the polyline to the map
    map.addObject(routeLine);
    // And zoom to its bounding rectangle
    map.getViewModel().setLookAtData({
      bounds: routeLine.getBoundingBox()
    });
  });
}


/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addManueversToMap(route){
  var svgMarkup = '<svg width="18" height="18" ' +
    'xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="8" cy="8" r="8" ' +
      'fill="#1b468d" stroke="white" stroke-width="1"  />' +
    '</svg>',
    dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}}),
    group = new  H.map.Group(),
    i,
    j;
  route.sections.forEach((section) => {
    let poly = H.geo.LineString.fromFlexiblePolyline(section.polyline).getLatLngAltArray();
    let legs = [ ];
 //console.log(poly);
    let actions = section.actions;
    // Add a marker for each maneuver
    for (i = 0;  i < actions.length; i += 1) {
      let action = actions[i];
      let steps = {
      	lat: poly[action.offset * 3],
        lng: poly[action.offset * 3 + 1],
      }
      var marker =  new H.map.Marker({
        lat: poly[action.offset * 3],
        lng: poly[action.offset * 3 + 1]},
        {icon: dotIcon});
        legs.push(steps);
      marker.instruction = action.instruction;
      group.addObject(marker);
    }
		console.log(legs);
    group.addEventListener('tap', function (evt) {
      map.setCenter(evt.target.getGeometry());
      openBubble(
         evt.target.getGeometry(), evt.target.instruction);
    }, false);

    // Add the maneuvers group to the map
    map.addObject(group);
  });
}


/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addWaypointsToPanel(route) {
  var nodeH3 = document.createElement('h3'),
      labels = [];
    console.log(route);
  route.sections.forEach((section) => {
    labels.push(
      section.turnByTurnActions[0].nextRoad.name[0].value)
    labels.push(
      section.turnByTurnActions[section.turnByTurnActions.length - 1].currentRoad.name[0].value)
  });
  
  nodeH3.textContent = labels.join(' - ');
  routeInstructionsContainer.innerHTML = '';
  routeInstructionsContainer.appendChild(nodeH3);
}

/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addSummaryToPanel(route){
  let duration = 0,
      distance = 0;

  route.sections.forEach((section) => {
    distance += section.travelSummary.length;
    duration += section.travelSummary.duration;
  });

  var summaryDiv = document.createElement('div'),
   content = '';
   content += '<b>Total distance</b>: ' + distance  + 'm. <br/>';
   content += '<b>Travel Time</b>: ' + duration.toMMSS() + ' (in current traffic)';


  summaryDiv.style.fontSize = 'small';
  summaryDiv.style.marginLeft ='5%';
  summaryDiv.style.marginRight ='5%';
  summaryDiv.innerHTML = content;
  routeInstructionsContainer.appendChild(summaryDiv);
}

/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addManueversToPanel(route){
  var nodeOL = document.createElement('ol');

  nodeOL.style.fontSize = 'small';
  nodeOL.style.marginLeft ='5%';
  nodeOL.style.marginRight ='5%';
  nodeOL.className = 'directions';

  route.sections.forEach((section) => {
    section.actions.forEach((action, idx) => {
      var li = document.createElement('li'),
          spanArrow = document.createElement('span'),
          spanInstruction = document.createElement('span');

      spanArrow.className = 'arrow ' + (action.direction || '') + action.action;
      spanInstruction.innerHTML = section.actions[idx].instruction;
      li.appendChild(spanArrow);
      li.appendChild(spanInstruction);

      nodeOL.appendChild(li);
    });
  });

  routeInstructionsContainer.appendChild(nodeOL);
}


Number.prototype.toMMSS = function () {
  return  Math.floor(this / 60)  +' minutes '+ (this % 60)  + ' seconds.';
}

// Now use the map as required...
//calculateRouteFromAtoB (platform);
