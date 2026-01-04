<?php
class DriverCurrentLatLng extends Eloquent{
	protected $table = "driver_current_lat_lng";
	
	public function driver(){
		return $this->belongsTo('User','driver_id','id');
	}
}