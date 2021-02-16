<?php

$host = getenv("MYSQL_HOST");
$name = getenv("MYSQL_DATABASE");
$user = getenv("MYSQL_USER");
$pass = getenv("MYSQL_PASSWORD");

$max_attempts = 50;
$attempt = 0;
while ($attempt++ <= $max_attempts) {
	try {
		$dbh = new PDO("mysql:host=$host;dbname=$name", $user, $pass);
		exit(0); // Exit with success if all went well
	} catch (PDOException $ex) {
        echo "Failed to connect to database\n";
        sleep(1);
	}
}

exit(1);
