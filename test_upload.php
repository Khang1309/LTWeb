<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/products/upload-image');
curl_setopt($ch, CURLOPT_POST, 1);
$cfile = new CURLFile('C:/Windows/win.ini', 'text/plain', 'test.jpg');
curl_setopt($ch, CURLOPT_POSTFIELDS, ['image' => $cfile]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
echo "RESPONSE_BODY:\n";
echo $response;
