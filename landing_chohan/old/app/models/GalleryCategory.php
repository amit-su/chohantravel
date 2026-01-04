<?php
class GalleryCategory extends Eloquent{
	 protected $table = "gallery_categories";
	 public $timestamps =  false;
	 
	 public function images(){
		return $this->hasMany('GalleryImage','galler_category_id','id');
	}
}