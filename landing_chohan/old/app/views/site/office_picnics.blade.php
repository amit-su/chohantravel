@extends('site.main')
@section('content')
<section class="inner_static_banner" style="background:url({{URL::to('/')}}/assets/images/banner1.jpg) no-repeat center top;background-size:cover;  background-position:70% 60%">
<div class="img-top-shadow"></div>
<div class="banner_text">
<h2>Chohan Tours and Travel</h2>
<p>We provide buses for office picnics</p>
</div>

</section>
<section class="service_info_blk">
 <div class="container">
  <div class="row">
    <div class="col-sm-12">
	 <div class="text_blk">
	   <h1>Office Picnics</h1>
	   <p>We cater to Corporates for their Annual Picnics through our Luxury Coaches to various Picnic Points in and around Kolkata with very reasonable and competitive rates and efficient Staff.</p>
	   <p><a href='{{URL::Route("get-contact-us")}}' class="book_nw_btn">Book Now</a></p>
	 </div>
	</div>
   
  </div>
 </div>
</section>	


@stop
