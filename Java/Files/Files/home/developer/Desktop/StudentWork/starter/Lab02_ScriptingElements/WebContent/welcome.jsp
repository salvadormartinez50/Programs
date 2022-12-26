<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Simple Song Site</title>
</head>
<body>

	<h3>Welcome to Simple Song Service</h3>
	<br>
	<hr>

	<p><%="Welcome " + request.getParameter("username")%></p>



	<a href="SongServlet">Show All Songs</a>




</body>
</html>