<?php

class HomeController extends BaseController {

	
	public function getLogin(){
		return View::make('login');
	}
	
	
	public function getAddDriver(){
		return View::make('add_driver');
	}

	
}
