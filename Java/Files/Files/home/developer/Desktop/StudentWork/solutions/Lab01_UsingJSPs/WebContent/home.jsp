<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Welcome</title>
</head>
<body>

  <h3>Welcome Home</h3> <br/><hr/> 
   
  The protocol is: <% out.println(request.getProtocol()); %> <br/>
  The port is: <% out.println(request.getServerPort()); %> <br/>
  The remote address is: <% out.println(request.getRemoteAddr()); %> <br/>
  The context path is: <% out.println(request.getContextPath()); %> <br/>
   
</body>
</html>