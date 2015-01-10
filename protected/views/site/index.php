<!DOCTYPE html>
<html lang="en-us">
<head>
	<meta charset="UTF-8">
	<title><?php echo Yii::app()->name; ?></title>
	<meta name="description" content="">
	<meta name="author" content="">

	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

	<!-- #CSS Links -->
	<!-- Basic Styles -->

	<!-- #FAVICONS -->
	<link rel="shortcut icon" href="/img/favicon/favicon.ico" type="image/x-icon">
	<link rel="icon" href="/img/favicon/favicon.ico" type="image/x-icon">


</head>

<!--

TABLE OF CONTENTS.

Use search to find needed section.

===================================================================

|  01. #CSS Links                |  all CSS links and file paths  |
|  02. #FAVICONS                 |  Favicon links and file paths  |
|  03. #GOOGLE FONT              |  Google font link              |
|  04. #APP SCREEN / ICONS       |  app icons, screen backdrops   |
|  05. #BODY                     |  body tag                      |
|  06. #HEADER                   |  header tag                    |
|  07. #PROJECTS                 |  project lists                 |
|  08. #TOGGLE LAYOUT BUTTONS    |  layout buttons and actions    |
|  09. #MOBILE                   |  mobile view dropdown          |
|  10. #SEARCH                   |  search field                  |
|  11. #NAVIGATION               |  left panel & navigation       |
|  12. #MAIN PANEL               |  main panel                    |
|  13. #MAIN CONTENT             |  content holder                |
|  14. #PAGE FOOTER              |  page footer                   |
|  15. #SHORTCUT AREA            |  dropdown shortcuts area       |
|  16. #PLUGINS                  |  all scripts and plugins       |

===================================================================

-->

<!-- #BODY -->
<!-- Possible Classes

	* 'smart-skin-{SKIN#}'
	* 'smart-rtl'         - Switch theme mode to RTL (will be avilable from version SmartAdmin 1.5)
	* 'menu-on-top'       - Switch to top navigation (no DOM change required)
	* 'hidden-menu'       - Hides the main menu but still accessable by hovering over left edge
	* 'fixed-header'      - Fixes the header
	* 'fixed-navigation'  - Fixes the main menu
	* 'fixed-ribbon'      - Fixes breadcrumb
	* 'fixed-footer'      - Fixes footer
	* 'container'         - boxed layout mode (non-responsive: will not work with fixed-navigation & fixed-ribbon)
-->
<body class="minified fixed-header fixed-navigation" style="overflow-x:hidden;">

<!-- #HEADER -->
<header id="header">
	<div id="logo-group">
		<!-- PLACE YOUR LOGO HERE -->
		<img src="/img/scriptmail_logo.png" alt="SCRYPTmail.com" style="height:52px;margin-left:10px;">
		<!-- END LOGO PLACEHOLDER -->
	</div>


	<!-- #TOGGLE LAYOUT BUTTONS -->
	<!-- pulled right: nav area -->
	<div class="pull-right">
		<!-- collapse menu button -->
		<div id="hide-menu" class="btn-header pull-right">
			<span> <a href="javascript:void(0);" title="Collapse Menu" onclick="toggleMenu()"><i class="fa fa-reorder"></i></a> </span>
		</div>
		<!-- end collapse menu -->


		<!-- logout button -->
		<div id="logout" class="btn-header transparent pull-right">
			<span> <a href="javascript:logOut();" title="Sign Out" data-action="userLogout"
					  data-logout-msg="You can improve your security further after logging out by closing this opened browser"><i
						class="fa fa-sign-out"></i></a> </span>
		</div>
		<!-- end logout button

		<div class="widget-toolbar" role="menu" style="padding:8px;border:0px;">
			<div class="progress progress-striped active" rel="tooltip" data-original-title="55%" data-placement="bottom">
				<div class="progress-bar progress-bar-success" role="progressbar" style="width: 15%;"></div>
			</div>
			<span style="position:absolute;display:block;top:7px;left:30px;">Security Meter</span>
		</div>
		-->
	</div>
	<!-- end pulled right: nav area -->

</header>
<!-- END HEADER -->

<!-- #NAVIGATION -->
<!-- Left panel : Navigation area -->
<!-- Note: This width of the aside area can be adjusted through LESS variables -->
<aside id="left-panel">

	<!-- User info -->
	<div class="login-info">
