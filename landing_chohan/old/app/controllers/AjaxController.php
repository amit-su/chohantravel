<?php
class AjaxController extends BaseController{

    public function postAddBooking(){
        $name = trim(Input::get('name'));
        $email = trim(Input::get('email'));
        $mobile = trim(Input::get('mobile'));
        $bus_category = trim(Input::get('bus_category'));
        $message = trim(Input::get('message'));


        $booking = new Booking;
        $booking->name = $name;
        $booking->email = $email;
        $booking->mobile = $mobile;
        $booking->bus_category = $bus_category;
        $booking->message = $message;
        $booking->save();
        if($booking->save())
        {
               $data['id'] = "CTT-".$booking->id;
               $data['customer_name'] = $booking->name;
               $data['customer_email'] = $booking->email;
               $data['mobile'] = $booking->mobile;
               $data['bus_category'] = $booking->bus_category;
               $data['mes']   = $booking->message;
               Mail::send('emails.booking',$data,function($message)
		      {
			    $message->to('chohantoursandtravels@gmail.com', 'CHOHANTOURSANDTRAVELS')
			    ->subject('You have a new booking request');
	          });
			  
			  
			   Mail::send('emails.booking',$data,function($message)
		      {
			    $message->to('bookings@chohantoursandtravels.com', 'CHOHANTOURSANDTRAVELS')
			    ->subject('You have a new booking request');
	          });
			  
			  Mail::send('emails.booking',$data,function($message)
		      {
			    $message->to('contact.chohantoursandtravels@gmail.com', 'CHOHANTOURSANDTRAVELS')
			    ->subject('You have a new booking request');
	          });
	      if(!empty($data['customer_email']))
		  {
			  Mail::send('emails.customer_booking',$data,function($message) use ($data)
			  {
				$message->to($data['customer_email'], 'CHOHANTOURSANDTRAVELS')
				->subject('Thanks for your booking at chohantoursandtravel');
			  });
		  }
	      
            return Redirect::back()
            ->with('success','Booking submitted, we will contact you soon');
        }

        
    }
	
	public function postAddNewCategory(){
		$category_name = trim(Input::get('category_name'));
		if($category_name)
		{
			$g = new GalleryCategory;
			$g->name = $category_name;
			$g->save();
			return Response::json(['status'=>1]);
		}
		return Response::json(['status'=>0]);
	}
	
}