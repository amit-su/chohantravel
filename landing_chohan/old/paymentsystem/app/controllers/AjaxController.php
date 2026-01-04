<?php
class AjaxController extends BaseController{

    public function postLogin(){
		//dd(Input::all());
		$email = trim(Input::get('email'));
		$password = trim(Input::get('password'));
		
		$credentials['email'] = $email;
		$credentials['password'] = $password;
		
		if(Auth::attempt($credentials))
		{
			return Response::json(['status'=>1]);
		}
		return Response::json(['status'=>0,'data'=>'Invalid login details']);
	}
	
}