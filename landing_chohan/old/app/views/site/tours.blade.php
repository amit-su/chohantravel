@extends('site.main')
@section('content')
<section class="inner_static_banner" style="background:url({{URL::to('/')}}/assets/images/new_13.jpg) no-repeat center top;background-size:cover;  background-position:70% 60%">
<div class="img-top-shadow"></div>
<div class="banner_text">
<h2>Chohan Tours and Travel</h2>
<p>We provide buses for tours</p>
</div>

</section>
<section class="service_info_blk">
 <div class="container">
  <div class="row">
    <div class="col-sm-12">
	 <div class="text_blk">
	   <h1>Tours</h1>
	   <p>Our Tour Package rates for bus hire are very attractive and our Buses go on tours all around India for Bharat Darshan, pilgrimages etc. We provide Buses on tour for families and groups who want to travel and visit places in India with very safe reliable and well informed drivers and attendants who are well acquainted with the Highway Roads of India. </p>
	   <p><a href='{{URL::Route("get-contact-us")}}' class='book_nw_btn'>Book Now</a></p>
	 </div>
	</div>
   
  </div>
 </div>
</section>	


@stop
