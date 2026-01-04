<?php

class HomeController extends BaseController {

	public function postCalculateDistanceTime(){
		$postdata = file_get_contents("php://input");
	    if (isset($postdata)) {
	        $request = json_decode($postdata);
	        $pickup_lat = $request->pickup_lat;
	 		$pickup_lng = $request->pickup_lng;
	 		$destination_lat = $request->destination_lat;
	 		$destination_lng = $request->destination_lng;

			$origin = $pickup_lat.",".$pickup_lng;
			$destination = $destination_lat.",".$destination_lng;
			
	        $link = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&mode=driving&origins=".$origin."&destinations=".$destination."&key=AIzaSyDY2UB04fAYk0E7vR5uHFy2osluUS-Nhmw";
	        $response = file_get_contents($link);
			$r = json_decode($response,true);
			$distance = explode(" ",$r['rows'][0]['elements'][0]['distance']['text']);
			$duration = explode(" ",$r['rows'][0]['elements'][0]['duration']['text']);
			return Response::json(['status'=>1,'distance'=>$distance[0],'duration'=>$duration[0]]);
		}
	    else {
	        return Response::json(['status'=>0]);
	    }
	}

}
