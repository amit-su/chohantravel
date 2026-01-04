
<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8"> <![endif]-->
<!--[if !IE]><!-->
<html lang="en">

<head>
	<meta charset="utf-8" />
	<title>CHOHAN PAYMENT SYSTEM| Login Page</title>
	<meta content="width=device-width, initial-scale=1.0" name="viewport" />
	<meta content="" name="description" />
	<meta content="" name="author" />
	
	<!-- ================== BEGIN BASE CSS STYLE ================== -->
	<link href="http://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet">
	<link href="{{URL::to('/')}}/assets/plugins/jquery-ui-1.10.4/themes/base/minified/jquery-ui.min.css" rel="stylesheet" />
	<link href="{{URL::to('/')}}/assets/plugins/bootstrap-3.2.0/css/bootstrap.min.css" rel="stylesheet" />
	<link href="{{URL::to('/')}}/assets/plugins/font-awesome-4.2.0/css/font-awesome.min.css" rel="stylesheet" />
	<link href="{{URL::to('/')}}/assets/css/animate.min.css" rel="stylesheet" />
	<link href="{{URL::to('/')}}/assets/css/style.min.css" rel="stylesheet" />
	<link href="{{URL::to('/')}}/assets/css/style-responsive.min.css" rel="stylesheet" />
	<link href="{{URL::to('/')}}/assets/css/theme/default.css" rel="stylesheet" id="theme" />
	<!-- ================== END BASE CSS STYLE ================== -->
</head>
<body>
	<!-- begin #page-loader -->
	<div id="page-loader" class="fade in"><span class="spinner"></span></div>
	<!-- end #page-loader -->
	
	<!-- begin #page-container -->
	<div id="page-container" class="fade">
	    <!-- begin login -->
        <div class="login bg-black animated fadeInDown">
            <!-- begin brand -->
            <div class="login-header">
                <div class="brand">
                    <span class="logo">Chohan Payment System</span>
                </div>
                <div class="icon">
                    <i class="fa fa-sign-in"></i>
                </div>
            </div>
            <!-- end brand -->
            <div class="login-content">
                
                    <div class="form-group m-b-20">
                        <input type="text" class="form-control input-lg" placeholder="Email Address" id="email"/>
                    </div>
                    <div class="form-group m-b-20">
                        <input type="text" class="form-control input-lg" placeholder="Password" id="password"/>
                    </div>
                    
                    <div class="login-buttons">
                        <button type="submit" class="btn btn-success btn-block btn-lg" id="sign_in">Sign me in</button>
                    </div>
                
            </div>
        </div>
        <!-- end login -->
        
        
	</div>
	<!-- end page container -->
	
	<!-- ================== BEGIN BASE JS ================== -->
	<script src="{{URL::to('/')}}/assets/plugins/jquery-1.8.2/jquery-1.8.2.min.js"></script>
	<script src="{{URL::to('/')}}/assets/plugins/jquery-ui-1.10.4/ui/minified/jquery-ui.min.js"></script>
	<script src="{{URL::to('/')}}/assets/plugins/bootstrap-3.2.0/js/bootstrap.min.js"></script>
	<!--[if lt IE 9]>
		<script src="assets/crossbrowserjs/html5shiv.js"></script>
		<script src="assets/crossbrowserjs/respond.min.js"></script>
		<script src="assets/crossbrowserjs/excanvas.min.js"></script>
	<![endif]-->
	<script src="{{URL::to('/')}}/assets/plugins/slimscroll/jquery.slimscroll.min.js"></script>
	<script src="{{URL::to('/')}}/assets/plugins/jquery-cookie/jquery.cookie.js"></script>
	<!-- ================== END BASE JS ================== -->
	
	<!-- ================== BEGIN PAGE LEVEL JS ================== -->
	<script src="{{URL::to('/')}}/assets/js/apps.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/6.10.2/sweetalert2.all.min.js"></script>
	<!-- ================== END PAGE LEVEL JS ================== -->
	<script>
	     var base_url = "{{URL::to('/')}}";
		$(document).ready(function() {
			App.init();
			
			$('#sign_in').click(function(){
				var email = $('#email').val();
				var password = $('#password').val();
				var flag = 0;
				if(email == "")
				{
					swal(
					  'Oops',
					  'Enter email address',
					  'error'
					);
					return;
				}
				else{
					flag++
				}
				
				
				if(password == "")
				{
					swal(
					  'Oops',
					  'Enter password',
					  'error'
					);
					return;
				}
				else{
					flag++
				}
				
				if(flag == 2)
				{
					$.post(base_url+'/login',{email:email,password:password},function(data){
					   if(data.status == 1)
					   {
						   window.location.replace(base_url+'/add-driver');
					   }
					   else{
						   swal(
							  'Oops',
							  data.data,
							  'error'
							);
					   }
					});
				}
				
			});
		});
	</script>
	
</body>

</html>