<span id="set"> <!-- User image size is adjusted inside CSS, it should stay as is -->

					<a href="#profile" id="show-shortcut">
						<span>
							Settings
						</span>
						<i class="fa fa-angle-down"></i>
					</a>

				</span>
		<span id="miniset"> <!-- User image size is adjusted inside CSS, it should stay as is -->

					<a href="#profile" id="show-shortcut"  rel="tooltip" title="Settings" data-placement="right">
					<i class="fa fa-cog"></i>
					</a>

				</span>
	</div>

	<!-- end user info -->

	<!-- NAVIGATION : This navigation is also responsive

	To make this navigation dynamic please make sure to link the node
	(the reference to the nav > ul) after page load. Or the navigation
	will not initialize.
	-->
	<nav>
		<!--
		NOTE: Notice the gaps after each icon usage <i></i>..
		Please note that these links work a bit different than
		traditional href="" links. See documentation for details.
		-->

		<ul>
			<li>
				<a href="mail"><i class="fa fa-lg fa-fw fa-inbox" style=""></i> <span class="menu-item-parent"style="">Mail</span><span
						class="badge pull-right inbox-badge"></span></a>
			</li>
		</ul>


	</nav>

</aside>
<!-- END NAVIGATION -->

<!-- #MAIN PANEL -->
<div id="main" role="main">

	<!-- RIBBON -->
	<div id="ribbon">
<span class="ribbon-button-alignment">
	<span id="key" class="btn btn-ribbon" style="display:none;" data-title="key"
		  onclick="retrieveSecret();"><i class="fa fa-key"></i></span>
				</span>

		<div id='sestime' class="breadcrumb" style="float:right;" rel="popover-hover" data-placement="bottom"
			 data-original-title="" data-content="You will be required to re-enter secret">
			<span id="timeout"></span></div>

		<!-- breadcrumb -->

