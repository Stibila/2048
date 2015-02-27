<?php
include 'config.php';

error_reporting(-1);
ini_set('display_errors', 'On');


function gen_uuid() {
    return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        // 32 bits for "time_low"
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),

        // 16 bits for "time_mid"
        mt_rand( 0, 0xffff ),

        // 16 bits for "time_hi_and_version",
        // four most significant bits holds version number 4
        mt_rand( 0, 0x0fff ) | 0x4000,

        // 16 bits, 8 bits for "clk_seq_hi_res",
        // 8 bits for "clk_seq_low",
        // two most significant bits holds zero and one for variant DCE1.1
        mt_rand( 0, 0x3fff ) | 0x8000,

        // 48 bits for "node"
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
    );
}

function new_game($player) {
	// Create connection
	$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

	// Check connection
	if ($conn->connect_error) {
	    return false;
	}

	//get player ID
	$stmt = $conn->prepare("SELECT id FROM player WHERE uuid=?");
	$stmt->bind_param("s", $player);
	$stmt->execute();
	$stmt->bind_result($player_id);
	$stmt->fetch();
	$stmt->close();

	$i = 0;
	do {
		if(++$i > 10) {
			$stmt->close();
			$conn->close();
			return false;
		}
		$uuid = gen_uuid();
		$stmt = $conn->prepare("SELECT * FROM game WHERE uuid=?");
		$stmt->bind_param("s", $uuid);
		$stmt->execute();
		$stmt->store_result();
	}while($stmt->num_rows != 0);
	$stmt->close();

	// prepare and bind
	$stmt = $conn->prepare("INSERT INTO game (player_id, uuid) VALUES (?,?)");
	$stmt->bind_param("is", $player_id, $uuid);
	$stmt->execute();

	if($stmt->affected_rows > 0) {
		$ret = $uuid;
	}
	else {
		$ret = false;
	}

	$stmt->close();
	$conn->close();
	
	return $ret;
}

function transform_grid($grid) {
  $newGrid = array_fill(0,16,null);
  $lines = $grid['cells'];

  for($i=0; $i<4; $i++) {
    $line = $lines[$i];
    for($j=0; $j<4; $j++) {
      if($line[$j]) {
        $newGrid[$i + $j*4] = $line[$j]['value'];
      }
    }
  }

  return $newGrid;
}

function new_move($game) {

	$gameUUID = $game['gameUUID'];
	$move = $game['move'];
	$score = $game['score'];
	$direction = $game['moveDirection'];
	$timestamp = $game['timestamp'];
	$grid = transform_grid($game['grid']);

	$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
	if ($conn->connect_error) {
		return false;
	}

	//get game ID
	$stmt = $conn->prepare("SELECT id FROM game WHERE uuid=?");
	$stmt->bind_param("s", $gameUUID);
	$stmt->execute();
	$stmt->bind_result($game_id);
	$stmt->fetch();
	$stmt->close();


	//check if same move exists
	$stmt = $conn->prepare("SELECT * FROM move WHERE game_id = ? AND move = ?");
	$stmt->bind_param("ii", $game_id, $move);
	$stmt->execute();
	$stmt->store_result();
	if($stmt->num_rows > 0) {
		$stmt->close();
		return true;
	}
	$stmt->close();

	$stmt = $conn->prepare("INSERT INTO move (game_id, move, direction, score, timestamp, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");

	$stmt->bind_param("iisiiiiiiiiiiiiiiiiii",
			$game_id,
			$move,
			$direction,
			$score,
			$timestamp,
			$grid["0"],
			$grid["1"],
			$grid["2"],
			$grid["3"],
			$grid["4"],
			$grid["5"],
			$grid["6"],
			$grid["7"],
			$grid["8"],
			$grid["9"],
			$grid["10"],
			$grid["11"],
			$grid["12"],
			$grid["13"],
			$grid["14"],
			$grid["15"]
		);
	$stmt->execute();
	$stmt->store_result();
	$affected_rows = $stmt->affected_rows;
	$stmt->close();
	$conn->close();
	return ($affected_rows > 0);
}

function new_player($birth, $exp, $gender) {
	// Create connection
	$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

	// Check connection
	if ($conn->connect_error) {
	    return false;
	}

	$i = 0;
	do {
		if(++$i > 10) {
			$stmt->close();
			$conn->close();
			return false;
		}
		$uuid = gen_uuid();
		$stmt = $conn->prepare("SELECT * FROM player WHERE uuid=?");
		$stmt->bind_param("s", $uuid);
		$stmt->execute();
		$stmt->store_result();
	}while($stmt->num_rows != 0);
	$stmt->close();

	// prepare and bind
	$stmt = $conn->prepare("INSERT INTO player (ip, user_agent, uuid, birth_year, experiences, gender) VALUES (?, ?, ?, ?, ?, ?);
");
        $ip = ip2long(get_client_ip());
	$gender = $gender[0];
	$userAgent = $_SERVER['HTTP_USER_AGENT'];

	$stmt->bind_param("issiis", $ip, $userAgent, $uuid, $birth, $exp, $gender);
	$stmt->execute();

	if($stmt->affected_rows > 0) {
		$ret = $uuid;
	}
	else {
		$ret = false;
	}

	$stmt->close();
	$conn->close();
	
	return $ret;
}

function get_client_ip() {
    $ipaddress = '';
    if (getenv('HTTP_CLIENT_IP'))
        $ipaddress = getenv('HTTP_CLIENT_IP');
    else if(getenv('HTTP_X_FORWARDED_FOR'))
        $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
    else if(getenv('HTTP_X_FORWARDED'))
        $ipaddress = getenv('HTTP_X_FORWARDED');
    else if(getenv('HTTP_FORWARDED_FOR'))
        $ipaddress = getenv('HTTP_FORWARDED_FOR');
    else if(getenv('HTTP_FORWARDED'))
       $ipaddress = getenv('HTTP_FORWARDED');
    else if(getenv('REMOTE_ADDR'))
        $ipaddress = getenv('REMOTE_ADDR');
    else
        $ipaddress = "0.0.0.0";
    return $ipaddress;
}
?>
