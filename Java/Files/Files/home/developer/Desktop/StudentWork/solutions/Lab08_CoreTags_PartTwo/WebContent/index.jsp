<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Welcome</title>
</head>
<body>
	<c:set var="now" value="<%=new java.util.Date()%>" />
	<p>
		Today's Date:
		<fmt:formatDate type="date" value="${now}" />
	</p>
	<jsp:include page="header.jsp" />
	<h3>Welcome to Simple Song Service</h3>
	<br>
	<p>
		Your browser information: ${header["user-agent"]} <br /> Your IP and
		port are: ${header["host"]}<br />
	</p>

	<hr>
	<h3>Please enter your user name</h3>
	<form action="welcome.jsp" method="post">
		<label for="username">User Name:</label> <input type="text"
			name="name"> <br /> <input type="text" name="ip"
			value='${header["host"]}'> <br /> <br /> <input
			type="submit" value="Next">
	</form>
</body>
</html>