<span class="ribbon-button-alignment pull-left"
	  style="margin-right:15px"
	  rel="popover-hover"
	  data-placement="bottom"
	  data-original-title=""
	  data-content="Report bugs, typos or recommendations.">
		<a href="/submitBug" target="_blank"><span id="add" class="txt-color-lighten visible-lg visible-md visible-sm" data-title="add"><i class="fa fa-bug fa-lg"></i> Report bug</span><span id="add" class="visible-xs" data-title="add"><i class="fa fa-bug fa-lg"></i> Report bug</span></a>

	</span>
			<a href="javascript:void(0);" onclick="getDataFromFolder('inviteFriend');" id="invFriend"><span class="ribbon-button-alignment pull-left" style="margin-right:15px"
																							 rel="popover-hover"
																							 data-placement="bottom"
																							 data-original-title=""
																							 data-content="Invite your friends to share SCRYPTmail's awesomeness.">
		<span id="add" class="txt-color-lighten visible-lg visible-md visible-sm" data-title="add"><i class="fa fa-send-o fa-lg"></i> Invite Friends </span><span id="add" class="visible-xs" data-title="add"><i class="fa fa-send-o fa-lg"></i> Invite Friends </span>
			</span></a>

		<!-- end breadcrumb -->

		<!-- You can also add more buttons to the
		ribbon for further usability

		Example below:

		<span class="ribbon-button-alignment pull-right" style="margin-right:25px">
			<span id="search" class="btn btn-ribbon hidden-xs" data-title="search"><i class="fa fa-grid"></i> Change Grid</span>
			<span id="add" class="btn btn-ribbon hidden-xs" data-title="add"><i class="fa fa-plus"></i> Add</span>
			<span id="search" class="btn btn-ribbon" data-title="search"><i class="fa fa-search"></i> <span class="hidden-mobile">Search</span></span>
		</span> -->

	</div>
	<!-- END RIBBON -->

	<!-- #MAIN CONTENT -->
	<div id="content">

	</div>

	<!-- END #MAIN CONTENT -->

	<!-- END #MAIN PANEL -->

	<!-- #PAGE FOOTER -->
	<div class="page-footer hidden-lg hidden-md" style="height:75px; z-index:20;" id="mobFooter">
		<div class="row">
			<div class="col-xs-12 col-sm-12 col-md-12 pull-left emailMob1 hidden-md hidden-lg txt-color-white"
				 style="height:40px;margin-top:-5px;">
			</div>

			<div class="col-xs-12 col-sm-12 col-md-12 text-align-center">
				<span class="txt-color-white">SCRYPTmail © 2015 - </span>

				<a href="/TermsAndConditions" target="_blank"><span class="txt-color-black">ToS</span></a>

				<a href="/privacypolicy" target="_blank"><span class="txt-color-black">PP</span></a>

				<a href="/canary" target="_blank""><span id="add" class="" data-title="add">Canary</span></a>
			</div>

		</div>
		<!-- end row -->
	</div>


	<div class="page-footer hidden-sm hidden-xs">
		<div class="row">
			<div class="col-lg-12 text-align-center">
				<span class="txt-color-white">SCRYPTmail © 2015 - </span>

				<a href="/TermsAndConditions" target="_blank"><span class="txt-color-black">ToS</span></a>

				<a href="/privacypolicy" target="_blank"><span class="txt-color-black">Privacy Policy</span></a>

				<a href="/canary" target="_blank""><span id="add" class="" data-title="add">Canary</span></a>
			</div>

		</div>
		<!-- end row -->
	</div>
	<!-- END FOOTER -->

	<!-- #SHORTCUT AREA : With large tiles (activated via clicking user name tag)
		 Note: These tiles are completely responsive, you can add as many as you like -->
	<div id="shortcut">
		<ul>
			<li>
				<a href="#mail" class="jarvismetro-tile big-cubes bg-color-blue"> <span class="iconbox"> <i
							class="fa fa-envelope fa-4x"></i> <span id="topBadge">Mail</span> </span>
				</a>
			</li>
			 	<li>
					<a href="#profile" class="jarvismetro-tile big-cubes bg-color-purple"> <span class="iconbox"> <i class="fa fa-cogs fa-4x"></i> <span>Settings</span> </span> </a>
				</li>

			<!-- 	<li>
					<a href="#ajax/profile.html" class="jarvismetro-tile big-cubes selected bg-color-pinkDark"> <span class="iconbox"> <i class="fa fa-user fa-4x"></i> <span>My Profile </span> </span> </a>
				</li>-->
		</ul>
	</div>
	<!-- END SHORTCUT AREA -->

	<!--================================================== -->

	<!-- PACE LOADER - turn this on if you want ajax loading to show (caution: uses lots of memory on iDevices)
	<script data-pace-options='{ "restartOnRequestAfter": true }' src="js/plugin/pace/pace.min.js"></script>-->


	<!-- #PLUGINS -->



	<!-- CUSTOM NOTIFICATION -->



	<!-- JQUERY VALIDATE -->
	<script src="js/plugin/jquery-validate/jquery.validate.min.js"></script>

	<!-- JQUERY SELECT2 INPUT -->


	<!-- browser msie issue fix -->
	<script src="js/plugin/msie-fix/jquery.mb.browser.min.js"></script>

	<script src="js/plugin/datatables/jquery.dataTables.js"></script>
	<script src="js/plugin/datatables/dataTables.colVis.js"></script>
	<script src="js/plugin/datatables/dataTables.tableTools.js"></script>
	<script src="js/plugin/datatables/dataTables.bootstrap.js"></script>

	<!--<script src="js/plugin/datatables/jquery.jeditable.js"></script>
	<script src="js/plugin/datatables/dataTables.editable.js"></script>-->


	<script src="js/plugin/datatable-responsive/datatables.responsive.min.js"></script>

	<script type="text/javascript" src="/js/plugin/summernote/summernote.js?r=<?php echo $version;?>">></script>

	<!-- MAIN APP JS FILE -->
	<script src="js/app.js"></script>


	<div id="dialog-form"  class="smart-form client-form" title="Provide Secret Phrase" style="display:none;" onkeydown="if (event.keyCode == 13) $('#secretok').click();">
		<p class="validateTips" style="display:block;border:0px;">Please provide secret phrase.</p>
		<section>
			<label class="input ">
				<input name="name" id="secret" type="password" value="<?php echo $secret;?>">
			</label>

		</section>


		<div class="note">
			<a href="/forgotSecret" onclick="unbindElement();">Forgot secret phrase?</a>
		</div>

	</div>

	<div id="addFolder" title="Add Folder" style="display:none;" onkeydown="if (event.keyCode == 13) $('#folderok').click();">
		<fieldset>
			<input type="text" name="foldername" maxlength="30" id="newFolder" placeholder="30 max"
				   class="text ui-widget-content ui-corner-all col col-xs-12">
		</fieldset>

	</div>
	<div id="dialog-confirm"></div>


	<div id="dialog-form-login" title="Login Form" style="display:none;">
		<p class="validateTips" style="display:block;border:0px;">Your session has expired. Please log-in again.</p>

		<form class="smart-form client-form" id="login-form-modal" action="/ModalLogin" method="post" onkeydown="if (event.keyCode == 13) $('#loginok').click();">
			<section>
				<label class="input ">

					<div class="input-group">
						<input name="LoginForm[username]" id="LoginForm_username" type="text" value="<?php echo $user;?>">
						<span class="input-group-addon" id="cremail">@scryptmail.com</span>
					</div>
					</label>
				<em for="email" class="invalid"></em>
			</section>

			<section>
				<label class="input "> <i class="icon-append fa fa-lock"></i>
					<input name="LoginForm[password]" id="LoginForm_password" type="password" value="<?php echo $pass;?>">
				</label>

			</section>

		</form>
	</div>

</div>



</body>

</html>