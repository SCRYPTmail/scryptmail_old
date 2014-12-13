<div class="well well-sm well-light">
	<h2 class="email-open-header">
	</h2>
	<div class="inbox-info-bar">
		<div class="row">
			<div class="col-sm-9" id="rcptHeader">
			</div>
			<div class="col-sm-3 text-right">

				<div class="btn-group text-left" id="defMailOption">
					<button class="btn btn-primary btn-sm replythis" onclick="replyToMail();">
						<i class="fa fa-reply"></i> Reply
					</button>
					<button class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown">
						<i class="fa fa-angle-down"></i>
					</button>
					<ul class="dropdown-menu pull-right">
						<li id='replyMail'>
							<a href="javascript:void(0);" class="replythis" onclick="replyToMail();"><i
									class="fa fa-reply"></i> Reply</a>
						</li>
						<li>
							<a href="javascript:void(0);" class="replythis" onclick="forwardMail();"><i
									class="fa fa-mail-forward"></i> Forward</a>
						</li>
						<li class="divider"></li>
						<!--<li id='spamMail'>
							<a href="javascript:void(0);" onclick="markSpam();"><i class="fa fa-ban"></i> Mark as spam!</a>
						</li>-->
						<li>
							<a href="javascript:void(0);" id="trashList" onclick="deleteMail();"><i class="fa fa-trash-o"></i> Move to Trash</a>
						</li>
					</ul>
				</div>

			</div>
		</div>
	</div>

	<div class="padding-5" id="rendIm">
		To protect you from tracking, images are disabled. <button class="btn btn-primary btn-xs" onclick="renderImages()">Render Images</button>
	</div>


</div>

<div class="inbox-message" style="padding:0;">

	<div id="emailbody">
<p></p>
		<p></p>
	</div>
</div>
<script src="/js/readEmail.js?r=<?php echo $version;?>"></script>
<script src="/js/renderMail.js?r=<?php echo $version;?>"></script>
