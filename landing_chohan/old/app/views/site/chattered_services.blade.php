@extends('site.main')
@section('content')
<section class="inner_static_banner" style="background:url({{URL::to('/')}}/assets/images/new_6.jpg) no-repeat center top;background-size:cover;  background-position:70% 60%">
<div class="img-top-shadow"></div>
<div class="banner_text">
<h2>Chohan Tours and Travel</h2>
<p>We provide buses for chattered services</p>
</div>

</section>
<section class="service_info_blk">
 <div class="container">
  <div class="row">
    <div class="col-sm-12">
	 <div class="text_blk">
	   <h1>Chattered Services</h1>
	   <p>Now you can charter your own bus to carry your passengers for conferences, Meetings, AGMs, Social Events, etc. We offer services to the client’s satisfaction, to meet the growing and varied needs of the travel trade, whenever and wherever you like. Our Billing methods based on hourly and Kilometer charges will help you save a lot of money.</p>
	   <p><a href='{{URL::Route("get-contact-us")}}' class='book_nw_btn'>Book Now</a></p>
	 </div>
	</div>
   
  </div>
 </div>
</section>	


@stop
