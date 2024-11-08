<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store'; // import writable store to make the list reactive
  
    let map;
    let mapElement;
    let searchInput;
    let placesService;
    
    // Create a writable store to store nearby locations
    const nearbyLocations = writable([]);
  
    // Default location details for the hospital (replace with actual coordinates)
    const defaultLocation = {
      name: "City Hospital",
      lat: 13.0153,
      lng: 74.8069,
    };
  
    onMount(() => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
  
      window.initMap = () => {
        // Initialize the map centered at the default location
        map = new google.maps.Map(mapElement, {
          center: { lat: defaultLocation.lat, lng: defaultLocation.lng },
          zoom: 15,
        });
  
        // Add a marker for the default location (hospital)
        const hospitalMarker = new google.maps.Marker({
          map,
          position: { lat: defaultLocation.lat, lng: defaultLocation.lng },
          title: defaultLocation.name,
        });
  
        // Create an InfoWindow for the default location
        const hospitalInfoWindow = new google.maps.InfoWindow({
          content: `<div>${defaultLocation.name}</div>`,
        });
        hospitalInfoWindow.open(map, hospitalMarker);
  
        // Initialize the PlacesService
        placesService = new google.maps.places.PlacesService(map);
  
        // Find nearby medicine supply centers for the default location (City Hospital)
        findNearbyMedicineCenters({ lat: defaultLocation.lat, lng: defaultLocation.lng });
  
        // Set up the search box with Autocomplete
        const autocomplete = new google.maps.places.Autocomplete(searchInput);
        autocomplete.bindTo("bounds", map);
  
        // Listener for when a place is selected
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
  
          if (!place.geometry) {
            console.log("No details available for input: '" + place.name + "'");
            return;
          }
  
          // Center the map on the selected location
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(15);
          }
  
          // Place a marker at the selected location
          new google.maps.Marker({
            map,
            position: place.geometry.location,
          });
  
          // Find nearby medicine supply centers for the selected location
          findNearbyMedicineCenters(place.geometry.location);
        });
      };
  
      return () => {
        document.head.removeChild(script);
        delete window.initMap;
      };
    });
  
    function findNearbyMedicineCenters(location) {
        console.log(location)
      const request = {
        location: location,
        radius: 5000, // Search within 5 kilometers
        type: 'pharmacy', // Search for pharmacies/medicine supply centers
      };
  
      // Perform a nearby search for pharmacies
      placesService.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // Update the nearbyLocations store with the results
          nearbyLocations.set(
            results.map((place) => ({
              name: place.name,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }))
          );
          
          // Add markers for each pharmacy found
          results.forEach((place) => {
            // Skip the default location (hospital) if it's in the nearby results
            if (place.geometry.location.lat() === defaultLocation.lat && place.geometry.location.lng() === defaultLocation.lng) {
              return; // Skip this place since it's the default location
            }
  
            // Place a marker for each pharmacy found
            const marker = new google.maps.Marker({
              map,
              position: place.geometry.location,
              title: place.name,
              icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Different icon for other locations
            });
  
            // Add an InfoWindow to each marker to show the name
            const infoWindow = new google.maps.InfoWindow({
              content: `<div>${place.name}</div>`,
            });
  
            // Open the InfoWindow when the marker is clicked
            marker.addListener("click", () => {
              infoWindow.open(map, marker);
            });
          });
        } else {
          console.log("No nearby places found or request failed:", status);
        }
      });
    }
  
    function centerMapOnLocation(location) {
      map.setCenter({ lat: location.lat, lng: location.lng });
      map.setZoom(15);
    }
  </script>
  
  <style>
    #map {
      width: 100%;
      height: 600px;
    }
    #search-box {
      width: 300px;
      margin: 10px;
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
    .location-list {
      margin-top: 20px;
      padding: 10px;
      border-top: 2px solid #ccc;
    }
    .location-item {
      padding: 8px;
      cursor: pointer;
    }
    .location-item:hover {
      background-color: #f0f0f0;
    }
  </style>
  
  <!-- HTML for the search box and map container -->
  <input id="search-box" type="text" placeholder="Search a location" bind:this={searchInput} />
  <div id="map" bind:this={mapElement}></div>
  
  <!-- List nearby locations -->
  <div class="location-list">
    <h3>Nearby Locations</h3>
    {#each $nearbyLocations as location (location.name)}
      <div class="location-item" on:click={() => centerMapOnLocation(location)}>
        {location.name}
      </div>
    {/each}
  </div>
  