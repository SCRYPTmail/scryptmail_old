
<body id="login">
<!-- possible classes: minified, no-right-panel, fixed-ribbon, fixed-header, fixed-width-->
<header id="header">
	<!--<span id="logo"></span>-->

	<span id="logo"> <a href="/"> <img src="img/scriptmail_logo.png" alt="<?php echo Yii::app()->name; ?>"></a> </span>

	<span id="extr-page-header-space"> <span class="hidden-mobile"></span> <a href="login"
																								 class="btn btn-default">Sign
			In</a> </span>

</header>

<div id="main" role="main">
<div id="incomp" class="alert alert-warning fade in" style="display:none;">
	<button class="close" data-dismiss="alert">
		×
	</button>
	<i class="fa-fw fa fa-warning"></i>
	<strong>Warning: </strong><span></span>
</div>

<!-- MAIN CONTENT -->
<div id="content" class="container">

	<div class="row">
		<div class="row">
			<div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 hidden-xs hidden-sm">
				<h1 class="txt-color-red login-header-big">Welcome to scryptmail.com</h1>

				<div class="hero">

					<div class="pull-left">
						Privacy is your right, not a privilege<br><br>
						<h2 class="paragraph-header txt-color-green">
							We are open and welcome you to try our new service!

						</h2>
						Feel free to read about our service, but Hurry! We have limited registration.
						<div class="login-app-icons">
							<a href="http://blog.scryptmail.com/post/103536268805/scryptmail-features" target="_blank" class="btn btn-primary btn-sm">Why we are different</a>
							<a href="http://blog.scryptmail.com" target="_blank" class="btn btn-primary btn-sm" style="margin-left:20px;">Blog</a>
						</div>
					</div>

				</div>


					<div class="well col-xs-12 col-sm-12 col-md-12 col-lg-12 hidden-xs hidden-sm" style="border:0px solid;">
					<i class="fa fa-exclamation txt-color-yellow fa-lg"></i> Did you know that the first 500 registered users will get a Free Advanced account for a year?
					</div>


			</div>

		<div class="col-xs-12 col-sm-12 col-md-5 col-lg-5">
			<div class="well no-padding">
				<!--<div class="smart-form client-form" id="smart-form-register">-->
				<form action="/submitBug" id="createUser-form" class="smart-form" novalidate="novalidate" method="POST">

					<header>
						Limited public registration until<span class="text-danger pull-right"><?php echo $totalUser;?> <span class="txt-color-blueDark"></span></span>
						<br><a href="http://blog.scryptmail.com/post/103842937050/scryptmail-browser-compatibility" target="_blank"> Supported Browsers</a>
					</header>

					<fieldset>

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


							<p class="note">Secret Word used to encrypt your keys before sending it to server (6-80
								characters). We are strongly recommend to use special characters!</p>
						</section>

						<section>
							<label class="checkbox" id="terError">
								By clicking Register, I agree with the <a href="#" data-toggle="modal" data-target="#myModal"> Terms
									and Conditions </a></label>
						</section>
					</fieldset>

					<footer>

						<button id='reguser' class="btn btn-primary btn-lg" onclick="createAccount();" name="yt0" type="button" >Register</button>
						<p style="margin-top:9px;display:block;">If it's not responding for more than a minute, please use Google Chrome</p>
					</footer>

				</form>
			</div>

			<div><a href="https://twitter.com/scryptmail" target="_blank" class="twitter-follow-button pull-right btn btn-default btn-xs" data-show-count="false"><i class="fa fa-twitter txt-color-blue"></i> Follow us @scryptmail</a></div>
		</div>
	</div>
	<div class="" style="margin-top:100px;">
		<div class="row">
			<div class="col-lg-12 text-align-center">
				<span class="txt-color-black">SCRYPTmail © 2014 - </span>
				<a href="/termofservice" target="_blank"><span class="txt-color-black">Term of Service</span></a>

				<a href="/privacypolicy" target="_blank"><span class="txt-color-black">Privacy Policy</span></a>


			</div>

		</div>
		<!-- end row -->
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
					Before login, please <b>download secret token</b>. You will need this token, to reset your password or secret phrase. You can read more about it in our <a href="http://blog.scryptmail.com/post/103615273685/guide-to-reset-secret-phrase-password" target="_blank">blog</a><br><br>
