@extends('site.main')
@section('content')
<div id="bootstrap-touch-slider" class="carousel bs-slider fade  control-round indicators-line" data-ride="carousel" data-pause="hover" data-interval="4000" >       
     <!-- Indicators -->            
	 <ol class="carousel-indicators">                
	 <li data-target="#bootstrap-touch-slider" data-slide-to="0" class="active"></li>
	 <li data-target="#bootstrap-touch-slider" data-slide-to="1"></li>    
	 <li data-target="#bootstrap-touch-slider" data-slide-to="2"></li>  
	 </ol>            <!-- Wrapper For Slides -->           
	 <div class="carousel-inner" role="listbox">         
	 <!-- Third Slide -->              
	 <div class="item active">                 
	 <!-- Slide Background -->                  
	 <img src="{{URL::to('/')}}/assets/images/new_1.jpg" alt="Bootstrap Touch Slider"  class="slide-image"/>      
	 <div class="bs-slider-overlay"></div>                    
	 <div class="container">                       
	 <div class="row">                            <!-- Slide Text Layer -->  
	 <div class="slide-text slide_style_center">                       
	 <h1 data-animation="animated zoomInRight">MODERN AND COMFORTABLE</h1>  
	 <p data-animation="animated fadeInLeft">Chohan Tours & Travels has been redesigned to ensure the safest ride for our passengers, from large adults to small infants.</p>   
	 </div>                      
	 </div>                    
	 </div>                
	 </div>                <!-- End of Slide -->            
	 <!-- Second Slide -->                
	 <div class="item">                   
	 <!-- Slide Background -->                   
	 <img src="{{URL::to('/')}}/assets/images/new_8.jpg" alt="Bootstrap Touch Slider"  class="slide-image"/>                    <div class="bs-slider-overlay"></div>                    <!-- Slide Text Layer -->            
	 <div class="slide-text slide_style_center">          
	 <h1 data-animation="animated flipInX">SAFE AND RELIABLE</h1>     
	 <p data-animation="animated lightSpeedIn">We wont just get you there, we’ll get you there safely</p>                            
	 </div>               
	 </div>    

	<div class="item">                   
	 <!-- Slide Background -->                   
	 <img src="{{URL::to('/')}}/assets/images/new_3.jpg" alt="Bootstrap Touch Slider"  class="slide-image"/>                    <div class="bs-slider-overlay"></div>                    <!-- Slide Text Layer -->            
	 <div class="slide-text slide_style_center">          
	 <h1 data-animation="animated flipInX">SAFE AND RELIABLE</h1>     
	 <p data-animation="animated lightSpeedIn">We wont just get you there, we’ll get you there safely</p>                            
	 </div>               
	 </div> 
	 
	 <div class="item">                   
	 <!-- Slide Background -->                   
	 <img src="{{URL::to('/')}}/assets/images/new_4.jpg" alt="Bootstrap Touch Slider"  class="slide-image"/>                    <div class="bs-slider-overlay"></div>                    <!-- Slide Text Layer -->            
	 <div class="slide-text slide_style_center">          
	 <h1 data-animation="animated flipInX">SAFE AND RELIABLE</h1>     
	 <p data-animation="animated lightSpeedIn">We wont just get you there, we’ll get you there safely</p>                            
	 </div>               
	 </div>
	 
	 <div class="item">                   
	 <!-- Slide Background -->                   
	 <img src="{{URL::to('/')}}/assets/images/new_5.jpg" alt="Bootstrap Touch Slider"  class="slide-image"/>                    <div class="bs-slider-overlay"></div>                    <!-- Slide Text Layer -->            
	 <div class="slide-text slide_style_center">          
	 <h1 data-animation="animated flipInX">SAFE AND RELIABLE</h1>     
	 <p data-animation="animated lightSpeedIn">We wont just get you there, we’ll get you there safely</p>                            
	 </div>               
	 </div>
	 
	 
	 <div class="item">                   
	 <!-- Slide Background -->                   
	 <img src="{{URL::to('/')}}/assets/images/new_6.jpg" alt="Bootstrap Touch Slider"  class="slide-image"/>                    <div class="bs-slider-overlay"></div>                    <!-- Slide Text Layer -->            
	 <div class="slide-text slide_style_center">          
	 <h1 data-animation="animated flipInX">SAFE AND RELIABLE</h1>     
	 <p data-animation="animated lightSpeedIn">We wont just get you there, we’ll get you there safely</p>                            
	 </div>               
	 </div>
	 
	 <div class="item">                   
	 <!-- Slide Background -->                   
	 <img src="{{URL::to('/')}}/assets/images/new_7.jpg" alt="Bootstrap Touch Slider"  class="slide-image"/>                    <div class="bs-slider-overlay"></div>                    <!-- Slide Text Layer -->            
	 <div class="slide-text slide_style_center">          
	 <h1 data-animation="animated flipInX">SAFE AND RELIABLE</h1>     
	 <p data-animation="animated lightSpeedIn">We wont just get you there, we’ll get you there safely</p>                            
	 </div>               
	 </div>
	 
	 <div class="item">                   
	 <!-- Slide Background -->                   
	 <img src="{{URL::to('/')}}/assets/images/banner8.jpg" alt="Bootstrap Touch Slider"  class="slide-image"/>                    <div class="bs-slider-overlay"></div>                    <!-- Slide Text Layer -->            
	 <div class="slide-text slide_style_center">          
	 <h1 data-animation="animated flipInX">SAFE AND RELIABLE</h1>     
	 <p data-animation="animated lightSpeedIn">We wont just get you there, we’ll get you there safely</p>                            
	 </div>               
	 </div>
	 
	 <div class="item">                   
	 <!-- Slide Background -->                   
	 <img src="{{URL::to('/')}}/assets/images/banner7.jpg" alt="Bootstrap Touch Slider"  class="slide-image"/>                    <div class="bs-slider-overlay"></div>                    <!-- Slide Text Layer -->            
	 <div class="slide-text slide_style_center">          
	 <h1 data-animation="animated flipInX">SAFE AND RELIABLE</h1>     
	 <p data-animation="animated lightSpeedIn">We wont just get you there, we’ll get you there safely</p>                            
	 </div>               
	 </div>
	 <!-- End of Slide -->             
	 <!-- Third Slide -->                             <!-- End of Slide --> 
	 </div><!-- End of Wrapper For Slides -->            <!-- Left Control --> 
	 
	 <a class="left carousel-control" href="#bootstrap-touch-slider" role="button" data-slide="prev">           
     <span class="fa fa-angle-left" aria-hidden="true"></span>          
	 <span class="sr-only">Previous</span>     
	 </a>            <!-- Right Control -->         
	 <a class="right carousel-control" href="#bootstrap-touch-slider" role="button" data-slide="next">                <span class="fa fa-angle-right" aria-hidden="true"></span>                
	 <span class="sr-only">Next</span>            
	 </a>        
	 </div>


