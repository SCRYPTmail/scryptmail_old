<?php
/* @var $this SiteController */
/* @var $model LoginForm */
/* @var $form CActiveForm */

?>
<body class="animated fadeInDown">

<header id="header">


	<span id="logo"> <img src="img/scriptmail_logo.png" style="width:180px;" alt="<?php echo Yii::app()->name; ?>"> </span>


	<span id="extr-page-header-space"> <span class="hidden-mobile"></span> <a href="login"
																			  class="btn btn-default">Sign
			In</a> <a href='createUser'
																							  class="btn btn-danger">Create
			account</a> </span>

</header>

<div id="main" role="main">
	<!-- MAIN CONTENT -->
	<div id="content" class="container">

		<div class="row">
			<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
				<h1 class="txt-color-red login-header-big">Report a Bug</h1>
<?php echo $message; ?>
				<form action="/submitBug" id="order-form" class="smart-form" novalidate="novalidate" method="POST">

					<fieldset>
						<div class="row">
							<section class="col col-6">
								<label class="select">
									<select name="os">
										<option value="0" selected="" disabled="">Operating System</option>
										<option value="Windows">Windows</option>
										<option value="Linux">Linux</option>
										<option value="Mac OC">Mac OC</option>
										<option value="Other">Other</option>
									</select> <i></i> </label>
							</section>
							<section class="col col-6">
								<label class="select">
									<select name="device">
										<option value="0" selected="" disabled="">Device</option>
										<option value="Desktop">Desktop</option>
										<option value="Tablet">Tablet</option>
										<option value="Smartphone">Smartphone</option>
										<option value="Other">Other</option>
									</select> <i></i> </label>
							</section>
						</div>

							<div class="row">
								<section class="col col-6">
									<label class="input"> <i class="icon-append fa fa-envelope-o"></i>
										<input type="name" name="name" placeholder="name" id="hname">
										<input type="email" name="email" placeholder="E-mail">
									</label>
								</section>

							</div>


						<section>
							<label class="textarea"> <i class="icon-append fa fa-comment"></i>
								<textarea rows="5" name="comment" placeholder="Please explain problem (1000 max)"></textarea>
							</label>
						</section>
					</fieldset>
					<footer>
						<button type="submit" class="btn btn-primary">
							Submit Report
						</button>
					</footer>
				</form>

			</div>


		</div>



			<div class="row" style="margin-top:100px;">
				<div class="col-lg-12 text-align-center">
					<span class="txt-color-black">SCRYPTmail © 2014 - </span>
					<a href="/termofservice" target="_blank"><span class="txt-color-black">Term of Service</span></a>

					<a href="/privacypolicy" target="_blank"><span class="txt-color-black">Privacy Policy</span></a>


				</div>

			</div>
			<!-- end row -->

	</div>

</div>
<script src="js/plugin/jquery-validate/jquery.validate.min.js"></script>
<script src="js/plugin/jquery-form/jquery-form.min.js"></script>


<script type="text/javascript">

	$( document ).ready(function() {
		$("#order-form").validate({
			// Rules for form validation
			rules : {

				email : {
					required : true,
					email : true
				},
				os : {
					required : true
				},
				device : {
					required : true
				},
				comment : {
					required : true,
					minlength: 10,
					maxlength: 1000

				}
			},

			// Messages for form validation
			messages : {
				email : {
					required : 'Please enter your email address',
					email : 'Please enter a VALID email address'
				},
				comment : {
					required : 'Please provide information'
				},
				os : {
					required : 'Please select Operation System'
				},
				device : {
					required : 'Please select your device'
				}
			},

			// Do not change code below
			errorPlacement : function(error, element) {
				error.insertAfter(element.parent());
			}
		});
	});




</script>



<!--[if IE 8]>
<h1>Your browser is out of date, please update your browser by going to www.microsoft.com/download</h1>
<![endif]-->
</body>
