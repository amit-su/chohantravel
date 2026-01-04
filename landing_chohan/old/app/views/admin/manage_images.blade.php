
<!DOCTYPE HTML>
<html>

<head>
<title>Chohan - Gallery</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="keywords" content="Minimal Responsive web template, Bootstrap Web Templates, Flat Web Templates, Android Compatible web template, 
Smartphone Compatible web template, free webdesigns for Nokia, Samsung, LG, SonyEricsson, Motorola web design" />
<script type="application/x-javascript"> addEventListener("load", function() { setTimeout(hideURLbar, 0); }, false); function hideURLbar(){ window.scrollTo(0,1); } </script>
@include('admin.includes.header')
<style>
#loader{
	display:none;
}
</style>
</head>
<body>
<div id="wrapper">
        <!----->
        @include('admin.includes.sidebar')
		 <div id="page-wrapper" class="gray-bg dashbard-1">
       <div class="content-main">
 
 	<!--banner-->	
	<!---728x90--->
		    <div class="banner">
		    	<h2>
			<a href="{{URL::Route('get-admin-dashboard')}}">Dashboard</a>
			<i class="fa fa-angle-right"></i>
				<span>Gallery</span>
				</h2>
		    </div>
			<!---728x90--->
		<!--//banner-->
 	 <!--gallery-->
	 <div class="col-sm-12">
	 <div class='grid-form1'>
  	<h3>Gallery Images</h3>
  	         
      <div class="form-group">
        <label for="exampleInputFile">Upload New Image</label>
        <input type="file" id="image"> 
        <p class="help-block">Just browse image, and it will be uploaded <span id='loader'> Uploading image ... <img src='{{URL::to("/")}}/assets/images/default-loading.gif'></span></p>
		
      </div>
	  </div>
</div>
 	 <div class="gallery">
	   @if($cat->images)
		  @foreach($cat->images as $image)
			<div class="col-md">
				<div class="gallery-img">
				<a href="{{URL::to('/')}}/assets/images/{{$image->name}}" class="b-link-stripe b-animate-go  swipebox"  title="Image Title" >
					 <img class="img-responsive imageH" src="{{URL::to('/')}}/assets/images/{{$image->name}}" alt="">   
						<span class="zoom-icon"> </span> </a>
				</a>
				</div>	
				<div class="text-gallery">
					<button class='delete' data-id="{{Crypt::encrypt($image->id)}}">Delete</button>
				</div>
			</div>
		@endforeach
		@endif
 	 	
 	 	
 	 	
 	 	 <div class="clearfix"> </div>
 	 </div>
	 <!---728x90--->
	<!--//gallery-->
		<!---->
<link rel="stylesheet" href="{{URL::to('/')}}/assets/admin/css/swipebox.css">
	<script src="{{URL::to('/')}}/assets/admin/js/jquery.swipebox.min.js"></script> 
	    <script type="text/javascript">
			jQuery(function($) {
				$(".swipebox").swipebox();
			});
</script>
<!--scrolling js-->
	<script src="{{URL::to('/')}}/assets/admin/js/jquery.nicescroll.js"></script>
	<script src="{{URL::to('/')}}/assets/admin/js/scripts.js"></script>
	<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
<script>
var base_url = "{{URL::to('/')}}";
var cat_id = "{{$cat->id}}";
$("#image").change(function(){
   		$('#loader').show();
   		readURL(this);
   });
   
   function readURL(input) {
   		
   		var file_data = $("#image").prop("files")[0];   // Getting the properties of file from file field
   		var form_data = new FormData();                  // Creating object of FormData class
   		form_data.append("file", file_data);
   		form_data.append("gallery_id",cat_id);
   		$('#loader').show();
   		$.ajax({
    
   			 //Getting the url of the uploadphp from action attr of form 
   			 //this means currently selected element which is our form 
   			 url: base_url+'/admin/upload-image',
   			 
   			 //For file upload we use post request
   			 type: "POST",
   			 
   			 //Creating data from form 
   			 data: form_data,
   			 
   			 //Setting these to false because we are sending a multipart request
   			 contentType: false,
   			 cache: false,
   			 processData: false,
   			 success: function(data){
   				
   			    if(data.status == 1)
   				{
					window.location.reload();
   					/* if (input.files && input.files[0]) {
   						var reader = new FileReader();
   
   						reader.onload = function (e) {
   							$('#profile_image_preview').attr('src', e.target.result);
   						}
   
   						reader.readAsDataURL(input.files[0]);
   					}
   					$('#profile_image_loader').addClass("hidden");
   					window.location.reload(); */
					console.log(data);
   				}
   				else{
   					//console.log(data);
					alert("Image not uploaded, too big to upload");
					//window.location.reload();
   				}
   			 },
   			 error: function(){
   				//console.log(data);
				alert("Image not uploaded, too big to upload");
					//window.location.reload();
   			 }
   		});
   	}
	$('.delete').click(function(){
		var id = $(this).attr("data-id");
		swal({
			  title: "Are you sure you want to delete?",
			  text: "This image",
			  icon: "warning",
			  buttons: true,
			  dangerMode: true,
			})
			.then((willDelete) => {
			  if (willDelete) {
				 $.post(base_url+'/admin/delete-gallery-image',{id:id},function(data){
					 if(data.status == 1)
					 {
						 swal(data.data, {
						  icon4: "success", 
						});
						window.location.reload();
					 }
					 else{
						 swal(data.data, {
						  icon4: "error", 
						});
						window.location.reload();
					 }
				 });
				
			  } 
			});
	});
	
	
</script>
</body>

</html>

