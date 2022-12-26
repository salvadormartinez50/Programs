<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"
	import="java.util.List, com.music.model.Song, java.util.Date, java.util.NoSuchElementException"
	errorPage="errorPage.jsp"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Available Songs!</title>

</head>
<body>
	<%@ include file="header.jsp"%>

	<c:set var="now" value="<%=new java.util.Date()%>" />
	<p>
		Songs Available for Download as of
		<fmt:formatDate type="both" dateStyle="long" timeStyle="long"
			value="${now}" />
	</p>

	<c:choose>
		<c:when test='${sessionScope.Songs != null}'>
			<table style=margin: "8"; cellpadding="9" cellspacing="3" border="4">
				<c:forEach items='${sessionScope.Songs}' var='song'>
					<tr>
						<fmt:formatNumber var="song_id" pattern="00000" value="${song.id}" />
						<td><c:out value="${song_id}" /></td>
						<td><c:out value="${song.artist}" /></td>
						<td><c:out value="${song.title}" /></td>
					</tr>
				</c:forEach>
		</c:when>
		<c:otherwise>
			<p>There are no songs available at this time</p>
		</c:otherwise>
			
		</c:choose>
			</table>

			<br />
			<br />
</body>
</html>