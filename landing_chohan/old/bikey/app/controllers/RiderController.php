<?php
class RiderController extends BaseController{
	
	
	public function postRiderLogin(){
		    $postdata = file_get_contents("php://input");
			if (isset($postdata)) {
				$request = json_decode($postdata);
				$mobile = $request->mobile;
				$password = $request->password;

				$credentials['mobile'] = $mobile;
				$credentials['password'] = $password;

				if(Auth::attempt($credentials))
				{
				  Auth::user()->driver_status = 1;
				  Auth::user()->save();
				  return Response::json(['status'=>1,'data'=>Auth::user()->id]);
				}
				return Response::json(['status'=>0,'data'=>'Invalid login details']);
			}
			else {
				return Response::json(['status'=>0]);
			}
	}
	
	public function postFindNearbyRides(){
		    $postdata = file_get_contents("php://input");
			if (isset($postdata)) {
				$request = json_decode($postdata);
				$lat = $request->latitude;
				$lng = $request->longitude;
				
                $data = [];
				$distance = 5;
				$earth_radius = 6371; //earth's radius in miles
				
				
				$upper_latitude = $lat + rad2deg($distance / $earth_radius);
				$lower_latitude = $lat - rad2deg($distance / $earth_radius);

				// longitude boundaries (longitude gets smaller when latitude increases)
				$upper_longitude = $lng + rad2deg($distance / $earth_radius / cos(deg2rad($lat)));
				$lower_longitude = $lng - rad2deg($distance / $earth_radius / cos(deg2rad($lat)));

				
						
				$cars = DriverCurrentLatLng::whereBetween('latitude',[$lower_latitude,$upper_latitude])
				        ->whereBetween('longitude',[$lower_longitude,$upper_longitude])
						->where('status',1)->get();
			    if($cars->count())
				{
					foreach($cars as $car)
					{
						$arr = [
						  'driver_id' => $car->driver_id,
						  'latitude' => $car->latitude,
						  'longitude' => $car->longitude,
						];
						array_push($data,$arr);
					}
					return Response::json(['status'=>1,'data'=>$cars,'original_lat'=>$lat,'original_lng'=>$lng,'upper_lat'=>$upper_latitude,'lower_lng'=>$lower_longitude]);
				}
				else{
								return Response::json(['status'=>0,'data'=>'No bikes available','original_lat'=>$lat,'original_lng'=>$lng,'upper_lat'=>$upper_latitude,'lower_lng'=>$lower_longitude]);
	
				}
			}
			else {
				return Response::json(['status'=>0]);
			}
	}
	
	public function postUpdateDriverMarkerOnMap(){
		$postdata = file_get_contents("php://input");
			if (isset($postdata)) {
				$request = json_decode($postdata);
				$array = $request->driverArray;
				$data = [];
                foreach($array as $arr)
				{
				   	$info = DriverCurrentLatLng::where(['driver_id'=>$arr,'status'=>1])->first();
					if($info)
					{
						$arr = [
						  'driver_id' => $arr,
						  'status' => 1,
						  'latitude'=>$info->latitude,
						  'longitude' => $info->longitude,
						];
					}
					else{
						$arr = [
						  'driver_id' => $arr,
						  'status' => 0,
						];
					}
					
					array_push($data,$arr);
				}
				return Response::json(['data'=>$data]);
			}
			else {
				return Response::json(['status'=>0]);
			}
	}
	
	public function postUpdateBookedDriverMarkerOnMap(){
		   $postdata = file_get_contents("php://input");
			if (isset($postdata)) {
				$request = json_decode($postdata);
				$driver_id = $request->driver_id;
				$driver = DriverCurrentLatLng::where(['driver_id'=>$driver_id,'status'=>3])->first();
				$arr = [
				  'latitude' => $driver->latitude,
				  'longitude' => $driver->longitude,
				];	
				
				return Response::json(['data'=>$arr]);
				
			}
			else {
				return Response::json(['status'=>0]);
			}
	}
	
	public function postCheckForTripStart(){
		$postdata = file_get_contents("php://input");
			if (isset($postdata)) {
				$request = json_decode($postdata);
				$login_id = $request->login_id;
				$booking_id = $request->booking_id;
				$booking = Booking::find($booking_id);
				
				if($booking)
				{
					if($booking->status == 3)
					{
						return Response::json(['status'=>1]);
					}
					return Response::json(['status'=>0]);
				}					
				
				
				return Response::json(['status'=>0,'data'=>'Booking not found']);
			}
			else {
				return Response::json(['status'=>0]);
			}
	}
	
	public function postFetchRiderDetails(){
		$postdata = file_get_contents("php://input");
			if (isset($postdata)) {
				$request = json_decode($postdata);
				$login_id = $request->login_id;
				
				
				$rider = User::find($login_id);
				if($rider)
				{
					if($rider->driver_status == 1)
					{
						$arr = [
						  'name' => $rider->first_name." ".$rider->last_name,
						  'email' => $rider->email,
						  'mobile' => $rider->mobile,
						  'referral_code' => $rider->referal_code
						];
						return Response::json(['status'=>1,'data'=>$arr]);
					}
					return Response::json(['status'=>2,'data'=>'Not logged in']);
				}
				return Response::json(['status'=>0,'data'=>'Invalid rider details']);
				
				
				
			}
			else {
				return Response::json(['status'=>0]);
			}
	}
	
	
}