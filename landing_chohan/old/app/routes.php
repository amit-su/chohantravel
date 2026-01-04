<?php

Route::get('/',array(
   'as' => 'get-home',
   'uses' => 'HomeController@getHome'
));

Route::get('/about-us',array(
   'as' => 'get-about-us',
   'uses' => 'HomeController@getAboutUs'
));

Route::get('/contact-us',array(
   'as' => 'get-contact-us',
   'uses' => 'HomeController@getContactUs'
));

Route::post('/contact-us',array(
   'as' => 'post-contact-us',
   'uses' => 'AjaxController@postAddBooking'
));

Route::get('/gallery-images/{id}',array(
  'as' => 'get-gallery-images',
  'uses' => 'HomeController@getGalleryDetails'
));



Route::get('/marriage-services/',array(
  'as'   => 'get-marriage-services',
  'uses' => 'HomeController@getGetMarriageServices'
));

Route::get('/school-picnics/',array(
  'as'   => 'get-school-picnics',
  'uses' => 'HomeController@getSchoolPicnics'
));

Route::get('/office-picnics/',array(
  'as'   => 'get-office-picnics',
  'uses' => 'HomeController@getOfficePickupsAndDrops'
));


Route::get('/school-excursions/',array(
  'as'   => 'get-school-excursions',
  'uses' => 'HomeController@getSchoolExcursions'
));

Route::get('/office-pickupsand-drops/',array(
  'as'   => 'get-office-pickupsand-drops',
  'uses' => 'HomeController@getOfficePickupsAndDrops'
));

Route::get('/sight-seeings/',array(
  'as'   => 'get-sight-seeing',
  'uses' => 'HomeController@getSightSeeings'
));

Route::get('/tours/',array(
  'as'   => 'get-tours',
  'uses' => 'HomeController@getTours'
));

Route::get('/school-pickups-drops/',array(
  'as'   => 'get-school-pickups-drops',
  'uses' => 'HomeController@getSchoolPickupsAndDrops'
));

Route::get('/chattered-services/',array(
  'as'   => 'get-chattered-services',
  'uses' => 'HomeController@getChatteredServices'
));



Route::group(array('before'=>'adminguest'),function(){
	
	Route::get('/admin',array(
	   'as' => 'get-admin-login',
	   'uses' => 'AdminController@getAdminLogin'
	));

	Route::post('/admin/login',array(
	   'as' => 'post-admin-login',
	   'uses' => 'AdminController@postAdminLogin'
	));


	

});


Route::group(array('before'=>'adminauth'),function(){
	
	
	Route::get('/admin/dashboard',array(
	   'as'   => 'get-admin-dashboard',
	   'uses' => 'AdminController@getAdminDashboard'
	));

	Route::post('/add-new-category',array(
	  'uses' => 'AjaxController@postAddNewCategory'
	));

	Route::post('/deactivate-gallery-category',array(
	  'uses' => 'AdminController@postDeactivateGalleryCategory'
	));

	Route::post('/delete-gallery-category',array(
	  'uses' => 'AdminController@postDeleteGalleryCategory'
	));


	Route::get('/admin/manage-images/{id}',array(
	  'uses' => 'AdminController@getManageImages'
	));

	Route::post('/admin/upload-image',array(
	  'uses' => 'AdminController@postUploadImage'
	));

	Route::post('/admin/delete-gallery-image',array(
	  'uses' => 'AdminController@postGalleryImage'
	));
	
	
	Route::get('/logout',array(
	  'as' => 'get-logout',
	  'uses' => 'AdminController@getLogout'
	));

});






/* Route::get('/password',function(){
	return Hash::make(123456);
}); */



