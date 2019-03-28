<?php 
$text = $_POST['text'];

$servername = "localhost";
$username = "root";
$password = "";//服务器中连接数据库的密码
$dbname = "";//使用的数据库名
 
// 创建连接
$conn = new mysqli($servername, $username, $password, $dbname);
 
// 检测连接
if ($conn->connect_error) {
    die("connect server fail: " . $conn->connect_error);
} 

$sql = "INSERT INTO userinfo
VALUES ('$text')";

if ($conn->query($sql) === TRUE) {
    echo "insert success";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}
$conn->close();
?>