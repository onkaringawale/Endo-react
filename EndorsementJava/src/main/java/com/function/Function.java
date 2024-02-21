package com.function;

import static java.util.Objects.*;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.microsoft.applicationinsights.TelemetryClient;
import com.microsoft.applicationinsights.TelemetryConfiguration;
import com.microsoft.azure.functions.ExecutionContext;
import com.microsoft.azure.functions.HttpMethod;
import com.microsoft.azure.functions.HttpRequestMessage;
import com.microsoft.azure.functions.HttpResponseMessage;
import com.microsoft.azure.functions.HttpStatus;
import com.microsoft.azure.functions.annotation.AuthorizationLevel;
import com.microsoft.azure.functions.annotation.FunctionName;
import com.microsoft.azure.functions.annotation.HttpTrigger;

public class Function {
    // set query to variable
    private static final String PLUGIN_DATA = "SELECT * FROM TU_Apex_End_Plgin.endorsement_plugin_details";

    // Azure Function to handle HTTP GET request
    @FunctionName("getPluginData")
    public HttpResponseMessage getPluginData(
            @HttpTrigger(name = "req", methods = {
                    HttpMethod.GET }, authLevel = AuthorizationLevel.ANONYMOUS) HttpRequestMessage<String> request,
            final ExecutionContext context) throws SQLException {

        Connection connection = null;
        Statement statement = null;
        ResultSet resultSet = null;
        String dataMessage = null;
        StringWriter writer = null;
        PrintWriter printWriter = null;
        String stackTrace = null;
        HttpResponseMessage responseMessage = null;
        List<JsonObject> list = new ArrayList<>();
        TelemetryClient telemetryClient = new TelemetryClient();

        try {
            // // get db connection string
            String connectionUrl = System.getenv("conEndorsement");
            if (isNull(connectionUrl) || connectionUrl.isEmpty()) {
                // throw exception if connection string is null or empty
                throw new Exception(
                        "Database connection string not found. Please set the connection string as 'conEndorsement' in the configuration setting on azure portal!");
            }

            // Connect to the database
            connection = DriverManager.getConnection(connectionUrl);
            // Execute a SQL query
            statement = connection.createStatement();
            resultSet = statement.executeQuery(PLUGIN_DATA);
            // Process the result set
            while (resultSet.next()) {
                JsonObject row = new JsonObject();
                // Map database columns to JSON properties
                row.addProperty("rule_id", resultSet.getString("rule_id"));
                row.addProperty("page_name", resultSet.getString("page_name"));
                row.addProperty("page_url", resultSet.getString("page_url"));
                row.addProperty("blurb_content", resultSet.getString("blurb_content"));
                row.addProperty("rules", resultSet.getString("rules"));
                row.addProperty("title", resultSet.getString("title"));
                list.add(row);

            }
            if (list.isEmpty()) {
                // No data found
                dataMessage = "{ \"message\": \"No data found!\" ,\"responseCode\": \"200\", \"description\": \"Connection with database established successfully, however no data found in database. Please insert the records from PowerApps UI.\"}";
                responseMessage = request.createResponseBuilder(HttpStatus.OK)
                        .header("Content-Type", "application/json")
                        .body(dataMessage).build();
            } else {
                // Build a response with JSON content, and return the list if data is found
                responseMessage = request.createResponseBuilder(HttpStatus.OK)
                        .header("Content-Type", "application/json")
                        .body(list.toString()).build();
            }

        } catch (Exception ex) {
            // Create a new StringWriter to capture the stack trace as a string
            writer = new StringWriter();
            // Create a PrintWriter that will be used to write the stack trace to the
            // StringWriter
            printWriter = new PrintWriter(writer);
            // Print the stack trace to the PrintWriter
            ex.printStackTrace(printWriter);
            // Flush the PrintWriter to ensure all data is written to the underlying
            // StringWriter
            printWriter.flush();
            // Retrieve the stack trace as a string from the StringWriter
            stackTrace = writer.toString();

            // handle exception that may occur during database interaction
            telemetryClient.trackException(ex);
            telemetryClient.flush();
            context.getLogger().severe("Error: " + ex.getMessage());
            dataMessage = "{ \"message\":\"There is an Internal Server Error!\",\"responseCode\":\"500\",\"description\":"
                    + stackTrace + " }";
            // Build an error response
            responseMessage = request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                    .header("Content-Type", "application/json")
                    .body(dataMessage).build();
        } finally {
            // Close the resources
            if (nonNull(connection)) {
                connection.close();
                if (nonNull(statement)) {
                    statement.close();
                }
                if (nonNull(resultSet)) {
                    resultSet.close();
                }
                telemetryClient.flush();
            }
        }
        // Return the final response
        return responseMessage;
    }

