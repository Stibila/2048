<?php

error_reporting(-1);
ini_set('display_errors', 'On');

include 'functions.php';

if(isset($_GET['new']))
{
	switch($_GET['new'])
	{
		case 'game':
				if(isset($_GET['player'])) {
					$uuid = new_game($_GET['player']);
					if($uuid == false) {
						header("HTTP/1.1 409 Conflict");
						$message = "Problem";
					}
					else {
						header("HTTP/1.1 200 OK");
						$message = "$uuid";
					}
				}
				else {
					header("HTTP/1.1 400 Bad Request");
					$message = "Wrong params";
				}
				die($message);
		case 'move':
				if(isset($_GET['game'])) {
					$game = json_decode(urldecode($_GET['game']), true);
	
					if(new_move($game)) {
						header("HTTP/1.1 200 OK");
						$message = "OK";
					}
					else {
						header("HTTP/1.1 409 Conflict");
						$message = "Problem";
					}
				}
				else {
					header("HTTP/1.1 400 Bad Request");
					$message = "Wrong params";
				}
				die($message);
		case 'player':
				if(isset($_GET['birth_year']) && isset($_GET['experience']) && isset($_GET['gender']) && isset($_GET['weekly']) && isset($_GET['genres'])) {
					$genres = json_decode(urldecode($_GET['genres']), true);
					$uuid = new_player($_GET['birth_year'], $_GET['experience'], $_GET['gender'], $_GET['weekly'], $genres);
					if($uuid != null && $uuid != false) {
						header("HTTP/1.1 200 OK");
						$message = $uuid;
					}
					else {
						header("HTTP/1.1 409 Conflict");
						$message="Problem";
					}
				}
				else {
					header("HTTP/1.1 400 Bad Request");
					$message = "Wrong params";
				}
				die($message);
	}
}

header("HTTP/1.1 400 Bad Request");
echo "Wrong params";
?>
