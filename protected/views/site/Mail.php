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

	<div class="btn-group hidden-lg hidden-md col col-xs-6">
		<button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
			<span id="folderSelect"></span> <i class="fa fa-caret-down"></i>
		</button>
		<ul class="dropdown-menu pull-left col-xs-3" id="mobfolder">
		</ul>
	</div>


	<div id='pag' class="pull-right">
	<div class="btn-group pull-right inbox-paging" id='paginator'>

	</div>

	<span class="pull-right" id="custPaginator" style="margin-top:5px;"></span>
	</div>

	<div id="sendMaildiv" class="col col-xs-6 text-align-right pull-right" style="display:none;">
		<button class="btn btn-primary sendMailButton"
				type="button" onclick="sendMail()">
			Send
		</button>


		<button class="btn btn-danger" style="margin-left:10px;" type="button" rel="tooltip" data-placement="top"
				data-original-title="Discard" onclick="deleteMail()"><i class="fa fa-trash-o"></i>
		</button>

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

			<h6> Folders <a href="javascript:void(0);" rel="tooltip" title="" data-placement="top" data-original-title="Add Folder" class="pull-right txt-color-darken"><i class="fa fa-plus" onclick="addCustomFolder()"></i></a></h6>
			<ul class="inbox-menu-lg" id="folderulcustom" style="position:relative;margin-bottom:40px;">

			</ul>
		</div>
		<div class="air air-bottom fetch-space" style="bottom:40px;width: 185px;display:none;position:initial;">
		</div>

		<div class="air air-bottom inbox-space" style="bottom:0px;position:initial;">

		</div>

	</div>

	<div class="table-wrap fadeInRight">
		<!-- ajax will fill this area -->
		LOADING...
	</div>

</div>

<div id="contextMenu" class="dropdown clearfix">
	<ul class="dropdown-menu" id="contextMenuList" role="menu" aria-labelledby="dropdownMenu" style="display:block;position:static;margin-bottom:5px;">
		<li><a tabindex="-1" href="javascript:void(0);" id="customRename">Rename</a></li>
		<li><a tabindex="-1" href="javascript:void(0);" id="customDelete">Delete</a></li>
		<li class="divider"></li>
		<li><a tabindex="-1" href="javascript:void(0);" onclick="$('#contextMenu').css('display','none')">Cancel</a></li>
	</ul>
</div>

<script type="text/javascript">


	$(document).ready(function () {
		$(document).on("contextmenu","ul li", function(event) {
			if($(event.target).parent().parent().attr('id')=="folderulcustom"){
				event.preventDefault();
				$("#contextMenu").css({
					display: "block",
					left:  event.pageX,
					top: event.pageY-110
				});
				$("#contextMenu").data('originalElement', event.target);
			}

		});

		$('#customRename').click(function(e){
			var originalElement = $("#contextMenu").data('originalElement');
			renameCustomFolder(originalElement.text,originalElement.id);
			$("#contextMenu").css('display','none');
		});

		$('#customDelete').click(function(e){
			var originalElement = $("#contextMenu").data('originalElement');
			deleteCustomFolder(originalElement.text,originalElement.id);
			$("#contextMenu").css('display','none');
		});


		loadInitialPage();
		displayFolder();
		getDataFromFolder('Inbox');
		//currentTab();
		$('#invFriend').css('display','initial');

	});

</script>



