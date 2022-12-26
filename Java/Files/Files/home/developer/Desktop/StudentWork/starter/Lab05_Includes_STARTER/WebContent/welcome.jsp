<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Simple Song Site</title>
</head>
<body>
    <%@ include file="header.html" %>
	<h3>Welcome to Simple Song Service</h3>
	<br>
	<hr>
	
	<jsp:useBean id="user" class="com.music.model.User"></jsp:useBean>
	<jsp:setProperty name="user" property="userName" param="name" /> 
	<jsp:setProperty name="user" property="ip"  /> 

	<p>Welcome  <jsp:getProperty name="user" property="userName" /><br/>
	   I see your IP Address is: <jsp:getProperty name="user" property="ip" />
	</p>

	<%!private String discountCode = "VIPCUST10";

	private String getDiscountCode() {
		return discountCode;
	}%>

	<div>
		Use this code to get an additional 10% discount:
		<h4><%=getDiscountCode()%></h4>
	</div>

	<a href="SongServlet">Show All Songs</a>




</body>
</html>