    @FunctionName("insertPluginData")
    public HttpResponseMessage insertPluginData(
            @HttpTrigger(name = "req", methods = {
                    HttpMethod.POST }, authLevel = AuthorizationLevel.ANONYMOUS) HttpRequestMessage<String> request,
            final ExecutionContext context) throws SQLException {
        String requestBody = request.getBody();
        
        JsonObject dataToInsert = new Gson().fromJson(requestBody, JsonObject.class);

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        String dataMessage = null;
        String stackTrace = null;
        HttpResponseMessage responseMessage = null;

        Statement statement = null;
        ResultSet resultSet = null;
        StringWriter writer = null;
        PrintWriter printWriter = null;
        TelemetryClient telemetryClient = new TelemetryClient();

        try {
            String connectionUrl = System.getenv("conEndorsement");

            if (isNull(connectionUrl) || connectionUrl.isEmpty()) {
                // throw exception if connection string is null or empty
                throw new Exception(
                        "Database connection string not found. Please set the connection string as 'conEndorsement' in the configuration setting on azure portal!");
            }

            // Connect to the database
            connection = DriverManager.getConnection(connectionUrl);

            String insertQuery = "INSERT INTO TU_Apex_End_Plgin.endorsement_plugin_details (page_name, page_url, blurb_content, rules, title) VALUES (?, ?, ?, ?, ?)";
            preparedStatement = connection.prepareStatement(insertQuery);
            preparedStatement.setString(1, dataToInsert.get("page_name").getAsString());
            preparedStatement.setString(2, dataToInsert.get("page_url").getAsString());
            preparedStatement.setString(3, dataToInsert.get("blurb_content").getAsString());
            preparedStatement.setString(4, dataToInsert.get("rules").getAsString());
            preparedStatement.setString(5, dataToInsert.get("title").getAsString());

            int rowsAffected = preparedStatement.executeUpdate();

            if (rowsAffected > 0) {
                dataMessage = "{ \"message\": \"Data inserted successfully!\",\"responseCode\": \"200\",\"description\": \"Data inserted into the database.\"}";
                responseMessage = request.createResponseBuilder(HttpStatus.OK)
                        .header("Content-Type", "application/json").body(dataMessage).build();
            } else {
                dataMessage = "{ \"message\": \"Error inserting data!\",\"responseCode\": \"500\",\"description\": \"Error inserting data into the database.\"}";
                responseMessage = request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                        .header("Content-Type", "application/json").body(dataMessage).build();
            }
        } catch (Exception ex) {
            writer = new StringWriter();
            printWriter = new PrintWriter(writer);
            ex.printStackTrace(printWriter);
            printWriter.flush();
            stackTrace = writer.toString();
            telemetryClient.trackException(ex);
            telemetryClient.flush();
            context.getLogger().severe("Error: " + ex.getMessage());
            dataMessage = "{ \"message\":\"There is an Internal Server Error!\",\"responseCode\":\"500\",\"description\":"
                    + stackTrace + " }";
            responseMessage = request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                    .header("Content-Type", "application/json")
                    .body(dataMessage).build();

        } finally {
            // Close the resources
            if (nonNull(connection)) {
                connection.close();
                if (nonNull(statement)) {
                    statement.close();
                }
                if (nonNull(resultSet)) {
                    resultSet.close();
                }
                if (nonNull(preparedStatement)) {
                    preparedStatement.close();
                }
                telemetryClient.flush();
            }
        }

        return responseMessage;
    }

    @FunctionName("deletePluginData")
    public HttpResponseMessage deletePluginData(
        @HttpTrigger(name = "req", methods = {
                HttpMethod.DELETE }, authLevel = AuthorizationLevel.ANONYMOUS) HttpRequestMessage<String> request,
        final ExecutionContext context)throws SQLException {
            String dataMessage=null;
            Connection connection=null;
            String requestBody = request.getBody();
            JsonObject dataToInsert = new Gson().fromJson(requestBody, JsonObject.class);
            String ruleId = dataToInsert.get("rule_id").getAsString();

             HttpResponseMessage responseMessage = null;
             PreparedStatement preparedStatement = null;
             try {
                String connectionUrl = System.getenv("conEndorsement");
                if(isNull(connectionUrl) || connectionUrl.isEmpty()){
                    throw new Exception("Database connection string not found. Please set the connection string as 'conEndorsement' in the configuration setting on azure portal!");

                }
                 // Connect to the database
                connection = DriverManager.getConnection(connectionUrl);
                String deleteQuery = "DELETE FROM TU_Apex_End_Plgin.endorsement_plugin_details WHERE rule_id = ?";
                preparedStatement = connection.prepareStatement(deleteQuery);
                preparedStatement.setInt(1,Integer.parseInt(ruleId));
    
                // Execute the statement
                int rowsAffected = preparedStatement.executeUpdate();
                if (rowsAffected > 0) {
                 dataMessage = "{ \"message\": \"Data deleted successfully!\",\"responseCode\": \"200\",\"description\": \"Data inserted into the database.\"}";
                responseMessage = request.createResponseBuilder(HttpStatus.OK)
                .header("Content-Type", "application/json").body(dataMessage).build();
                } else {
                    dataMessage = "{ \"message\": \"Error deleting data!\",\"responseCode\": \"500\",\"description\": \"Error inserting data into the database.\"}";
                    responseMessage = request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                    .header("Content-Type", "application/json").body(dataMessage).build();
                }
                
             } catch (Exception e) {
                e.printStackTrace();
             }
             finally{
                if (connection != null) {
                        connection.close();
                    }
             
                if (preparedStatement != null) {
                    preparedStatement.close();
                }
                
             }
             return responseMessage;
        }
    
