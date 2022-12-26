<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1" import="java.util.List, com.music.model.Song" %>
    
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Available Songs</title>
</head>
<body>

<%
   List<Song> songs = (List<Song>)session.getAttribute("Songs");
   for(Song _song : songs){
	   out.print(_song);
	   out.print("<br/>");
   }
%>
</body>
</html>