<section class="welcome_info_blk">
 <div class="container">
  <div class="row">
    <div class="col-sm-7">
	 <div class="text_blk">
	   <h1>Welcome to Chohan Tours and Travels</h1>
	   <p>Introducing the brand new Chohan Tours & Travels buses
We’ve redefined the bus ride up experience. You’ll find brand new state of art amenities to make sure your travel experience is more confortable.</p>
         <p>Since the last 5 decades Chohan Tours & Travels have been the leading the travel trade in Kolkata. We offer services to the client’s satisfaction, to meet the growing and varied needs of the travel...</p>
	 <a href ="{{URL::ROute('get-about-us')}}" class="btn btn-lg btn-primary">Read More..</a>
	 </div>
	</div>
    <div class="col-sm-5">
	<div><img src="{{URL::to('/')}}/assets/images/about_image.png"></div>
	</div>
  </div>
 </div>
</section>	
<section class="expand_service_expert">
  <div class="container">
    <div class="expand_ser_head">
	<h2 class="landing_text-head">Our Services</h2>
	<p class="landing_subhead">Now if your legs are asleep then the rest of you is 12 inch, 14 inch & 16 inch of legroom so relax and catch some sweet eye.</p>
	<p class="landing_subhead">We wont just get you there, we’ll get you there safely.</p>
	<p class="landing_subhead">Chohan Tours & Travels buses is greener means of transportation, it’s more environmentally friendly fuel efficient.</p>
	</div>
	
	<div class="row">
	
	  <div class="col-sm-4">
	    <a href='{{URL::Route("get-marriage-services")}}'>
	    <div class="expert_block">
		 <div class="expert_img"><img src="{{URL::to('/')}}/assets/images/new_15.jpg"></div>
		 <div class="expert_info">
		   <h3>Marriage Service</h3>		  
		   <p>Our Super Deluxe luxury good looking, neat and clean coaches will impress your ‘Baraatis’ and on time reporting is...</p>
		 
		 </div>		
		</div>	
       </a>		
	 </div>
	 
	 <div class="col-sm-4">
	    <a href='{{URL::Route("get-school-picnics")}}'>
	    <div class="expert_block">
		 <div class="expert_img"><img src="{{URL::to('/')}}/assets/images/new_12.jpg"></div>
		 <div class="expert_info">
		   <h3>Picnics For Schools</h3>		  
		   <p>We provide both AC and Non AC Bus Services or School Excursions and for Picnics for school children with safety...</p>
		 
		 </div>		
		</div>
		</a>		
	 </div>
	 
	 
	 <div class="col-sm-4">
	   <a href='{{URL::Route("get-office-picnics")}}'>
	    <div class="expert_block">
		 <div class="expert_img"><img src="{{URL::to('/')}}/assets/images/new_16.jpg"></div>
		 <div class="expert_info">
		   <h3>Picnics For Office</h3>		  
		   <p>We cater to Corporates for their Annual Picnics through our Luxury Coaches to various Picnic Points in and around...</p>
		 
		 </div>		
		</div>	
      </a>		
	 </div>
	 
	 <div class="col-sm-4">
	    <a href='{{URL::Route("get-school-excursions")}}'>
	    <div class="expert_block">
		 <div class="expert_img"><img src="{{URL::to('/')}}/assets/images/new_11.jpg"></div>
		 <div class="expert_info">
		   <h3>School Excursions</h3>		  
		   <p>Our buses will take your students on school excursions to the Kolkata Zoo, Science City, the Indian Museum, Victoria Memorial...</p>
		 </div>		
		</div>
       </a>		
	 </div>
	 
	 
	 <div class="col-sm-4">
	    <a href='URL::Route("get-office-pickupsand-drops")'>
	    <div class="expert_block">
		 <div class="expert_img"><img src="{{URL::to('/')}}/assets/images/offf_pic_drop.jpg"></div>
		 <div class="expert_info">
		   <h3>Office Pickups And Drops</h3>		  
		   <p>Our service in the Corporate Sector is excellent as we have clients to whom we provide services 24X7/365 days in a...</p>
		 
		 </div>		
		</div>
		</a>
	 </div>
	 
	 <div class="col-sm-4">
	   <a href="{{URL::Route('get-sight-seeing')}}">
	    <div class="expert_block">
		 <div class="expert_img"><img src="{{URL::to('/')}}/assets/images/service1.jpg"></div>
		 <div class="expert_info">
		   <h3>Sight Seeings</h3>		  
		   <p>We provide buses for local sightseeing in and around Kolkata for Clients who come from outstation and also to our Local...</p>
		 
		 </div>		
		</div>	 
		</a>
	 </div>
	 
	 <div class="col-sm-4">
	    <a href="{{URL::Route('get-tours')}}">
	    <div class="expert_block">
		 <div class="expert_img"><img src="{{URL::to('/')}}/assets/images/new_14.jpg"></div>
		 <div class="expert_info">
		   <h3>Tours</h3>		  
		   <p>Our Tour Package rates for bus hire are very attractive and our Buses go on tours all around India for Bharat Darshan...</p>
		 
		 </div>		
		</div>	
       </a>		
	 </div>
	 
	 
	 <div class="col-sm-4">
	    <a href="{{URL::Route('get-school-pickups-drops')}}">
	    <div class="expert_block">
		 <div class="expert_img"><img src="{{URL::to('/')}}/assets/images/school_children.jpg"></div>
		 <div class="expert_info">
		   <h3>School Children Pickups And Drops</h3>		  
		   <p>Our modern Buses equipped with GPS Technologies and Cameras will keep a track of the Buses and under surveillance...</p>
		 
		 </div>		
		</div>	
       </a>		
	 </div>
	 
	 
	 
	 <div class="col-sm-4">
	   <a href="{{URl::Route('get-chattered-services')}}">
	    <div class="expert_block">
		 <div class="expert_img"><img src="{{URL::to('/')}}/assets/images/new_19.jpg"></div>
		 <div class="expert_info">
		   <h3>Chattered Services</h3>		  
		   <p>Now you can charter your own bus to carry your passengers for conferences, Meetings, AGMs, Social Events, etc. We offer...</p>
		 </div>		
		</div>	
      </a>		
	 </div>
	 
	 
	 
	 
	</div>
   
  </div>
  

