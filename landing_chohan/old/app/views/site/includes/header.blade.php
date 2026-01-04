<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0">
<title>Chohan Travel</title><link rel="apple-touch-icon" sizes="57x57" href="{{URL::to('/')}}/assets/images/apple-icon-57x57.png"><link rel="apple-touch-icon" sizes="60x60" href="{{URL::to('/')}}/assets/images/apple-icon-60x60.png"><link rel="apple-touch-icon" sizes="72x72" href="{{URL::to('/')}}/assets/images/apple-icon-72x72.png"><link rel="apple-touch-icon" sizes="76x76" href="{{URL::to('/')}}/assets/images/apple-icon-76x76.png"><link rel="apple-touch-icon" sizes="114x114" href="{{URL::to('/')}}/assets/images/apple-icon-114x114.png"><link rel="apple-touch-icon" sizes="120x120" href="{{URL::to('/')}}/assets/images/apple-icon-120x120.png"><link rel="apple-touch-icon" sizes="144x144" href="{{URL::to('/')}}/assets/images/apple-icon-144x144.png"><link rel="apple-touch-icon" sizes="152x152" href="{{URL::to('/')}}/assets/images/apple-icon-152x152.png"><link rel="apple-touch-icon" sizes="180x180" href="{{URL::to('/')}}/assets/images/apple-icon-180x180.png"><link rel="icon" type="image/png" sizes="192x192"  href="{{URL::to('/')}}/assets/images/android-icon-192x192.png"><link rel="icon" type="image/png" sizes="32x32" href="{{URL::to('/')}}/assets/images/favicon-32x32.png"><link rel="icon" type="image/png" sizes="96x96" href="{{URL::to('/')}}/assets/images/favicon-96x96.png"><link rel="icon" type="image/png" sizes="16x16" href="{{URL::to('/')}}/assets/images/favicon-16x16.png"><link rel="manifest" href="{{URL::to('/')}}/assets/images/manifest.json"><meta name="msapplication-TileColor" content="#ffffff"><meta name="msapplication-TileImage" content="{{URL::to('/')}}/assets/images/ms-icon-144x144.png"><meta name="theme-color" content="#ffffff">
<link href="{{URL::to('/')}}/assets/css/chohan.css" rel="stylesheet" type="text/css">  
<link href="{{URL::to('/')}}/assets/css/font-awesome.min.css" rel="stylesheet" type="text/css">  
<link href="{{URL::to('/')}}/assets/css/bootstrap.min.css" rel="stylesheet" type="text/css">
<link href="{{URL::to('/')}}/assets/css/chohan_slider.min.css" rel="stylesheet" type="text/css">
<link href="{{URL::to('/')}}/assets/css/carousel.css" rel="stylesheet" type="text/css">
<link href="{{URL::to('/')}}/assets/css/animate.min.css" rel="stylesheet" type="text/css">
<link href="{{URL::to('/')}}/assets/css/fresco.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css" rel="stylesheet" media="all">
<link href="{{URL::to('/')}}/assets/css/bootstrap-touch-slider.css" rel="stylesheet">
</head>
<body>
<div class="main_wraper_over">
<div class="main_menu_wrap">
<nav id='cssmenu'>
<div class="logo"><a href='{{URL::Route("get-home")}}'><img src="{{URL::to('/')}}/assets/images/logo.png"></a></div>
<div id="head-mobile"></div>
<div class="button"></div>
<ul>
<li class='active'><a href='{{URL::Route("get-home")}}'>HOME</a></li>
<li><a href='{{URL::Route("get-about-us")}}'>ABOUT us</a></li>
<li><a href='javscript:void(0);'>Services</a>
<ul>
  <li><a href='{{URL::Route("get-marriage-services")}}'>Marriage Services</a></li>
  <li><a href='{{URL::Route("get-school-picnics")}}'>Picnics for schools</a></li>
  <li><a href='{{URL::Route("get-office-picnics")}}'>Picnics for offices</a></li>
  <li><a href='{{URL::Route("get-school-excursions")}}'>School Excursions</a></li>
  <li><a href='{{URL::Route("get-office-pickupsand-drops")}}'>Office Pickups And Drops</a></li>
  <li><a href='{{URL::Route("get-sight-seeing")}}'>Sight Seeings</a></li>
  <li><a href='{{URL::Route("get-tours")}}'>Tours</a></li>
  <li><a href='{{URL::Route("get-school-pickups-drops")}}'>School Children Pickups & Drops</a></li>
  <li><a href='{{URL::Route("get-chattered-services")}}'>Chattered Services</a></li>
</ul>
</li>
@if($cats->count())
<li><a href='javascript:void(0);'>GALLERY</a>

<ul>  
<li><a href='{{URL::Route("get-gallery-images",0)}}'>All Images</a></li>    
@foreach($cats as $cat)
<li><a href='{{URL::Route("get-gallery-images",$cat->id)}}'>{{$cat->name}}</a></li>  
@endforeach    
    
</ul></li>
@endif
<li><a href='{{URL::Route("get-contact-us")}}'>CONTACT</a></li>
</ul>
</nav>
</div>
