
	<div class="row">
		<div class="row">
			<div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 hidden-xs hidden-sm">
				<h1 class="txt-color-red login-header-big">Welcome to scryptmail.com</h1>

				<div class="hero">

					<div class="pull-left">
						Privacy is your right, not a privilege<br><br>
						<h4 class="paragraph-header">
							We are a group of privacy advocates. <br>We believe in the right to freedom of speech, private communication, innocence until proven guilty.
							<br>Our encrypted email service will protect you from mass surveillance, offer an ad free mailbox and provide state of the art end-to-end encryption.
<br><br>
							<i class="fa fa-exclamation txt-color-yellow"></i> Register today before sending yet another unprotected email!
						</h4>


						<div class="login-app-icons">
							<a href="/about_us" class="btn btn-primary btn-sm">About Us</a>
							<a href="http://blog.scryptmail.com" class="btn btn-primary btn-sm" style="margin-left:20px;">Blog</a>
						</div>
					</div>

				</div>


				<!--<div class="well col-xs-12 col-sm-12 col-md-12 col-lg-12 hidden-xs hidden-sm" style="border:0px solid;">
				<i class="fa fa-exclamation txt-color-yellow fa-lg"></i> Did you know that the first 500 registered users will get a Free Advanced account for a year?
					</div>-->


			</div>

		<div class="col-xs-12 col-sm-12 col-md-5 col-lg-5">
			<div class="well no-padding">
				<!--<div class="smart-form client-form" id="smart-form-register">-->
				<form action="/submitBug" id="createUser-form" class="smart-form" novalidate="novalidate" method="POST">

					<header>
						Registration Form
						<span class="pull-right"><a href="http://blog.scryptmail.com/2014/11/scryptmail-browser-compatibility.html" target="_blank"> Supported Browsers</a></span>
					</header>

					<fieldset>
						<!--
						<section>
							<label class="input">
								<input placeholder="Enter invitation code"
									   name="CreateUser[invitation]" id="CreateUser_invitation" type="text" value="<?php echo $token;?>"> </label>
						</section> -->
						<section>
							<label class="input" id="userError">
									<input placeholder="email" maxlength="40"
										 name="email" id="CreateUser_email" type="text">
									<span style="position:absolute;top:0px;right:10px;padding:6px;">@scryptmail.com</span>
							</label>
						</section>

						<div style="clear:both;"></div>

						<section>
							<label class="input"> <i class="icon-append fa fa-lock"></i>
								<input placeholder="password"
									   name="CreateUser[password]" id="CreateUser_password" type="password"> </label>
						</section>

						<section>

							<label class="input" id="passrError"> <i class="icon-append fa fa-lock"></i>
								<input placeholder="confirm password"
									   name="CreateUser[passwordrepeat]" id="CreateUser_passwordrepeat" type="password">
								</label>

						</section>

						<section>
							<label class="input" id="secrError"> <i
									class="icon-append glyphicon glyphicon-eye-close"></i>
								<input placeholder="secret phrase"
									   name="CreateUser[secretword]" id="CreateUser_secretword" type="password">
								</label>
						</section>
						<section>
							<label class="input" id="secrErrorRep"> <i
									class="icon-append glyphicon glyphicon-eye-close"></i>
								<input placeholder="confirm secret phrase"
									   name="CreateUser[secretwordrep]" id="CreateUser_secretwordRep" type="password">
							</label>


							<p class="note">
								Secret Phrase is used to encrypt your keys before sending it to the server (6-80 characters). We strongly recommend using special characters!</p>
						</section>

						<section>
							<label class="checkbox" id="terError">
								By clicking Register, I agree with the <a href="#" data-toggle="modal" data-target="#myModal"> Terms
									and Conditions </a></label>

						</section>
					</fieldset>

					<footer>

						<button id='reguser' class="btn btn-primary btn-lg" onclick="createAccount();" name="yt0" type="button" >Register</button>
						<p style="margin-top:9px;display:block;">If page is not responding for more than a minute, please use Google Chrome.</p>
					</footer>

				</form>
			</div>

			<div><a href="https://twitter.com/scryptmail" target="_blank" class="twitter-follow-button pull-right btn btn-default btn-xs" data-show-count="false"><i class="fa fa-twitter txt-color-blue"></i> Follow us @scryptmail</a></div>
		</div>
	</div>
