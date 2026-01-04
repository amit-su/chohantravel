<?php

class HomeController extends BaseController {

	

	public function getContactUs(){
		  return View::make('contact');
	}

    public function getBookTrip(){
		return View::make('book_a_trip');
	}

}
