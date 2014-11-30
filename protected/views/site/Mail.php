<?php
/* @var $this SiteController */

/*
 * <div id="messagetoolbar" class="toolbar">
	<ul id="mailtoolbar">
		<li id="Compose"><a href="javascript:mailAction('composeMail');">Compose</a></li>
		<li id="Reply"><a href="javascript:mailAction('Reply');">Reply</a></li>
		<li id="Forward"><a href="javascript:mailAction('Forward');">Forward</a></li>
		<li id="Delete"><a href="javascript:mailAction('Delete');">Delete</a></li>
		</ul>
</div>
 */

?>


<div class="inbox-nav-bar no-content-padding">
	<h1 class="page-title txt-color-blueDark visible-lg visible-md pull-left"><i class="fa fa-fw fa-inbox"></i> Inbox &nbsp;</h1>

	<div class="btn-group hidden-lg hidden-md">
		<button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
			<span id="folderSelect"></span> <i class="fa fa-caret-down"></i>
		</button>
		<ul class="dropdown-menu pull-left" id="mobfolder">
		</ul>

	</div>

	<a href="javascript:void(0);" class="btn btn-primary hidden-lg hidden-md" onclick="getDataFromFolder('composeMail')"><strong>Compose</strong></a>

	<div id='pag' class="pull-right">
	<div class="btn-group pull-right inbox-paging" id='paginator'>

	</div>

	<span class="pull-right" id="custPaginator" style="margin-top:5px;"></span>
	</div>
</div>
<div id="inbox-content" class="inbox-body no-content-padding">

	<div class="inbox-side-bar visible-lg  visible-md">

		<div style="position:relative;">
			<a href="javascript:void(0);" id="compose-mail" class="btn btn-primary btn-block"
			   onclick="getDataFromFolder('composeMail')"> <strong>Compose</strong> </a>

			<h6>  </h6>

			<ul class="inbox-menu-lg" id="folderul">

			</ul>

		</div>
		<div class="air air-bottom fetch-space" style="bottom:40px;width: 185px;display:none">
		</div>

		<div class="air air-bottom inbox-space">

		</div>

	</div>

	<div class="table-wrap animated fast fadeInRight">
		<!-- ajax will fill this area -->
		LOADING...
	</div>

</div>

<script type="text/javascript">


	$(document).ready(function () {

		loadInitialPage();
		displayFolder();
		getDataFromFolder('Inbox');
		//currentTab();


	});

</script>