<span class="text-danger" style="display:none;" id="browsfailed"><i class="fa fa-warning"></i> If your browser can't save this file, please save this string into file:<br> <b class="text-default" style="word-break:break-all;"></b></span>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" id="token"
							onclick='downloadToken();'>
						<i class="fa fa-save"></i> Download Token
					</button>

					<button type="button" class="btn btn-primary" data-dismiss="modal" disabled="disabled" id="y-agree"
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
				<h4 class="modal-title" id="myModalLabel">Terms & Conditions for ScryptMail.com</h4>
			</div>
			<div class="modal-body custom-scroll terms-body">

				<div id="left">
					<h2>Introduction</h2>

					<p>These terms and conditions govern your use of this website; by using this website, you accept these terms and conditions in full and without reservation. If you disagree with these terms and conditions or any part of these terms and conditions, you must not use this website.</p>

					<p>You must be at least 18 [eighteen] years of age to use this website.  By using this website and by agreeing to these terms and conditions, you warrant and represent that you are at least 18 years of age.</p>


					<h2>License to use website</h2>
					<p>Unless otherwise stated, SCRYPTmail.com and/or its licensors own the intellectual property rights published on this website and materials used on SCRYPTmail.com.  Subject to the license below, all these intellectual property rights are reserved.</p>

					<p>You may view, download for caching purposes only, and print pages, files or other content from the website for your own personal use, subject to the restrictions set out below and elsewhere in these terms and conditions.</p>

					<p>You must not:</p>
					<ul>
						<li>republish material from this website in neither print nor digital media or documents (including republication on another website);</li>
						<li>sell, rent or sub-license material from the website;</li>
						<li>reproduce, duplicate, copy or otherwise exploit material on this website for a commercial purpose;</li>
						<li>edit or otherwise modify any material on the website;</li>
						<li>redistribute material from this website - except for content specifically and expressly made available for redistribution; or</li>
						<li>republish or reproduce any part of this website through the use of iframes or screenscrapers.</li>
					</ul>
					<p>Where content is specifically made available for redistribution, it may only be redistributed within your organisation.</p>

					<h2>Acceptable use</h2>

					<p>You must not use this website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of SCRYPTmail.com or in any way which is unlawful, illegal, fraudulent or harmful, or in connection with any unlawful, illegal, fraudulent or harmful purpose or activity.</p>

					<p>You must not use this website to copy, store, host, transmit, send, use, publish or distribute any material which consists of (or is linked to) any spyware, computer virus, Trojan horse, worm, keystroke logger, rootkit or other malicious computer software.</p>

					<p>You must not conduct any systematic or automated data collection activities on or in relation to this website without SCRYPTmail.com's express written consent.<br />
						This includes:
					<ul><li>scraping</li>
						<li>data mining</li>
						<li>data extraction</li>
						<li>data harvesting</li>
						<li>'framing' (iframes)</li>
						<li>Article 'Spinning'</li>
					</ul>
					</p>

					<p>You must not use this website or any part of it to transmit or send unsolicited commercial communications.</p>

					<p>You must not use this website for any purposes related to marketing without the express written consent of SCRYPTmail.com.</p>

					<!-- If password protected areas BEGIN -->
					<h2>Restricted access</h2>

					<p>Access to certain areas of this website is restricted. SCRYPTmail.com reserves the right to restrict access to certain areas of this website, or at our discretion, this entire website. SCRYPTmail.com may change or modify this policy without notice.</p>

					<p>If SCRYPTmail.com provides you with a user ID and password to enable you to access restricted areas of this website or other content or services, you must ensure that the user ID and password are kept confidential. You alone are responsible for your password and user ID security..</p>

					<p>SCRYPTmail.com may disable your user ID and password at SCRYPTmail.com's sole discretion without notice or explanation.</p>

					<h2>User content</h2>

					<p>In these terms and conditions, “your user content” means material (including without limitation text, images, audio material, video material and audio-visual material) that you submit to this website, for whatever purpose.</p>

					<p>Your user content must not be illegal or unlawful, must not infringe any third party's legal rights, and must not be capable of giving rise to legal action whether against you or SCRYPTmail.com or a third party (in each case under any applicable law).</p>

					<p>You must not submit any user content to the website that is or has ever been the subject of any threatened or actual legal proceedings or other similar complaint.</p>

					<p>SCRYPTmail.com reserves the right to edit or remove any material submitted to this website, or stored on the servers of SCRYPTmail.com, or hosted or published upon this website.</p>

					<p>SCRYPTmail.com's rights under these terms and conditions in relation to user content, SCRYPTmail.com does not undertake to monitor the submission of such content to, or the publication of such content on, this website.</p>

					<h2>No warranties</h2>

					<p>This website is provided “as is” without any representations or warranties, express or implied.  SCRYPTmail.com makes no representations or warranties in relation to this website or the information and materials provided on this website.</p>

					<p>Without prejudice to the generality of the foregoing paragraph, SCRYPTmail.com does not warrant that:</p>
					<ul>
						<li>this website will be constantly available, or available at all; or</li>
						<li>the information on this website is complete, true, accurate or non-misleading.</li>
					</ul>
					<p>Nothing on this website constitutes, or is meant to constitute, advice of any kind.  If you require advice in relation to any legal, financial or medical matter you should consult an appropriate professional.</p>

					<h2>Limitations of liability</h2>

					<p>SCRYPTmail.com will not be liable to you (whether under the law of contact, the law of torts or otherwise) in relation to the contents of, or use of, or otherwise in connection with, this website:</p>
					<ul>
						<li>to the extent that the website is provided free-of-charge, for any direct loss;</li>
						<li>for any indirect, special or consequential loss; or</li>
						<li>for any business losses, loss of revenue, income, profits or anticipated savings, loss of contracts or business relationships, loss of reputation or goodwill, or loss or corruption of information or data.</li>
					</ul>
					<p>These limitations of liability apply even if SCRYPTmail.com has been expressly advised of the potential loss.</p>

					<h2>Exceptions</h2>

					<p>Nothing in this website disclaimer will exclude or limit any warranty implied by law that it would be unlawful to exclude or limit; and nothing in this website disclaimer will exclude or limit the liability of SCRYPTmail in respect of any:</p>
					<ul>
						<li>death or personal injury caused by the negligence of SCRYPTmail.com or its agents, employees or shareholders/owners;</li>
						<li>fraud or fraudulent misrepresentation on the part of SCRYPTmail.com; or</li>
						<li>matter which it would be illegal or unlawful for SCRYPTmail.com to exclude or limit, or to attempt or purport to exclude or limit, its liability.</li>
					</ul>
					<h2>Reasonableness</h2>

					<p>By using this website, you agree that the exclusions and limitations of liability set out in this website disclaimer are reasonable.</p>

					<p>If you do not think they are reasonable, you must not use this website.</p>

					<h2>Other parties</h2>

					<p>You accept that, as a limited liability entity, SCRYPTmail.com has an interest in limiting the personal liability of its officers and employees.  You agree that you will not bring any claim personally against SCRYPTmail.com's officers or employees in respect of any losses you suffer in connection with the website.</p>

					<p>Without prejudice to the foregoing paragraph, you agree that the limitations of warranties and liability set out in this website disclaimer will protect SCRYPTmail.com's officers, employees, agents, subsidiaries, successors, assigns and sub-contractors as well as SCRYPTmail.com.</p>

					<h2>Unenforceable provisions</h2>

					<p>If any provision of this website disclaimer is, or is found to be, unenforceable under applicable law, that will not affect the enforceability of the other provisions of this website disclaimer.</p>

					<h2>Indemnity</h2>

					<p>You hereby indemnify SCRYPTmail.com and undertake to keep SCRYPTmail.com indemnified against any losses, damages, costs, liabilities and expenses (including without limitation legal expenses and any amounts paid by SCRYPTmail.com to a third party in settlement of a claim or dispute on the advice of SCRYPTmail.com's legal advisers) incurred or suffered by SCRYPTmail.com arising out of any breach by you of any provision of these terms and conditions, or arising out of any claim that you have breached any provision of these terms and conditions.</p>

					<h2>Breaches of these terms and conditions</h2>

					<p>Without prejudice to SCRYPTmail.com's other rights under these terms and conditions, if you breach these terms and conditions in any way, SCRYPTmail.com may take such action as SCRYPTmail.com deems appropriate to deal with the breach, including suspending your access to the website, prohibiting you from accessing the website, blocking computers using your IP address from accessing the website, contacting your internet service provider to request that they block your access to the website and/or bringing court proceedings against you.</p>

					<h2>Variation</h2>

					<p>SCRYPTmail.com may revise these terms and conditions from time-to-time.  Revised terms and conditions will apply to the use of this website from the date of the publication of the revised terms and conditions on this website.  Please check this page regularly to ensure you are familiar with the current version.</p>

					<h2>Assignment</h2>

					<p>SCRYPTmail.com may transfer, sub-contract or otherwise deal with SCRYPTmail.com's rights and/or obligations under these terms and conditions without notifying you or obtaining your consent.</p>

					<p>You may not transfer, sub-contract or otherwise deal with your rights and/or obligations under these terms and conditions.</p>

					<h2>Severability</h2>

					<p>If a provision of these terms and conditions is determined by any court or other competent authority to be unlawful and/or unenforceable, the other provisions will continue in effect.  If any unlawful and/or unenforceable provision would be lawful or enforceable if part of it were deleted, that part will be deemed to be deleted, and the rest of the provision will continue in effect.</p>

					<h2>Entire agreement</h2>

					<p>These terms and conditions, together with SCRYPTmail.com's Privacy Policy constitute the entire agreement between you and SCRYPTmail.com in relation to your use of this website, and supersede all previous agreements in respect of your use of this website.</p>

					<h2>Law and jurisdiction</h2>

					<p>These terms and conditions will be governed by and construed in accordance with the laws of WASHINGTON, USA, and any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of WASHINGTON, USA.</p>


				</div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal-dialog -->
	</div>
	<!-- /.modal -->
</div>

</div>

</body>
