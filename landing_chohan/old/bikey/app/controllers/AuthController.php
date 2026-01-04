<?php
class AuthController extends BaseController{
	

	public function postLogin(){
	    $postdata = file_get_contents("php://input");
	    if (isset($postdata)) {
	        $request = json_decode($postdata);
	        $email = $request->email;
	 		$password = $request->password;

	        $credentials['email'] = $email;
	        $credentials['password'] = $password;

	        if(Auth::attempt($credentials))
	        {
	          return Response::json(['status'=>1,'data'=>Auth::user()->id]);
	        }
	        return Response::json(['status'=>0,'data'=>'Invalid login details']);
	    }
	    else {
	        return Response::json(['status'=>0]);
	    }
	}

	public function postSignUp(){
		$postdata = file_get_contents("php://input");
	    if (isset($postdata)) {
	        $request = json_decode($postdata);
	        $first_name = trim($request->first_name);
	        $last_name = trim($request->last_name);
	        $mobile = trim($request->mobile);
	        $email = trim($request->email);
	 		$password = trim($request->password);
	 		$type = $request->type;

	        $check_email = User::where(['email'=>$email])->first();
	        if($check_email)
	        {
	        	return Response::json(['status'=>0,'data'=>'Email is already registered']);
	        }

	        $check_mobile = User::where(['mobile'=>$mobile])->first();
	        if($check_mobile)
	        {
	        	return Response::json(['status'=>0,'data'=>'Mobile is already registered']);
	        }

	        $user = new User;
	        $user->email = $email;
	        $user->mobile = $mobile;
	        $user->password = Hash::make($password);
	        $user->user_type = $type;
	        if($user->save())
	        {
	        	if($type == 2)
	        	{
	        		/// Passenger
	        		$passenger = new Passenger;
	        		$passenger->user_id = $user->id;
	        		$passenger->first_name = $first_name; 
	        		$passenger->last_name = $last_name;
	        		$passenger->save();
	        		return Response::json(['status'=>1]);
	        	}
	        	else{
	        	   // Driver
	        	}
	        }

	        
	    }
	    else {
	        return Response::json(['status'=>0]);
	    }
	}

	public function postProcessBooking(){
		$postdata = file_get_contents("php://input");
	    if (isset($postdata)) {
	        $request = json_decode($postdata);
	        $login_id = trim($request->login_id);
	        $lat = trim($request->pickup_lat);
	        $lng = trim($request->pickup_lng);
	        $destination_lat = trim($request->dropoff_lat);
	 		$destination_lng = trim($request->dropoff_lng);


	 		$check = User::find($login_id);
	 		if($check)
	 		{
	 			if($check->user_type == 2)
	 			{
					
				$distance = 1;
				$earth_radius = 6371; //earth's radius in miles
				
				
				$upper_latitude = $lat + rad2deg($distance / $earth_radius);
				$lower_latitude = $lat - rad2deg($distance / $earth_radius);
                $upper_longitude = $lng + rad2deg($distance / $earth_radius / cos(deg2rad($lat)));
				$lower_longitude = $lng - rad2deg($distance / $earth_radius / cos(deg2rad($lat)));
				
				$car = DriverCurrentLatLng::whereBetween('latitude',[$lower_latitude,$upper_latitude])
				        ->whereBetween('longitude',[$lower_longitude,$upper_longitude])
						->where('status',1)->first();
						
				if($car)
				{
					$car->status = 3;
					$car->save();
					$arr = [
					  'driver_id' =>$car->driver_id,
					  'latitude'  => $car->latitude,
					  'longitude' => $car->longitude
					];
					
				   $booking = new Booking;
				   $booking->driver_id = $car->driver_id;
                   $booking->passenger_id = $check->id;
                   $booking->pickup_lat = trim($lat);
                   $booking->pickup_lng = trim($lng);
                   $booking->dropoff_lat = trim($destination_lat);
                   $booking->dropoff_lng = trim($destination_lng);
				   $booking->status = 2;
                   if($booking->save())
                   {
					  $arr['booking_id'] = $booking->id;
                   	  return Response::json(['status'=>1,'data'=>$arr]);
                   }
					
				}
				
					
                   
	 			}
	 			return Response::json(['status'=>0,'data'=>'Log out of the app and login again']);
	 		}
	 		return Response::json(['status'=>0,'data'=>'Invalid login details']);
	        
	        

	        
	    }
	    else {
	       return Response::json(['status'=>0,'data'=>'No data received']); 
	    }
	}



	public function postDriverLogin(){
		$postdata = file_get_contents("php://input");
	    if (isset($postdata)) {
	        $request = json_decode($postdata);
	        $email = trim($request->email);
	        $password = trim($request->password);
	        //$uid = $request->uid;


	 		$credentials['email'] = $email;
	        $credentials['password'] = $password;

	        if(Auth::attempt($credentials))
	        {
               //Auth::user()->device_id = $uid;
               Auth::user()->driver_status = 1;
               Auth::user()->save();
               return Response::json(['status'=>1,'data'=>Auth::user()->id]);
	        }
	        return Response::json(['status'=>0,'data'=>'Invalid login details']);
	    }
	    else {
	       return Response::json(['status'=>0,'data'=>'No data received']); 
	    }
	}

	public function postUpdateDriverStatus(){
		 $postdata = file_get_contents("php://input");
	     if (isset($postdata)) {
	        $request = json_decode($postdata);
	        $login_id = trim($request->login_id);
	        $status   = $request->status;
			$latitude  = $request->lat;
			$longitude  = $request->lng;
			
	 		$user = User::find($login_id);
	 		if($user)
	 		{
               $on_off = new DriverOnlineOfflineDetails;
               $on_off->driver_id = $login_id;
               $on_off->status = $status;
               $on_off->save();

               $user->driver_trip_status = $status;
               $user->save();
			   
			        $current = DriverCurrentLatLng::where(['driver_id'=>$login_id])->first();
					if($current)
					{
						$current->latitude = $latitude;
						$current->longitude = $longitude;
						$current->status = 0;
						$current->save();
					}
					
               return Response::json(['status'=>1]);
	 		}

	    }
	    else {
	       return Response::json(['status'=>0,'data'=>'No data received']); 
	    }
	}


	public function postDriverLogout(){
		 $postdata = file_get_contents("php://input");
	     if (isset($postdata)) {
	        $request = json_decode($postdata);
	        $login_id = trim($request->login_id);
	        
	 		$user = User::find($login_id);
	 		if($user)
	 		{
				if($user->user_type == 2)
				{
					$user->driver_status = 0;
				}
				else{
					$user->driver_status = 0;
                    $user->driver_trip_status = 0;
				}
	 		   
               $user->save();
               return Response::json(['status'=>1]);
	 		}
           return Response::json(['status'=>0,'data'=>'Invalid driver details']); 
	    }
	    else {
	       return Response::json(['status'=>0,'data'=>'No data received']); 
	    }
	}
}