<?php

class HomeController extends BaseController {


   
	
	public function getHome()
	{
		$cats = GalleryCategory::where(['status'=>1])->orderBy('name')->get();
		return View::make('site.home')
		->with('cats',$cats);
	}

	public function getAboutUs(){
		$cats = GalleryCategory::where(['status'=>1])->orderBy('name')->get();
		return View::make('site.about_us')
		->with('cats',$cats);
	}

	public function getContactUs(){
		$cats = GalleryCategory::where(['status'=>1])->orderBy('name')->get();
		return View::make('site.contact_us')
		->with('cats',$cats);
	}
	
	public function getGalleryDetails($id){
		$cats = GalleryCategory::where(['status'=>1])->orderBy('name')->get();
		if($id == 0)
		{
			$images = GalleryImage::orderBy('id','desc')->get();
			return View::make('site.gallery_details')
			->with('images',$images)
			->with('cat',[])
			->with('cats',$cats);
		}
		else{
			
			$cat = GalleryCategory::find($id);
			return View::make('site.gallery_details')
			->with('cats',$cats)
			->with('cat',$cat);
		}
		
	}
	
	
	public function getGetMarriageServices(){
		$cats = GalleryCategory::where(['status'=>1])->orderBy('name')->get();
		return View::make('site.marriage_service')
		->with('cats',$cats);
	}
	
	public function getSchoolPicnics(){
		$cats = GalleryCategory::where(['status'=>1])->orderBy('name')->get();
		return View::make('site.school_picnics')
		->with('cats',$cats);
	}
	
	
	public function getSchoolExcursions(){
		$cats = GalleryCategory::where(['status'=>1])->orderBy('name')->get();
		return View::make('site.school_excursions')
		->with('cats',$cats);
	}
	
	public function getOfficePickupsAndDrops(){
		$cats = GalleryCategory::where(['status'=>1])->orderBy('name')->get();
		return View::make('site.office_pickups_drops')
		->with('cats',$cats);
	}
	
	public function getSightSeeings(){
		$cats = GalleryCategory::where(['status'=>1])->orderBy('name')->get();
		return View::make('site.sight_seeings')
		->with('cats',$cats);
	}
	
	
	public function getTours(){
		$cats = GalleryCategory::where(['status'=>1])->orderBy('name')->get();
		return View::make('site.tours')
		->with('cats',$cats);
	}
	
	public function getSchoolPickupsAndDrops(){
		$cats = GalleryCategory::where(['status'=>1])->orderBy('name')->get();
		return View::make('site.school_pickups_drops')
		->with('cats',$cats);
	}

	public function getChatteredServices(){
		$cats = GalleryCategory::where(['status'=>1])->orderBy('name')->get();
		return View::make('site.chattered_services')
		->with('cats',$cats);
	}
	
}