        @FunctionName("updatePluginData")
        public HttpResponseMessage updatePluginData(
                @HttpTrigger(name = "req", methods = {
                        HttpMethod.PUT }, authLevel = AuthorizationLevel.ANONYMOUS) HttpRequestMessage<String> request,
                final ExecutionContext context) throws SQLException {
            String requestBody = request.getBody();
            JsonObject dataToUpdate = new Gson().fromJson(requestBody, JsonObject.class);
          System.out.println(dataToUpdate);
            Connection connection = null;
            PreparedStatement preparedStatement = null;
            String dataMessage = null;
            String stackTrace = null;
            HttpResponseMessage responseMessage = null;
    
            Statement statement = null;
            ResultSet resultSet = null;
            StringWriter writer = null;
            PrintWriter printWriter = null;
            TelemetryClient telemetryClient = new TelemetryClient();
    
            try {
           // get db connection string
           String connectionUrl = System.getenv("conEndorsement");
    
           if (isNull(connectionUrl) || connectionUrl.isEmpty()) {
               // throw exception if connection string is null or empty
               throw new Exception(
                       "Database connection string not found. Please set the connection string as 'conEndorsement' in the configuration setting on azure portal!");
           }

           // Connect to the database
                connection = DriverManager.getConnection(connectionUrl);
    
                String updateQuery = "UPDATE TU_Apex_End_Plgin.endorsement_plugin_details SET page_name=?,page_url=?, blurb_content=?, rules=?, title=? WHERE rule_id=?";
                preparedStatement = connection.prepareStatement(updateQuery);
                preparedStatement.setString(1, dataToUpdate.get("page_name").getAsString());
                preparedStatement.setString(2, dataToUpdate.get("page_url").getAsString());
                preparedStatement.setString(3, dataToUpdate.get("blurb_content").getAsString());
                preparedStatement.setString(4, dataToUpdate.get("rules").getAsString());
                preparedStatement.setString(5, dataToUpdate.get("title").getAsString());
                preparedStatement.setString(6, dataToUpdate.get("rule_id").getAsString());
    
                int rowsAffected = preparedStatement.executeUpdate();
    
                if (rowsAffected > 0) {
                    dataMessage = "{ \"message\": \"Data updated successfully!\",\"responseCode\": \"200\",\"description\": \"Data updated in the database.\"}";
                    responseMessage = request.createResponseBuilder(HttpStatus.OK)
                            .header("Content-Type", "application/json").body(dataMessage).build();
                } else {
                    dataMessage = "{ \"message\": \"Error updating data!\",\"responseCode\": \"500\",\"description\": \"Error updating data in the database.\"}";
                    responseMessage = request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                            .header("Content-Type", "application/json").body(dataMessage).build();
                }
            } 
        catch (Exception ex) {
                   // Create a new StringWriter to capture the stack trace as a string
                writer = new StringWriter();
                // Create a PrintWriter that will be used to write the stack trace to the
                // StringWriter
                printWriter = new PrintWriter(writer);
                // Print the stack trace to the PrintWriter
                ex.printStackTrace(printWriter);
                // Flush the PrintWriter to ensure all data is written to the underlying
                // StringWriter
                printWriter.flush();
                // Retrieve the stack trace as a string from the StringWriter
                stackTrace = writer.toString();
    
                // handle exception that may occur during database interaction
                telemetryClient.trackException(ex);
                telemetryClient.flush();
                context.getLogger().severe("Error: " + ex.getMessage());
                dataMessage = "{ \"message\":\"There is an Internal Server Error!\",\"responseCode\":\"500\",\"description\":"
                        + stackTrace + " }";
                // Build an error response
                responseMessage = request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                        .header("Content-Type", "application/json")
                        .body(dataMessage).build();
            
            } finally {
                       // Close the resources
                if (nonNull(connection)) {
                    connection.close();
                    if (nonNull(statement)) {
                        statement.close();
                    }
                    if (nonNull(resultSet)) {
                        resultSet.close();
                    }
                    telemetryClient.flush();
                }
            }
    
            return responseMessage;
        }

}