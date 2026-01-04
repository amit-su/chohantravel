<?php


Route::get('/', function()
{
	return View::make('home');
});

Route::get('/contact-us',array(
  'as' => 'get-contact-us',
  'uses' => 'HomeController@getContactUs'
));

Route::get('/book-a-trip',array(
  'as' => 'get-book-trip',
  'uses' => 'HomeController@getBookTrip'
));

