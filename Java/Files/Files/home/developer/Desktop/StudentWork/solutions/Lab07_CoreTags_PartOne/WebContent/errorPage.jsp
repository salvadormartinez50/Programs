<%@ page isErrorPage='true' %>

<html>
  <head><title>Unexpected Error</title>
 <img src="company_logo.svg" alt="Company Logo" width="300" height="100"/>
  </head>
  <body>
    <h3>Sorry, an unexpected error was encountered.</h3>
    Error Details<br/><hr>
    <%= exception %>
  </body>
</html>