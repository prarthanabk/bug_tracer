# **Design Report for Local Jam.dev Clone Browser Extension**

## **Table of Contents**

1. [Introduction](#introduction)
2. [Objectives](#objectives)
3. [System Overview](#system-overview)
   - 3.1 [High-Level Architecture](#high-level-architecture)
4. [Object-Oriented Design](#object-oriented-design)
   - 4.1 [Browser Extension](#browser-extension)
     - 4.1.1 [Background Script Classes](#background-script-classes)
     - 4.1.2 [Content Script Classes](#content-script-classes)
   - 4.2 [React Frontend (Popup UI)](#react-frontend-popup-ui)
     - 4.2.1 [Components](#components)
   - 4.3 [Node.js Server](#nodejs-server)
     - 4.3.1 [Models](#models)
     - 4.3.2 [Controllers](#controllers)
     - 4.3.3 [Utilities](#utilities)
   - 4.4 [Relationships](#relationships)
5. [Function-Oriented Design](#function-oriented-design)
   - 5.1 [Browser Extension](#browser-extension-1)
     - 5.1.1 [Background Script Functions](#background-script-functions)
     - 5.1.2 [Content Script Functions](#content-script-functions)
   - 5.2 [React Frontend (Popup UI)](#react-frontend-popup-ui-1)
   - 5.3 [Node.js Server](#nodejs-server-1)
     - 5.3.1 [Authentication Functions](#authentication-functions)
     - 5.3.2 [Report Functions](#report-functions)
   - 5.4 [Data Flow](#data-flow)
6. [Conclusion](#conclusion)
7. [Appendices](#appendices)
   - [Appendix A: Database Schema Diagram](#appendix-a-database-schema-diagram)
   - [Appendix B: Sequence Diagrams](#appendix-b-sequence-diagrams)
   - [Appendix C: Class Diagrams](#appendix-c-class-diagrams)

---

## **1. Introduction**

This report presents the design of a local-only browser extension that replicates the core features of Jam.dev. The extension aims to collect user feedback and technical data for issue reporting, integrating with a backend server and database for data storage and report generation.

---

## **2. Objectives**

- **Develop a browser extension** that can collect logs, errors, network requests, performance metrics, and system information.
- **Implement a React-based popup UI** for user interactions, including login, registration, issue reporting, and settings.
- **Create a Node.js server** to handle user authentication, data storage, and PDF report generation.
- **Design a MySQL database schema** to store users, reports, and related data.
- **Provide both object-oriented and function-oriented designs** for better understanding and future scalability.
- **Include diagrams** to visually represent the system's architecture and workflows.

---

## **3. System Overview**

### **3.1 High-Level Architecture**

The system comprises three main components:

1. **Browser Extension**: Includes background scripts and content scripts to collect data and interact with the user.
2. **React Frontend (Popup UI)**: Provides the user interface for authentication and issue reporting.
3. **Node.js Server with MySQL Database**: Handles backend operations, including user authentication, data storage, and report generation.

**Figure 1: High-Level Architecture**

```
+-------------------------+        +-----------------------+
|                         |        |                       |
|    Browser Extension    |        |    React Frontend     |
| (Background & Content   |<------>|    (Popup UI)         |
|         Scripts)        |        |                       |
+-------------------------+        +-----------------------+
          |
          |
          v
+-------------------------+
|                         |
|    Node.js Server       |
|   (Express Framework)   |
|                         |
+-------------------------+
          |
          |
          v
+-------------------------+
|                         |
|     MySQL Database      |
|                         |
+-------------------------+
```

---

## **4. Object-Oriented Design**

### **4.1 Browser Extension**

#### **4.1.1 Background Script Classes**

##### **User**

- **Attributes**:
  - `email`: String
  - `token`: String
- **Methods**:
  - `setUser(userData)`: Stores user credentials.
  - `clearUser()`: Clears user data upon logout.

##### **Report**

- **Attributes**:
  - `description`: String
  - `logs`: Array\<String\>
  - `errors`: Array\<Error\>
  - `networkRequests`: Array\<NetworkRequest\>
  - `performanceMetrics`: PerformanceMetrics
  - `systemInfo`: SystemInfo
- **Methods**:
  - `collectData()`: Aggregates all necessary data.
  - `generateReport()`: Sends data to the server for report creation.
  - `resetData()`: Clears collected data after report generation.

##### **NotificationManager**

- **Attributes**:
  - `notifications`: Array\<Notification\>
- **Methods**:
  - `createNotification(notificationData)`: Generates user notifications.
  - `handleButtonClick(notificationId, buttonIndex)`: Manages notification interactions.

**Class Diagram for Background Scripts**

```
+--------------------+
|       User         |
+--------------------+
| - email: String    |
| - token: String    |
+--------------------+
| + setUser()        |
| + clearUser()      |
+--------------------+

+-----------------------------+
|           Report            |
+-----------------------------+
| - description: String       |
| - logs: Array<String>       |
| - errors: Array<Error>      |
| - networkRequests: Array<NetworkRequest> |
| - performanceMetrics: PerformanceMetrics |
| - systemInfo: SystemInfo    |
+-----------------------------+
| + collectData()             |
| + generateReport()          |
| + resetData()               |
+-----------------------------+

+---------------------------+
|    NotificationManager    |
+---------------------------+
| - notifications: Array<Notification> |
+---------------------------+
| + createNotification()              |
| + handleButtonClick()               |
+---------------------------+
```

#### **4.1.2 Content Script Classes**

##### **Logger**

- **Attributes**:
  - `logs`: Array\<String\>
- **Methods**:
  - `overrideConsole()`: Captures `console.log` outputs.
  - `sendLog(message)`: Sends logs to the background script.

##### **ErrorHandler**

- **Attributes**:
  - `errors`: Array\<Error\>
- **Methods**:
  - `captureErrors()`: Listens for global errors.
  - `sendError(error)`: Sends error details to the background script.

##### **NetworkInterceptor**

- **Attributes**:
  - `networkRequests`: Array\<NetworkRequest\>
- **Methods**:
  - `overrideFetch()`: Intercepts fetch API calls.
  - `overrideXHR()`: Intercepts XMLHttpRequest calls.
  - `sendNetworkRequest(request)`: Sends network data to the background script.

##### **PerformanceMetrics**

- **Attributes**:
  - `loadTime`: Number
  - `memoryUsage`: Number
- **Methods**:
  - `collectMetrics()`: Gathers performance data.

**Class Diagram for Content Scripts**

```
+--------------------+       +--------------------+
|      Logger        |       |   ErrorHandler     |
+--------------------+       +--------------------+
| - logs: Array<String>      | - errors: Array<Error> |
+--------------------+       +--------------------+
| + overrideConsole()|       | + captureErrors()  |
| + sendLog()        |       | + sendError()      |
+--------------------+       +--------------------+

+------------------------+
|  NetworkInterceptor    |
+------------------------+
| - networkRequests: Array<NetworkRequest> |
+------------------------+
| + overrideFetch()      |
| + overrideXHR()        |
| + sendNetworkRequest() |
+------------------------+

+------------------------+
|  PerformanceMetrics    |
+------------------------+
| - loadTime: Number     |
| - memoryUsage: Number  |
+------------------------+
| + collectMetrics()     |
+------------------------+
```

### **4.2 React Frontend (Popup UI)**

#### **4.2.1 Components**

##### **App**

- **State Attributes**:
  - `currentScreen`: String
  - `isAuthenticated`: Boolean
- **Methods**:
  - `handleLogin(screen)`: Updates state upon login.
  - `handleRegister(screen)`: Updates state upon registration.
  - `handleLogout()`: Clears user data.
  - `renderScreen()`: Renders the appropriate component.

##### **Login**

- **State Attributes**:
  - `email`: String
  - `password`: String
- **Methods**:
  - `handleLogin()`: Authenticates the user.

##### **Register**

- **State Attributes**:
  - `name`: String
  - `email`: String
  - `password`: String
- **Methods**:
  - `handleRegister()`: Registers a new user.

##### **ReportIssue**

- **State Attributes**:
  - `description`: String
- **Methods**:
  - `handleSubmit()`: Initiates report generation.

##### **Settings**

- **Methods**:
  - `handleLogout()`: Logs out the user.

**Component Hierarchy Diagram**

```
App
├── Login
├── Register
├── ReportIssue
└── Settings
```

### **4.3 Node.js Server**

#### **4.3.1 Models**

##### **User**

- **Attributes**:
  - `id`: Number
  - `email`: String
  - `passwordHash`: String
  - `name`: String
- **Methods**:
  - `create(userData)`: Adds a user to the database.
  - `findByEmail(email)`: Retrieves a user by email.
  - `validatePassword(password)`: Checks password validity.

##### **Report**

- **Attributes**:
  - `id`: Number
  - `userId`: Number
  - `description`: String
  - `createdAt`: DateTime
- **Methods**:
  - `create(reportData)`: Adds a report to the database.
  - `fetchData(reportId)`: Retrieves report details.

##### **Log**

- **Attributes**:
  - `id`: Number
  - `reportId`: Number
  - `message`: String
- **Methods**:
  - `bulkCreate(logs)`: Inserts multiple logs.

##### **Error**

- **Attributes**:
  - `id`: Number
  - `reportId`: Number
  - `message`: String
  - `stack`: String
- **Methods**:
  - `bulkCreate(errors)`: Inserts multiple errors.

##### **NetworkRequest**

- **Attributes**:
  - `id`: Number
  - `reportId`: Number
  - `url`: String
  - `status`: Number
  - `response`: String
- **Methods**:
  - `bulkCreate(networkRequests)`: Inserts multiple network requests.

##### **PerformanceMetric**

- **Attributes**:
  - `id`: Number
  - `reportId`: Number
  - `loadTime`: Number
  - `memoryUsage`: Number
- **Methods**:
  - `create(metrics)`: Adds performance metrics.

##### **SystemInfo**

- **Attributes**:
  - `id`: Number
  - `reportId`: Number
  - `userAgent`: String
  - `platform`: String
  - `language`: String
- **Methods**:
  - `create(info)`: Adds system information.

**Class Diagram for Node.js Server Models**

```
+-----------------+
|      User       |
+-----------------+
| - id: Number    |
| - email: String |
| - passwordHash: String |
| - name: String  |
+-----------------+
| + create()      |
| + findByEmail() |
| + validatePassword() |
+-----------------+

+-----------------+
|     Report      |
+-----------------+
| - id: Number    |
| - userId: Number|
| - description: String |
| - createdAt: DateTime |
+-----------------+
| + create()      |
| + fetchData()   |
+-----------------+

+-----------------+
|      Log        |
+-----------------+
| - id: Number    |
| - reportId: Number |
| - message: String |
+-----------------+
| + bulkCreate()  |
+-----------------+

+-----------------+
|     Error       |
+-----------------+
| - id: Number    |
| - reportId: Number |
| - message: String |
| - stack: String |
+-----------------+
| + bulkCreate()  |
+-----------------+

+------------------------+
|   NetworkRequest       |
+------------------------+
| - id: Number           |
| - reportId: Number     |
| - url: String          |
| - status: Number       |
| - response: String     |
+------------------------+
| + bulkCreate()         |
+------------------------+

+------------------------+
|  PerformanceMetric     |
+------------------------+
| - id: Number           |
| - reportId: Number     |
| - loadTime: Number     |
| - memoryUsage: Number  |
+------------------------+
| + create()             |
+------------------------+

+------------------------+
|     SystemInfo         |
+------------------------+
| - id: Number           |
| - reportId: Number     |
| - userAgent: String    |
| - platform: String     |
| - language: String     |
+------------------------+
| + create()             |
+------------------------+
```

#### **4.3.2 Controllers**

##### **AuthController**

- **Methods**:
  - `register(req, res)`: Handles user registration.
  - `login(req, res)`: Manages user login and token issuance.

##### **ReportController**

- **Methods**:
  - `createReport(req, res)`: Processes report data.
  - `generatePDF(reportId)`: Generates PDF reports.

#### **4.3.3 Utilities**

##### **JWTService**

- **Methods**:
  - `generateToken(user)`: Creates JWT tokens.
  - `verifyToken(token)`: Validates JWT tokens.

##### **HashService**

- **Methods**:
  - `hashPassword(password)`: Hashes passwords.
  - `comparePassword(password, hash)`: Compares passwords to hashes.

### **4.4 Relationships**

- **User** has many **Reports**.
- **Report** has many **Logs**, **Errors**, and **NetworkRequests**.
- **Report** has one **PerformanceMetric**.
- **Report** has one **SystemInfo**.

**ER Diagram for Database Schema**

```
[User] 1----* [Report]
[Report] 1----* [Log]
[Report] 1----* [Error]
[Report] 1----* [NetworkRequest]
[Report] 1----1 [PerformanceMetric]
[Report] 1----1 [SystemInfo]
```

---

## **5. Function-Oriented Design**

### **5.1 Browser Extension**

#### **5.1.1 Background Script Functions**

- `initializeExtension()`: Initializes event listeners.
- `handleMessages(message, sender, sendResponse)`: Main message handler.
  - `processLog(message)`: Stores logs.
  - `processError(message)`: Stores errors.
  - `processNetworkRequest(message)`: Stores network requests.
  - `setUserData(user)`: Saves user data.
  - `clearUserData()`: Clears user data.
  - `generateReport(description)`: Initiates report generation.
    - `getPerformanceMetrics()`: Requests metrics from content script.
    - `collectSystemInfo()`: Gathers system info.
    - `compileReportData()`: Assembles report data.
    - `sendReportToServer(reportData)`: Submits data to the server.
- `handleNotificationClick(notificationId, buttonIndex)`: Manages notification actions.

#### **5.1.2 Content Script Functions**

- `overrideConsoleLog()`: Captures console logs.
- `captureGlobalErrors()`: Listens for errors.
- `interceptFetchRequests()`: Intercepts fetch calls.
- `interceptXHRRequests()`: Intercepts XHR calls.
- `handleContentMessages(message, sender, sendResponse)`: Handles messages.
  - `providePerformanceMetrics()`: Sends metrics to background script.

**Sequence Diagram for Report Generation**

```
User -> Popup UI: Enters issue description
Popup UI -> Background Script: generateReport(description)
Background Script -> Content Script: getPerformanceMetrics()
Content Script -> Background Script: performanceMetrics
Background Script: collect logs, errors, network requests
Background Script: compile report data
Background Script -> Server: sendReportToServer(reportData)
Server -> Database: Store report data
Server: generate PDF
Server -> Background Script: Confirmation with PDF filename
Background Script -> User: Notification of report generation
User -> Background Script: Clicks notification to download PDF
Background Script -> Server: Request PDF
Server -> Background Script: Send PDF
Background Script -> User: PDF downloaded
```

### **5.2 React Frontend (Popup UI)**

- **Login Functions**:
  - `submitLogin()`: Sends login data to the server.
- **Register Functions**:
  - `submitRegistration()`: Sends registration data.
- **ReportIssue Functions**:
  - `submitIssueDescription()`: Initiates report generation.
- **Settings Functions**:
  - `logoutUser()`: Logs out the user.

### **5.3 Node.js Server**

#### **5.3.1 Authentication Functions**

- `registerUser(req, res)`: Processes user registration.
  - `hashPassword(password)`: Hashes the password.
  - `storeUserInDatabase(userData)`: Saves user data.
- `loginUser(req, res)`: Authenticates the user.
  - `retrieveUserByEmail(email)`: Gets user data.
  - `comparePasswords(inputPassword, storedHash)`: Validates password.
  - `issueJWT(user)`: Issues a JWT token.

#### **5.3.2 Report Functions**

- `createReport(req, res)`: Handles report data.
  - `authenticateRequest(token)`: Validates the token.
  - `insertReportData(reportData)`: Saves report data.
  - `generatePDFReport(reportId)`: Generates a PDF.

### **5.4 Data Flow**

1. **User Interaction**:
   - Users register and log in via the popup UI.
   - Credentials are sent to the server.
   - JWT tokens are issued upon successful authentication.

2. **Data Collection**:
   - Users describe issues in the popup UI.
   - Background scripts collect logs, errors, network data, and metrics.
   - Data is compiled into a report.

3. **Report Submission**:
   - Reports are sent to the server with authentication tokens.
   - Server validates and stores data.

4. **PDF Generation and Notification**:
   - Server generates a PDF report.
   - Users are notified and can download the PDF.

---

## **6. Conclusion**

This design report outlines both the object-oriented and function-oriented designs of a local-only browser extension that replicates core features of Jam.dev. By leveraging modern web technologies such as React for the frontend and Node.js with MySQL for the backend, the system provides a comprehensive solution for issue reporting and data collection.

The object-oriented design focuses on encapsulating data and behaviors within classes, promoting modularity and reusability. The function-oriented design emphasizes the flow of data and the sequence of operations, providing a clear understanding of how different parts of the system interact.

By combining these two design approaches and including diagrams, the system achieves both robustness and clarity, ensuring that future enhancements and maintenance can be carried out efficiently.

---

## **7. Appendices**

### **Appendix A: Database Schema Diagram**

**Entity-Relationship Diagram (ERD)**

```
[users]
- id (PK)
- email (UNIQUE)
- password_hash
- name

[reports]
- id (PK)
- user_id (FK to users.id)
- description
- created_at

[logs]
- id (PK)
- report_id (FK to reports.id)
- message

[errors]
- id (PK)
- report_id (FK to reports.id)
- message
- stack

[network_requests]
- id (PK)
- report_id (FK to reports.id)
- url
- status
- response

[performance_metrics]
- id (PK)
- report_id (FK to reports.id)
- load_time
- memory_usage

[system_info]
- id (PK)
- report_id (FK to reports.id)
- user_agent
- platform
- language
```

**Relationships:**

- Each **user** can have multiple **reports**.
- Each **report** can have multiple **logs**, **errors**, and **network_requests**.
- Each **report** has one **performance_metrics** and one **system_info**.

**Diagram:**

```
[users] 1---* [reports]
[reports] 1---* [logs]
[reports] 1---* [errors]
[reports] 1---* [network_requests]
[reports] 1---1 [performance_metrics]
[reports] 1---1 [system_info]
```

### **Appendix B: Sequence Diagrams**

#### **User Registration and Login**

```
User -> Popup UI: Opens extension
User -> Popup UI: Navigates to Register/Login
Popup UI -> Server: POST /register or POST /login
Server -> Database: Insert or Retrieve user
Server -> Popup UI: Registration/Login success with token
Popup UI -> Background Script: Stores user data and token
```

#### **Issue Reporting**

```
User -> Popup UI: Enters issue description
Popup UI -> Background Script: Requests report generation
Background Script -> Content Script: Requests data
Content Script -> Background Script: Sends logs, errors, network data, metrics
Background Script -> Server: Submits report data with token
Server -> Database: Stores report and related data
Server: Generates PDF report
Server -> Background Script: Sends confirmation with PDF info
Background Script -> User: Notification about report generation
User -> Background Script: Clicks to download PDF
Background Script -> Server: Requests PDF
Server -> Background Script: Sends PDF file
Background Script -> User: Initiates PDF download
```

### **Appendix C: Class Diagrams**

#### **Browser Extension Classes**

(Refer to the class diagrams provided in sections [4.1.1](#background-script-classes) and [4.1.2](#content-script-classes).)

#### **Server-Side Classes**

(Refer to the class diagrams provided in section [4.3.1](#models).)

---

**Prepared by**: [Your Name]

**Date**: [Current Date]

---
