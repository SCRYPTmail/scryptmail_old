
		<div class="row">

			<div class="col-xs-12 col-sm-12 col-md-7 col-lg-8">
				<h1 class="txt-color-red login-header-big">Welcome to scryptmail.com</h1>

				<div class="hero">

					<div class="pull-left">
Privacy is your right, not a privilege<br>

							<h4 class="paragraph-header">
								We are a group of privacy advocates. <br>We believe in the right to freedom of speech, private communication, and innocence until proven guilty.
								<br>Our encrypted email service will protect you from mass surveillance, offer an ad free mailbox and provide state of the art end-to-end encryption.
							</h4>



						<div class="login-app-icons">
							<a href="/about_us" class="btn btn-primary btn-sm">About Us</a>
							<a href="http://blog.scryptmail.com" class="btn btn-primary btn-sm" style="margin-left:20px;">Blog</a>
							<a href="http://blog.scryptmail.com/how-to-use-scryptmail" class="btn btn-primary btn-sm" style="margin-left:20px;">How to use</a>
						</div>
					</div>

				</div>

		</div>

			<div class="col-xs-12 col-sm-12 col-md-5 col-lg-4">
				<div class="well no-padding">
					<div class="smart-form client-form" id="login-form" onkeydown="if (event.keyCode == 13) submitLogin();">

						<header>
							Sign In
							<h5 style="margin-top:10px;"><small><a href="http://blog.scryptmail.com/supported-browsers" target="_blank"> Supported Browsers</a></small></h5>
						</header>

						<fieldset>

							<section>
								<label class="input ">
									<div class="input-group">
										<input type="text" name="uN" id="LoginForm_username" placeholder="email">
										<span class="input-group-addon" id="cremail">@scryptmail.com</span>
									</div>
								</label>


							</section>

							<section>

								<label class="input ">
									<i class="icon-append fa fa-lock"></i>
									<input name="pP" id="LoginForm_password" type="password" placeholder="password">
								</label>

							</section>
							<div class="note">
								<a href="/forgotPassword">Forgot password?</a>
							</div>

						</fieldset>
						<footer>


							<input class="btn btn-primary" onclick="submitLogin();" name="yt0" type="button" value="Sign in">
						</footer>

					</div>

				</div>

				<div><a href="https://twitter.com/scryptmail" target="_blank" class="twitter-follow-button pull-right btn btn-default btn-xs" data-show-count="false"><i class="fa fa-twitter txt-color-blue"></i> Follow us @scryptmail</a></div>
			</div>

			<!--<div class="well col-xs-12 col-sm-12 col-md-12 col-lg-12" style="border:0px solid;">
				<i class="fa fa-exclamation txt-color-yellow fa-lg"></i> SCRYPTmail is looking for writers to help with the blog. If you believe privacy is important and want to be part of scryptmail, please contact us: support@scryptmail.com
					</div>-->
		</div>


		<div class="row" style="text-align:center;margin-top:100px;">



			<h1> Why SCRYPTmail?</h1>
			<div class="row">


					<div class="well col col-lg-10 text-align-left pull-left">
						<h2><span class="glyphicon glyphicon-heart-empty text-danger"></span> Genuine</h2>
			<h5>We promise not to confuse nor misrepresent your security risks.</h5>
						<p>Trust is the cornerstone of any business, but many companies fall short by trying to emphasize benefits and hide downsides. We promise to be transparent and open in order to provide you with objective information about our technologies.</p>
			 						</div>


					<div class="well col col-lg-10 text-align-left pull-right">
						<h2><span class="glyphicon glyphicon-eye-close"></span> Private</h2>
						<h5>Your emails and data are encrypted from the beginning with a secret phrase that never leaves your computer. As a result, we can't scan nor read your emails.</h5>

						<p>SCRYPTmail users have a 2-step verification process to access their account:
						<ul>
							<li>Password verification</li>
							<li>Secret Phrase verification</li>
						</ul>
						Every SCRYPTmail user will need to complete the 2-step verification process in order to send and read emails.</p>
					</div>
				<div class="col col-lg-12 text-align-center">
				<span class="btn btn-info" id="rdm" onclick='$("#morepriv" ).slideToggle( "slow", function(){$( "#rdm" ).remove();});'> Read more</span>
				</div>
</div>
				<div class="row" id="morepriv" style="height:0px;display:none;">

					<div class="well col col-lg-10 text-align-left pull-left">
						<h2><i class="fa fa-times txt-color-red"></i> No scripts from third party servers</h2>
						<h5>Protect yourself.</h5>
						<p>Ever wonder who knows you are here?</p>
						<p>We deliver all scripts from our servers. No Google Analytics, Facebook or twitter. While such scripts can be useful to us as service to track usage, they leak metadata like user information, location and more.</p>
					</div>

					<div class="well col col-lg-10 text-align-left pull-right">
						<h2> PGP standards and NIST recommendations</h2>
						<h5>Standard protocol to exchange public keys between users.</h5>
						<p>
						The email you are about to send will be encrypted by AES with random 256 bit key and then key encrypted with the public key of intended recipient. Only the person with whom you are corresponding private key to will be able to decrypt it. We use only open source encryption libraries to ensure public audit.
						</p>
					</div>



					<div class="well col col-lg-10 col-md-12 col-sm-12 text-align-left pull-left">
						<h2>Grade <strong class="text-success">A</strong> HTTPS encryption *</h2>
						<h5>Heartbleed attack? POODLE or BEAST? - We got you covered.</h5>
						<p>We are regularly testing our service with third party security services to ensure up to date communication protection.
							<br>
						* Based on Qualys SSL <a href="https://www.ssllabs.com/ssltest/index.html" target="_blank">evaluation</a>. </p>
					</div>

					<div class="well col col-lg-10 text-align-left pull-right">
						<h2>Anonymous</h2>
						<h5>Can you be truly anonymous on internet?</h5>
						<p>Unfortunately, the answer is no. In order to establish connection with server, you have to provide an IP address that can be tracked back to your computer. It does not matter if we store logs or not because that is what your provider does.
						</p>
					</div>

					<div class="well col col-lg-10 text-align-left pull-left">
						<h2>Freedom and Simplicity</h2>
						<h5>Who told you that privacy should be compromised for simplicity?</h5>
						<p>We spent a lot of time making a simple but well protected tool. We won't overwhelm you with knobs and switches, but we won't repel you either. Features will be added to your settings panel and will have default values until you decide to change them.
							<br>We also will give you access to regenerate your RSA keys anytime you want or even let you save them offline.
						</p>
					</div>

					<div class="well col col-lg-10 text-align-left pull-right">
						<h2>Communication with Gmail or YAHOO</h2>
						<h5>Send email in clear text or encrypted text.</h5>
						<p>Clear text messages will be deleted from our servers immediately after successful delivery to the recipient’s domain. Encrypted messages will require PIN to unlock and decrypt. You provide this PIN via another means of communication like in a phone call, via text or in person.</p>
					</div>


					<div class="well col col-lg-10 text-align-left pull-left">
						<h2>Encrypted</h2>
						<h5>We mean it, no half measures. Your message encrypted from start to finish.</h5>
						<p>Many similar services advertise email encryption, but not all of them truly encrypt your emails. Attachments, recipients, other metadata often are left in clear text. We encrypt all of it!*
						<br>
						* Not applicable if you are sending an email to third party servers.</p>
					</div>



			</div>


