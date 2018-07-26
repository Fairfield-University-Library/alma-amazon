<!DOCTYPE html>
<html>
  <head>
    <title>Import Amazon Orders (CSV)</title>
    <link rel="stylesheet" href="https://v4-alpha.getbootstrap.com/dist/css/bootstrap.min.css"></link>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.16/vue.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.0.1/vue-router.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/4.3.7/papaparse.min.js"></script>
    <style>
      .loading{
        pointer-events:none;
        opacity: 0.5
      }
      .code2 , .code3 {display:none;}
      .loc {max-width: 300px;}
    </style>
  </head>
  <body>
    <div id="app" class="container">
			<nav class="navbar navbar-toggleable-md navbar-light bg-faded">
				<button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				<a class="navbar-brand" href="#"></a>
				<div class="collapse navbar-collapse" id="navbarNav">
					<ul class="navbar-nav">
						<li class="nav-item active">
							<router-link to="/" class="nav-link" linkActiveClass="active">Home</router-link>
						</li>
					</ul>
				</div>
			</nav>
      
      <hr/>
      <router-view></router-view>
    </div>
    <script>
    <?php
      //Add your Alma Api Key here
      $key = '';
      $code1 = addslashes(file_get_contents('https://api-na.hosted.exlibrisgroup.com/almaws/v1/conf/code-tables/HFundsTransactionItem.reportingCode?apikey' . $key . ' &format=json'));
      $code2 = addslashes(file_get_contents('https://api-na.hosted.exlibrisgroup.com/almaws/v1/conf/code-tables/SecondReportingCode?apikey' . $key . ' &format=json'));
      $code3 = addslashes(file_get_contents('https://api-na.hosted.exlibrisgroup.com/almaws/v1/conf/code-tables/ThirdReportingCode?apikey' . $key . ' &format=json'));
      $locations = addslashes(file_get_contents('https://api-na.hosted.exlibrisgroup.com/almaws/v1/conf/libraries/MAIN/locations?apikey' . $key . ' &format=json'));
      $funds = addslashes(file_get_contents('https://api-na.hosted.exlibrisgroup.com/almaws/v1/acq/funds?apikey' . $key . ' &format=json&limit=100'));
    ?>
      var code2 = JSON.parse('<?php echo $code2; ?>');
      var locations = JSON.parse('<?php echo $locations; ?>');
      var code3 = JSON.parse('<?php echo $code3; ?>');
      var funds = JSON.parse('<?php echo $funds; ?>');
      var code1 = JSON.parse('<?php echo $code1; ?>');
    </script>
    <script src="app.js"></script>
  </body>
</html>