</div>


<!-- Modal -->
<div class="modal fade" id="yModal" tabindex="-1" role="dialog" aria-labelledby="yModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">
					&times;
				</button>
				<h4 class="modal-title" id="yModalLabel">Thank you for registration!</h4>
			</div>
			<div class="modal-body custom-scroll terms-body">

				<div id="left">
					<!--Please login to your account.-->
					Before logging in, please <b>download the secret token</b>. You will need this token to reset your password or secret phrase. You can read more about it in our <a href="http://blog.scryptmail.com/2014/11/guide-to-reset-secret-phrase-password.html" target="_blank">blog</a>.<br><br>
<span class="text-danger" style="display:none;" id="browsfailed"><i class="fa fa-warning"></i> Some browsers are not able to save the generated file, and this message will show. Please save this string into file:<br> <b class="text-default" style="word-break:break-all;"></b></span>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" id="token"
							onclick='downloadToken();'>
						<i class="fa fa-save"></i> Download Token
					</button>

					<button type="button" class="btn btn-primary" data-dismiss="modal" id="y-agree"
							onclick='javascript: window.location = "login";'>
						<i class="fa fa-check"></i> Ok
					</button>

				</div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal-dialog -->
	</div>
	<!-- /.modal -->
</div>

<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">
					&times;
				</button>
				<h4 class="modal-title" id="myModalLabel">Terms & Conditions for SCRYPTmail</h4>
			</div>
			<div class="modal-body custom-scroll terms-body">

				<div id="left">
								<h2>Introduction</h2>

								<p>By using this site, you agree to abide by the following Terms and Conditions for use for SCRYPTmail. These Terms and Conditions cover all present and future features offered by your SCRYPTmail account, individually and collectively referred to as the "Service".</p>

								<p>This Service is provided exclusively to individuals who are at least 18 years of age or to minors who have obtained parental consent to open and maintain an account. Each user is solely responsible for all of his or her messages sent through the Service. As a condition for using this Service, you agree to not use this Service for any unlawful or prohibited activities. You also agree to be bound by these Terms and Conditions. At its sole discretion, SCRYPTmail may terminate service without cause or notice.</p>

								<p>By using the Service, you agree to abide by all national and international laws and regulations and to not use SCRYPTmail for illegal purposes. You also agree to not disrupt the SCRYPTmail networks and servers. You further agree to not use SCRYPTmail to send spam or junk mail or mailing list emails which contain persons that have not specifically agreed to be included on that list.</p>

								<h2>Account Termination</h2>

								<p>SCRYPTmail may terminate your access to the Service and any related service(s) at any time, with or without cause, with or without notice, effective immediately, for any reason whatsoever. SCRYPTmail has no obligation to store or forward the contents of your account.</p>

								<p>If there is any indication that you are using your account for illegal activity, your account will be terminated immediately and without notice. Activities that are absolutely not tolerated include, but are not limited to, the purchase or sale of substances that are illegal in many jurisdictions, purchase or sale of stolen goods, making threats to person or property, possession or distribution of child pornography, and fraud.</p>


								<p>SCRYPTmail also has no obligations to store messages for accounts that are over their storage quotas. Due to the encrypted nature of SCRYPTmail, you acknowledge that SCRYPTmail has no ability or obligation to recover your data if you misplace your decryption password.</p>


								<h2>Liability</h2>

								<p>SCRYPTmail is still in beta so the Service may include errors. SCRYPTmail may make improvements and changes to the Service at any time without notice. SCRYPTmail does not make any guarantees about the reliability of the Service and does not guarantee the security of user data despite best efforts. The Service is provided “as is” and you agree to not hold SCRYPTmail responsible for any damages that arise as a result of the loss of use, data, or profits connected to the performance of the Service. Furthermore, you will not hold SCRYPTmail liable if confidential material is unintentionally released as the result of a security failure or vulnerability.</p>

								<p>SCRYPTmail will not be liable to you (whether under the law of contact, the law of torts or otherwise) in relation to the contents of, or use of, or otherwise in connection with, this website:</p>
								<ul>
									<li>to the extent that the website is provided free-of-charge, for any direct loss;</li>
									<li>for any indirect, special or consequential loss; or</li>
									<li>for any business losses, loss of revenue, income, profits or anticipated savings, loss of contracts or business relationships, loss of reputation or goodwill, or loss or corruption of information or data.</li>
								</ul>
								<p>These limitations of liability apply even if SCRYPTmail has been expressly advised of the potential loss.</p>

								<h2>Indemnification</h2>

								<p>You agree that SCRYPTmail, its parents, subsidiaries, officers, and employees cannot be held responsible for any third party claim, demand, or damage, including reasonable attorneys’ fees, arising out of your use of this Service.</p>

								<h2>Exceptions</h2>

								<p>Nothing in this website disclaimer will exclude or limit any warranty implied by law that it would be unlawful to exclude or limit; and nothing in this website disclaimer will exclude or limit the liability of ScryptMail in respect of any:</p>
								<ul>
									<li>death or personal injury caused by the negligence of SCRYPTmail or its agents, employees or shareholders/owners;</li>
									<li>fraud or fraudulent misrepresentation on the part of SCRYPTmail; or</li>
									<li>matter which it would be illegal or unlawful for SCRYPTmail to exclude or limit, or to attempt or purport to exclude or limit, its liability.</li>
								</ul>

								<h2>Unenforceable provisions</h2>

								<p>If any provision of this website disclaimer is, or is found to be, unenforceable under applicable law, that will not affect the enforceability of the other provisions of this website disclaimer.</p>


								<h2>Assignment</h2>

								<p>SCRYPTmail may transfer, sub-contract or otherwise deal with SCRYPTmail's rights and/or obligations under these terms and conditions without notifying you or obtaining your consent.</p>

								<p>You may not transfer, sub-contract or otherwise deal with your rights and/or obligations under these terms and conditions.</p>

								<h2>Severability</h2>

								<p>If a provision of these terms and conditions is determined by any court or other competent authority to be unlawful and/or unenforceable, the other provisions will continue in effect.  If any unlawful and/or unenforceable provision would be lawful or enforceable if part of it were deleted, that part will be deemed to be deleted, and the rest of the provision will continue in effect.</p>

								<h2>Entire agreement</h2>

								<p>These terms and conditions, together with SCRYPTmail's Privacy Policy constitute the entire agreement between you and SCRYPTmail in relation to your use of this website, and supersede all previous agreements in respect of your use of this website.</p>

								<h2>Law and jurisdiction</h2>

								<p>These terms and conditions will be governed by and construed in accordance with the laws of state WASHINGTON, USA, and any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of state WASHINGTON, USA.</p>

								<h2>Modifications to Terms of Service</h2>

								<p>SCRYPTmail reserves the right to review and change this agreement at any time.</p>

								<p>These terms and conditions govern your use of this website; by using this website, you accept these terms and conditions in full and without reservation. If you disagree with these terms and conditions or any part of these terms and conditions, you must not use this website.</p>

								<br>
								<h4>Updated December 26, 2014</h4>


				</div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal-dialog -->
	</div>
	<!-- /.modal -->
</div>

	<script type="text/javascript">

		$( document ).ready(function() {
			$('#extr-page-header-space').html('<span id="extr-page-header-space"> <span class="hidden-mobile"></span> <a href="login" class="btn btn-default">Sign		In</a> </span>');


		});

	</script>