</section>

<section class="glams_work_slder_blk">
  <div class="container">
  <h2 class="landing_text-head">Our Image Gallery </h2>
	
	   <div class="owl-carousel owl-theme glams_work_sldr">           
		 <div class="item">
		   <div class="sldr_indi_block"><img src="{{URL::to('/')}}/assets/images/ga_1.jpg" height=''></div>
		 </div>  
 <div class="item">
		   <div class="sldr_indi_block"><img src="{{URL::to('/')}}/assets/images/ga_2.jpg"></div>
		 </div>    
 <!--<div class="item">
		   <div class="sldr_indi_block"><img src="{{URL::to('/')}}/assets/images/ga_3.jpg"></div>
		 </div>  -->  
 <div class="item">
		   <div class="sldr_indi_block"><img src="{{URL::to('/')}}/assets/images/ga_4.jpg"></div>
		 </div>    
 <div class="item">
		   <div class="sldr_indi_block"><img src="{{URL::to('/')}}/assets/images/ga_5.jpg"></div>
		 </div>    
 <div class="item">
		   <div class="sldr_indi_block"><img src="{{URL::to('/')}}/assets/images/ga_6.jpg"></div>
		 </div>   

     
		 
		 <div class="item">
		   <div class="sldr_indi_block"><img src="{{URL::to('/')}}/assets/images/ga_7.jpg"></div>
		 </div> 
		 
		 <div class="item">
		   <div class="sldr_indi_block"><img src="{{URL::to('/')}}/assets/images/ga_8.jpg"></div>
		 </div> 
		 
		 <div class="item">
		   <div class="sldr_indi_block"><img src="{{URL::to('/')}}/assets/images/ga_9.jpg"></div>
		 </div> 
		 
		 <div class="item">
		   <div class="sldr_indi_block"><img src="{{URL::to('/')}}/assets/images/ga_10.jpg"></div>
		 </div> 
		 
		 <!--<div class="item">
		   <div class="sldr_indi_block"><img src="{{URL::to('/')}}/assets/images/ga_11.jpg"></div>
		 </div>-->
		 
		 <div class="item">
		   <div class="sldr_indi_block"><img src="{{URL::to('/')}}/assets/images/ga_12.jpg"></div>
		 </div>
		 
		 <div class="item">
		   <div class="sldr_indi_block"><img src="{{URL::to('/')}}/assets/images/ga_13.jpg"></div>
		 </div>
 		 
	   </div>  
  </div>
</section>
</div>
@stop