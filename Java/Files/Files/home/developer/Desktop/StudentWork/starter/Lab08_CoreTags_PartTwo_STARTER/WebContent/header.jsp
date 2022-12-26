<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1" import="com.music.model.StockPrice"  %>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
</head>
<img src="company_logo.svg" alt="Company Logo" width="300" height="100"/><br/>
Current Stock Price: <%= String.format("%.2f", StockPrice.getStockPrice())  %><br/>
<body>
</body>
</html>