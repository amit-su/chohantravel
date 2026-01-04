<?php
class AdminController extends BaseController{


	public function getAdmin(){
		return View::make('admin.login');
	}


	public function getAdminDashboard(){
		$pages = Page::where(['status'=>1])->get();
		return View::make('admin.dashboard')
		      ->with('pages',$pages);
	}

	public function getAdminPages($id){
		$page = Page::find($id);
		if($page)
		{
		  $pages = Page::where(['status'=>1])->get();
           if($page->id == 1)
           {
           	 
           	 $home_page_contents = HomePageContent::where(['id'=>1])->first();
           	 
           	 return View::make('admin.homepage')
           	        ->with('pages',$pages)
           	        ->with('page',$page)
           	        ->with('content',$home_page_contents);
           }
           else if($page->id == 2)
           {

           }
           else if($page->id == 3){

           }
           else if($page->id == 4){
           	  $content = Gallery::find(1);
           	  return View::make('admin.gallery')
           	        ->with('pages',$pages)
           	        ->with('page',$page)
           	        ->with('content',$content);
           }
	    }
	    return 'Page not found';
		
	}

	public function getAdminLogout(){
		Auth::logout();
		return View::make('admin.login');
	}

	public function getAdminSettings(){
		$pages = Page::where(['status'=>1])->get();
		$setting = Setting::where(['id'=>1])->first();
		return View::make('admin.settings')
		->with('pages',$pages)
		->with('setting',$setting);
	}
}