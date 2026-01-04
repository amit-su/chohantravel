<?php
class DriverController extends BaseController{
	
	
	
	public function postCheckForNewBooking(){
		$postdata = file_get_contents("php://input");
	    if (isset($postdata)) {
	        $request = json_decode($postdata);
	        $login_id = $request->login_id;

	        if(Auth::loginUsingId($login_id))
			{
				$booking = Booking::where(['driver_id'=>$login_id,'status'=>1])->first();
				if($booking)
				{
					$current = DriverCurrentLatLng::where(['driver_id'=>$login_id])->first();
					if($current)
					{
						$current->status = 2;
						$current->save();
					}
					$arr = [
					   'booking_id' => $booking->id,
					   'pickup_lat' => $booking->pickup_lat,
					   'pickup_lng'  => $booking->pickup_lng,
					];
					return Response::json(['status' =>1,'data'=>$arr]);
				}
				return Response::json(['status' =>2]);
				
				 
			}

	        
	    }
	    else {
	        return Response::json(['status'=>0]);
	    }
	}
	
	public function postDeclineBooking(){
		$postdata = file_get_contents("php://input");
	    if (isset($postdata)) {
	        $request = json_decode($postdata);
	        $login_id = $request->login_id;
			$booking_id = $request->booking_id;
			$latitude = $request->lat;
			$longitude = $request->lng;
			
	        if(Auth::loginUsingId($login_id))
			{
				$booking = Booking::find($booking_id);
				if($booking)
				{
					
					$booking->driver_id = 0;
					$booking->save();
					//// Check for new driver
					$current = DriverCurrentLatLng::where(['driver_id'=>$login_id])->first();
					if($current)
					{
						$current->latitude = $latitude;
						$current->longitude = $longitude;
						$current->status = 1;
						$current->save();
					}
					$decline = new BookingDriver;
					$decline->booking_id = $booking->id;
					$decline->driver_id = $login_id;
					$decline->status  = 2;
					$decline->save();
					
					return Response::json(['status' =>1]);
				}
				return Response::json(['status' =>0]);
				
				//return 
			}
			return Response::json(['status' =>0]);
	        
	    }
	    else {
	        return Response::json(['status'=>0]);
	    }
	}
	
	public function postAcceptBooking(){
		$postdata = file_get_contents("php://input");
	    if (isset($postdata)) {
	        $request = json_decode($postdata);
	        $login_id = $request->login_id;
			$booking_id = $request->booking_id;
			$latitude = $request->lat;
			$longitude = $request->lng;
			
	        if(Auth::loginUsingId($login_id))
			{
				$booking = Booking::find($booking_id);
				if($booking)
				{
					
					$booking->status = 2;
					$booking->save();
					//// Check for new driver
					
					///Update driver latest lat and lng
					$current = DriverCurrentLatLng::where(['driver_id'=>$login_id])->first();
					if($current)
					{
						$current->latitude = $latitude;
						$current->longitude = $longitude;
						$current->status = 3;
						$current->save();
					}
					
					$accept = new BookingDriver;
					$accept->booking_id = $booking->id;
					$accept->driver_id = $login_id;
					$accept->status  = 1;
					$accept->save();
					
					
					
					return Response::json(['status' =>1]);
				}
				return Response::json(['status' =>0]);
				
				//return 
			}
			return Response::json(['status' =>0]);
	        
	    }
	    else {
	        return Response::json(['status'=>0]);
	    }
	}
	
	public function postUpdateDriverLatLng(){
		$postdata = file_get_contents("php://input");
	    if (isset($postdata)) {
	        $request = json_decode($postdata);
	        $login_id = $request->login_id;
			$latitude = $request->latitude;
			$longitude = $request->longitude;
			$status = $request->status;
			
	        if(Auth::loginUsingId($login_id))
			{
				$current_lat_lng = DriverCurrentLatLng::where(['driver_id'=>$login_id])->first();
				if($current_lat_lng)
				{
					$current_lat_lng->driver_id = $login_id;
					$current_lat_lng->latitude = $latitude;
					$current_lat_lng->longitude = $longitude;
					$current_lat_lng->status = $status;
					$current_lat_lng->save();
				}
				else{
					
					$current_lat_lng =  new DriverCurrentLatLng;
					$current_lat_lng->driver_id = $login_id;
					$current_lat_lng->latitude = $latitude;
					$current_lat_lng->longitude = $longitude;
					$current_lat_lng->status = $status;
					$current_lat_lng->save();
				}
				
				$on_off_det = new DriverOnlineOfflineDetails;
				$on_off_det->driver_id = $login_id;
				$on_off_det->status = $status;
				$on_off_det->latitude = $latitude;
				$on_off_det->longitude = $longitude;
				$on_off_det->save();
				$arr = [
				  'latitude' => $latitude,
				  'longitude' => $longitude
				];
				return Response::json(['status' =>1,'data'=>$arr]);
			}
			return Response::json(['status' =>0]);
	        
	    }
	    else {
	        return Response::json(['status'=>0]);
	    }
	}
	
