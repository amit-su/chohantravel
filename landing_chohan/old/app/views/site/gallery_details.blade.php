@extends('site.main')
@section('content')
<section class="inner_static_banner" style="background:url({{URL::to('/')}}/assets/images/new_14.jpg) no-repeat center top;background-size:cover;  background-position:50%">
<div class="img-top-shadow"></div>
<div class="banner_text">
<h2>Chohan Tours And Travels Gallery</h2>
@if(empty($cat))
  <p>Explore our gallery</p>
@else
	<p>Explore our gallery for {{$cat->name}} buses</p>	
	
@endif

</div>

</section>
<section class="gallery_blk">
 <div class="container">

@if(empty($cat))
  <p>All Images</p>
@else
	 <h1>{{$cat->name}}</h1>
@endif
  <div class="row gallery_spacing">
  @if(empty($cat))
	  @if($images)
		  @foreach($images as $image)
	         
				<div class="col-md-4 col-sm-6">
				 <div class="travel_gallry_colmn">
				 <a href='{{URL::to("/")}}/assets/images/{{$image->name}}'
					 class='fresco'
					 data-fresco-group='example'
					 data-fresco-caption="All Images">
				 <img src="{{URL::to("/")}}/assets/images/{{$image->name}}" class="gl_img">
				 <div class="project__hover__info">
				  <div class="project__action">
				  <h2> <img src="{{URL::to("/")}}/assets/images/{{$image->name}}"></h2>       
				   </div>
				  </div>
				  </a>
				 </div>
			   </div>
			  
	      @endforeach
	  @endif
  @else
	  @if($cat->images)
		  @foreach($cat->images as $cat)
			<div class="col-md-4 col-sm-6">
			 <div class="travel_gallry_colmn">
			 <a href='{{URL::to("/")}}/assets/images/{{$cat->name}}'
				 class='fresco'
				 data-fresco-group='example'
				 data-fresco-caption="{{$cat->name}}">
			 <img src="{{URL::to("/")}}/assets/images/{{$cat->name}}" class="gl_img">
			 <div class="project__hover__info">
			  <div class="project__action">
			  <h2> <img src="{{URL::to("/")}}/assets/images/{{$cat->name}}"></h2>       
			   </div>
			  </div>
			  </a>
			 </div>
		   </div>
		  @endforeach
	  @endif
  @endif
  
   
  
   
  </div>
 </div>

</section>	



@stop
@section('scripts')
<script src="{{URL::to('/')}}/assets/js/fresco.js"></script> 
@stop