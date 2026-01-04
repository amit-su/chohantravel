@extends('main')
@section('content')
<div id="map_wrapper">
<div id="map_canvas" class="mapping"></div>
</div>
<div id="content" class="pt0 pb0">
 
  <div class="feature-box centered">
    <div>
      <div class="container">
        <div class="row justify-content-md-center">
          <div class="col col-lg-12 col-xl-10">
            <div class="row">
              <div class="col-md-3">
                <div class="content-box">
                  <div class="image"> <img src="assets/img/demo/icons/1.png" width="100" alt=""> </div>
                  <h4>Book A Property Trip</h4>
                  <div class="caption">Create your best-ever home with the latest trends in renovating, decorating and more.</div>
                  <div class="button"><a href="{{URL::Route('get-book-trip')}}">BOOK</a></div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="content-box">
                  <div class="image"> <img src="assets/img/demo/icons/2.png" width="100" alt=""> </div>
                  <h4>Schedule Internet Conference.</h4>
                  <div class="caption">Thinking abroad? You can now dream and discover international properties.</div>
                  <div class="button"><a href="#">BOOK</a></div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="content-box">
                  <div class="image"> <img src="assets/img/demo/icons/3.png" width="100" alt=""> </div>
                  <h4>Secure your land.</h4>
                  <div class="caption">Understand your local market, learn how to get the best price for your property and find agents in your area.</div>
                  <div class="button"><a href="#">BOOK</a></div>
                </div>
              </div>

              <div class="col-md-3">
                <div class="content-box">
                  <div class="image"> <img src="assets/img/demo/icons/3.png" width="100" alt=""> </div>
                  <h4>Build A Cottage</h4>
                  <div class="caption">Understand your local market, learn how to get the best price for your property and find agents in your area.</div>
                  <div class="button"><a href="#">BOOK</a></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


  <div class="feature-box centered">
    <div>
      <div class="container">
        <div class="row justify-content-md-center">
          <div class="col col-lg-12 col-xl-10">
            <div class="row">
              <div class="col-md-6">
                <div class="content-box">
                  <div class="image"> <img src="assets/img/demo/icons/1.png" width="100" alt=""> </div>
                  <h4>Develop A Farm</h4>
                  <div class="caption">Create your best-ever home with the latest trends in renovating, decorating and more.</div>
                  <div class="button"><a href="#">BOOK</a></div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="content-box">
                  <div class="image"> <img src="assets/img/demo/icons/2.png" width="100" alt=""> </div>
                  <h4>Land Survey & Soil Test</h4>
                  <div class="caption">Thinking abroad? You can now dream and discover international properties.</div>
                  <div class="button"><a href="#">BOOK</a></div>
                </div>
              </div>
              

              

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.3.0/js/bootstrap-datepicker.js"></script>
<script>
$(function () {
  $("#datepicker").datepicker({ 
        autoclose: true, 
        todayHighlight: true
  }).datepicker('update', new Date());
});
</script>
@stop
