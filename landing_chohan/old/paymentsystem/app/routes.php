<?php

Route::get('/',array(
   'as' => 'get-login',
   'uses' => 'HomeController@getLogin'
));


Route::post('/login',array(
   'as' => 'post-login',
   'uses' => 'AjaxController@postLogin'
));




Route::get('/add-driver',array(
  'as' => 'get-add-driver',
  'uses' => 'HomeController@getAddDriver'
));



