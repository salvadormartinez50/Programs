
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"  %>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Simple Song Site</title>
</head>
<body>
     <jsp:include page="header.jsp" /> 
	<h3>Welcome to Simple Song Service</h3>
	<br>
	<hr>
		
	<p>Welcome ${param.name} <br/>
	   I see your IP Address and Port are: ${param["ip"]}
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