	public function postFetchDropOffLocation(){
		 $postdata = file_get_contents("php://input");
	    if (isset($postdata)) {
	        $request = json_decode($postdata);
	        $login_id = $request->login_id;
			$booking_id = $request->booking_id;
			
	        
				$booking = Booking::find($booking_id);
				if($booking)
				{
					$arr = [
					 'drop_off_lat' => $booking->dropoff_lat,
					 'drop_off_lng' => $booking->dropoff_lng
					];
					
					return Response::json(['status' =>1,'data'=>$arr]);
				}
			return Response::json(['status' =>0]);
	        
	    }
	    else {
	        return Response::json(['status'=>0]);
	    }
	}
	
	public function postStartTip(){
		 $postdata = file_get_contents("php://input");
			if (isset($postdata)) {
				$request = json_decode($postdata);
				$login_id = $request->login_id;
				$booking_id = $request->booking_id;
				
				if(Auth::loginUsingId($login_id))
				{
					$booking = Booking::find($booking_id);
					if($booking)
					{
						$booking->status = 3;
						$booking->save();
						
						return Response::json(['status' =>1]);
					}
				}
				return Response::json(['status' =>0]);
				
			}
			else {
				return Response::json(['status'=>0]);
			}
	}
	
	public function postCompleteTrip(){
		$postdata = file_get_contents("php://input");
			if (isset($postdata)) {
				$request = json_decode($postdata);
				$login_id = $request->login_id;
				$booking_id = $request->booking_id;
				$pickup_address = $request->pickup_address;
				$destination_address = $request->destination_address;
				$distance = $request->distance;
				$time = $request->time_secs;
				$fare = $request->fare;
				if(Auth::loginUsingId($login_id))
				{
					$booking = Booking::find($booking_id);
					if($booking)
					{
						
						$booking->status = 4;
						$booking->save();
						
						$bill = new Bill;
						$bill->booking_id = $booking->id;
						$bill->pickup_address = trim($pickup_address);
						$bill->dropoff_address = trim($destination_address);
						$bill->distance = trim($distance);
						$bill->time = trim($time);
						$bill->fare = trim($fare);
						$bill->save();
						
						return Response::json(['status' =>1]);
					}
				}
				return Response::json(['status' =>0]);
				
			}
			else {
				return Response::json(['status'=>0]);
			}
	}
	
	public function postLatestLatLng(){
		$postdata = file_get_contents("php://input");
			if (isset($postdata)) {
				$request = json_decode($postdata);
				$login_id = $request->login_id;
				
				if(Auth::loginUsingId($login_id))
				{
					$latest = DriverLatLng::where(['driver_id'=>$login_id])->orderBY('id','desc')->first();
					$arr = [
					  'latitude' => $latest->latitude,
					  'longitude' => $latest->longitude,
					];
					return Response::json(['status'=>1,'data'=>$arr]);
				}
				return Response::json(['status' =>0]);
				
			}
			else {
				return Response::json(['status'=>0]);
			}
	}
	
	
	public function postCheckForDriverNewLatLng(){
		$postdata = file_get_contents("php://input");
			if (isset($postdata)) {
				return $postdata;
				$request = json_decode($postdata);
				$driverIds = $request->driverIds;
				$ids = [];
				return count($driverIds);
				for($i=0;$i<count($driverIds);$i++)
				{
					 echo $driverIds[$i];
				}
				//return Response::json(['status'=>1,'data'=>$ids]);
				
			}
			else {
				return Response::json(['status'=>0]);
			}
	}
}