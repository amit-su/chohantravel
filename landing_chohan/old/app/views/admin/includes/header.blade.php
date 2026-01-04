<link href="{{URL::to('/')}}/assets/admin/css/bootstrap.min.css" rel='stylesheet' type='text/css' />
<!-- Custom Theme files -->
<link href="{{URL::to('/')}}/assets/admin/css/style.css" rel='stylesheet' type='text/css' />
<link href="{{URL::to('/')}}/assets/admin/css/font-awesome.css" rel="stylesheet"> 
<script src="{{URL::to('/')}}/assets/admin/js/jquery.min.js"> </script>
<script src="{{URL::to('/')}}/assets/admin/js/bootstrap.min.js"> </script>
  
<!-- Mainly scripts -->
<script src="{{URL::to('/')}}/assets/admin/js/jquery.metisMenu.js"></script>
<script src="{{URL::to('/')}}/assets/admin/js/jquery.slimscroll.min.js"></script>
<!-- Custom and plugin javascript -->
<link href="{{URL::to('/')}}/assets/admin/css/custom.css" rel="stylesheet">
<script src="{{URL::to('/')}}/assets/admin/js/custom.js"></script>
<script src="{{URL::to('/')}}/assets/admin/js/screenfull.js"></script>
		<script>
		$(function () {
			$('#supported').text('Supported/allowed: ' + !!screenfull.enabled);

			if (!screenfull.enabled) {
				return false;
			}

			

			$('#toggle').click(function () {
				screenfull.toggle($('#container')[0]);
			});
			

			
		});
		</script>

<!----->