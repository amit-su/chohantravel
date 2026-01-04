<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, x-xsrf-token, x_csrftoken');
Route::get('/',function(){
	return 'Loaded';
});


Route::post('/login',array(
   'uses' => 'AuthController@postLogin'
));





Route::post('/signup',array(
  'uses' => 'AuthController@postSignUp'
));


Route::post('/process-booking',array(
  'uses' => 'AuthController@postProcessBooking'
));

/////////////////////////////
/// RIDER ROUTES //////////
///////////////////////////
Route::post('/rider-login',array(
   'uses' => 'RiderController@postRiderLogin'
));

Route::post('/finding-nearby-rides',array(
  'uses' => 'RiderController@postFindNearbyRides'
));

Route::post('/update-driver-marker-on-map',array(
  'uses' => 'RiderController@postUpdateDriverMarkerOnMap'
));

Route::post('/update-booked-driver-marker-on-map',array(
  'uses' => 'RiderController@postUpdateBookedDriverMarkerOnMap'
));

Route::post('/check-for-trip-start',array(
  'uses' => 'RiderController@postCheckForTripStart'
));
/////////////////////////////
/// DRIVER ROUTES //////////
///////////////////////////
Route::post('/driver-login',array(
   'uses' => 'AuthController@postDriverLogin'
));
Route::post('/update-driver-status',array(
   'uses' => 'AuthController@postUpdateDriverStatus'
));

Route::post('/logout-driver',array(
   'uses' => 'AuthController@postDriverLogout'
));

Route::post('/check-for-new-booking',array(
   'uses' => 'DriverController@postCheckForNewBooking'
));
Route::post('/decline-booking',array(
   'uses' => 'DriverController@postDeclineBooking'
));
Route::post('/accept-booking',array(
   'uses' => 'DriverController@postAcceptBooking'
));

Route::post('/update-driver-lat-lng',array(
   'uses' => 'DriverController@postUpdateDriverLatLng'
));

Route::post('/fetch-dropoff-location',array(
   'uses' => 'DriverController@postFetchDropOffLocation'
));

Route::post('/start-trip',array(
   'uses' => 'DriverController@postStartTip'
));

Route::post('/complete-trip',array(
   'uses' => 'DriverController@postCompleteTrip'
));

Route::post('/get-latest-lat-lng',array(
  'uses' => 'DriverController@postLatestLatLng'
));

Route::post('/calculate-distance-time',array(
   'uses' => 'HomeController@postCalculateDistanceTime'
));

Route::post('/fetch-rider-details',array(
  'uses' => 'RiderController@postFetchRiderDetails'
));

Route::post('/check-for-driver-new-lat-lng',array(
   'uses' => 'DriverController@postCheckForDriverNewLatLng'
));



/////////////////////////////
/// TEST ROUTES //////////
///////////////////////////

Route::get('/password',function(){
	return Hash::make(123456);
});