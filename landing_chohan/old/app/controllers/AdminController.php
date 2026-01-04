<?php
class AdminController extends BaseController{


	public function getAdminLogin(){
		
		return View::make('admin.login');
	}
	
	public function postGalleryImage(){
		$id = Crypt::decrypt(Input::get('id'));
		$gi = GalleryImage::find($id);
		if($gi)
		{
			$gi->delete();
			return Response::json(['status'=>1,'data'=>'Image deleted']);
		}
		return Response::json(['status'=>1,'data'=>'Invalid image details']);
	}


	public function postAdminLogin(){
		//return dd(Input::all());
		$email = trim(Input::get('email'));
		$password = trim(Input::get('password'));
		$credentials['email'] = $email;
		$credentials['password'] = $password;
		
		if(Auth::attempt($credentials))
		{
			return Response::json(['status'=>1]);
		}
		return Response::json(['status'=>0,'data'=>'Incorrect email/password combination']);
	}
	
	public function getAdminDashboard(){
		$categories = GalleryCategory::orderBy('id','desc')->get();
		return View::make('admin.dashboard')
		->with('cats',$categories);
	}
	
	public function postDeactivateGalleryCategory(){
		$id = Input::get('id');
		$cat = GalleryCategory::find($id);
		if($cat)
		{
			$cat->status = 0;
			$cat->save();
			return Response::json(['status'=>1]);
		}
		return Response::json(['status'=>0,'data'=>'Invalid category details']);
	}
	
	public function postDeleteGalleryCategory(){
		$id = Input::get('id');
		$cat = GalleryCategory::find($id);
		if($cat)
		{
			$cat->delete();
			return Response::json(['status'=>1]);
		}
		return Response::json(['status'=>0,'data'=>'Invalid category details']);
	}
	
	public function getManageImages($id){
		$cat = GalleryCategory::find($id);
		return View::make('admin.manage_images')
		->with('cat',$cat);
	}
	
	public function getLogout(){
		Auth::logout();
		return Redirect::Route('get-admin-login');
	}
	
	
    public function postUploadImage(){
	   //dd(Input::all());
	   
	   $validator = Validator::make(Input::all(),array(
		  
		  'file'   => 'mimes:jpg,jpeg,png,gif,bmp'
		));
		
		if($validator->fails())
		{
			return Response::json(['status'=>0]);
		}
	      $file = Input::file('file');
	      if(!empty($file))
            {
              
              $extension    = $file->getClientOriginalExtension();
              $randomName   = str_random(11)."-".str_random(4);
              $new_name     = $randomName.".".$extension;
			  
			  
				  $file->move('assets/images/', $new_name);
				  //$image = Image::make(sprintf('assets/images/%s', $new_name))->resize(300,300)->save('assets/images/%s', $new_name);
				  /* Image::make('assets/img/banners/'.$new_name)      
                 ->resize(743,245)       
                 ->save('assets/img/banners/'.$new_name); */
				  $gi = new GalleryImage;
				  $gi->name = $new_name;
				  $gi->galler_category_id = Input::get('gallery_id');
				  $gi->save();
			  
			  return Response::json(['status'=>1,'data'=>$new_name]);
            }
			return Response::json(['status'=>0]);
   
	}
    
}