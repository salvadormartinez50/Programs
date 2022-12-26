<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"
	import="java.util.List, com.music.model.Song, java.util.Date, java.util.NoSuchElementException"
	errorPage="errorPage.jsp"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Available Songs</title>

</head>
<body>
    <%@ include file="header.html" %>
	<h3>
		Songs Available for Download as of
		<%=new Date().toString()%>
	</h3>
	<%
		List<Song> songs = (List<Song>) session.getAttribute("GoFish");
	if (songs != null) {
	%>
	<table style=margin: "8"; cellpadding="9" cellspacing="3" border="4">
		<%
			for (Song _song : songs) {
		%>
		<tr>
			<td>
				<%
					out.print(_song.getId());
				%>
			</td>
			<td>
				<%
					out.print(_song.getTitle());
				%>
			</td>
			<td>
				<%
					out.print(_song.getArtist());
				%>
			</td>
		</tr>
		
		<%
			}
		} else {
		throw new NoSuchElementException("The requested attribute was not found in the session");
		}
		%>
	</table>

</body>
</html>