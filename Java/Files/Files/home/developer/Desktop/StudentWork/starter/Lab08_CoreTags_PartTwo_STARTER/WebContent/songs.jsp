<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"
	import="java.util.List, com.music.model.Song, java.util.Date, java.util.NoSuchElementException"
	errorPage="errorPage.jsp"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Available Songs</title>

</head>
<body>
	<%@ include file="header.jsp"%>
	<h3>
		Songs Available for Download as of
		<%=new Date().toString()%>
	</h3>
	<%
		if ((List<Song>) session.getAttribute("Songs") != null) {
	%>
	<table style=margin: "8"; cellpadding="9" cellspacing="3" border="4">
			<c:forEach items='${sessionScope.Songs}' var='song'>
			<tr>
				<td><c:out value="${song.id}" /></td>
				<td><c:out value="${song.artist}" /></td>
				<td><c:out value="${song.title}" /></td>
			</tr>
		</c:forEach>
		<%			
		} else {
		throw new NoSuchElementException("The requested attribute was not found in the session");
		}
		%>
	</table>

	<br />
	<br />


</body>
</html>