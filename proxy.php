<?php
//Alma API doesn't have CORS enabled
header("Access-Control-Allow-Origin: {YOUR_DOMAIN}");
$url = urldecode($_GET['url']);
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
  header("Access-Control-Request-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header("Access-Control-Allow-Headers: Content-Type");
  exit;
}
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $postdata = file_get_contents("php://input");
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
  curl_setopt($ch, CURLOPT_HEADER  , true);
  curl_setopt($ch, CURLOPT_CONNECTTIMEOUT  , 10);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $postdata);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array(
      'Content-Type: application/json',
      'Content-Length: ' . strlen($postdata))
  );
  $response = curl_exec($ch);
  $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
  $header = substr($response, 0, $header_size);
  $body = substr($response, $header_size);
  $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);

  echo $body;
  if ($httpcode != 200) {
    http_response_code(400);
  }
  exit;
}
echo file_get_contents($url);
