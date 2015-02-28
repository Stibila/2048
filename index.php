<?php
$langs = preg_split("/[,;-]+/", strtolower($_SERVER['HTTP_ACCEPT_LANGUAGE']));

foreach($langs as $l) {
	switch($l) {
		case "sk":
		case "cs":
			header('Location: /sk/');
			die();
		case "en":
		case "us":
			header('Location: /en/');
			die();
	}
}

header('Location: /sk/');

?>
