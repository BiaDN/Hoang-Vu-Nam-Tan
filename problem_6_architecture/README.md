# Scoreboard API Module Specification

## 1. Overview
This document specifies the API module responsible for managing and updating the scoreboard on our website. The scoreboard displays the top 10 users with the highest scores and must support real-time updates while ensuring robust security and comprehensive business logic processing to accommodate advanced score calculations, promotions, and analytics.

## 2. Functional Requirements
### 2.1 Features
- **Fetch Top 10 Scores**: Provide an endpoint to retrieve the top 10 user scores.
- **Update Score**: Update a user's score upon completion of an action. The update process includes a series of validations and business logic steps to ensure data integrity and enrich the score update with bonus calculations, achievements, and analytics.
- **Real-time Updates**: Ensure that any score update is immediately propagated to all users viewing the scoreboard.
- **Security & Data Integrity**: Prevent unauthorized modifications via JWT authentication, rate limiting, and thorough server-side validation. Implement additional business rules to adjust scores based on membership, bonus points, and special events.

### 2.2 API Endpoints
#### 2.2.1 Get Top 10 Scores
- **Endpoint**: `GET /api/scores/top`
- **Description**: Retrieves the top 10 scores from the database.
- **Response Example**:

```json
[
  {"user": "User1", "score": 1200},
  {"user": "User2", "score": 1150}
]
```

#### 2.2.2 Update User Score
- **Endpoint**: `POST /api/scores/update`
- **Description**: Updates the score of a user after an action, processing a detailed execution flow that includes validation, security checks, and business logic enhancements.

- **Request Example**:

```json
{
  "user_id": "12345",
  "score_delta": 50,
  "auth_token": "valid-jwt-token"
}
```

### Execution Flow
#### **User Action & API Reception**
1. **Actor/User Action**: User initiates a score update action.
2. **API Receives Score Update**: The request is received by the API.

#### **Initial Validations**
3. **Check Rate Limit**: Ensure that the user is not spamming the update endpoint.
4. **Validate Request Data**: Verify that all required fields (`user_id`, `score_delta`, `auth_token`) are provided and correctly formatted.
5. **Verify JWT Token**: Authenticate the request.
   - **Error Branch**: If JWT validation fails, the system immediately rejects the update and returns an error response.

#### **Business Logic Processing (Success Branch)**
6. **Parse Score Data**: Extract and process the incoming `score_delta`.
7. **Load User Profile**: Retrieve additional user data (e.g., membership level, historical stats) from the user profile service.
8. **Compare Old Score vs New Score**: Analyze the difference between the current score and the new score delta.
9. **Check Membership/Subscription**: Determine if the user holds any premium status or special subscription which might affect the score update.
10. **Calculate Bonus Points**: Compute bonus points based on criteria such as membership level, win streaks, or event participation.
11. **Update Partial Stats**: Adjust additional metrics (e.g., kill/death ratio, time played) that may be tied to the score.
12. **Check Achievements/Challenges**: Evaluate if the score update qualifies the user for any new achievements or challenges.
13. **Record Analytics Event**: Log the score update event for future analytics and reporting.
14. **Check Special Events/Promotions**: Identify if any ongoing promotions or special events (e.g., double points) should be applied.
15. **Enqueue Tasks for Async Processing**: Queue any asynchronous tasks (e.g., sending emails, notifications) related to the score update.
16. **Send Data to 3rd-Party Service**: Forward relevant update information to any third-party integrations or partner systems.
17. **Acquire DB Lock**: Ensure data integrity by acquiring a lock on the database record before updating.
18. **Update Score in DB**: Persist the new score (along with bonus adjustments and updated stats) in the database.
29. **Log Update**: Record the update operation in an audit log for security and monitoring.
20. **Broadcast to Clients**: Use WebSockets or similar technologies to immediately push the updated scoreboard to connected clients.
21. **Send Notifications**: Optionally notify the user (or other systems) about the score update via push/email notifications.
22. **Check step (6 -> 21)**: if any step fails from step 6->21, the system immediately rejects the update and returns an error response.
23. **Return Success Response**: The API responds with a success message confirming the update.
24. **User Sees Updated Scoreboard**: The updated scoreboard is rendered on the client side in real-time.

- **Response Example**:

```json
{
  "message": "Score updated successfully.",
  "new_score": 1250,
  "bonus_points": 20
}
```

### 2.3 Security Measures
- **JWT Authentication**: Ensure only authenticated users can perform score updates.
- **Rate Limiting**: Prevent abuse by limiting the number of update requests per user within a given timeframe.
- **Server-side Data Validation**: Confirm that score changes are within acceptable parameters and are not susceptible to direct database manipulation.
- **Database Locking**: Use locks to prevent race conditions during concurrent score updates.
- **Audit Logging**: Maintain logs of score updates for tracking and forensic purposes.

## 3. Execution Flow Diagram
A detailed execution flow diagram is provided in the file `scoreboard_flow_full.drawio`. This diagram illustrates both the validation (error branch) and the comprehensive business logic (success branch) steps described above.

## 4. Performance & Scalability Considerations
- **Real-time Updates**: Implement WebSocket or similar push mechanisms to ensure users see live updates.
- **Caching**: Utilize caching solutions (e.g., Redis) to optimize frequent queries for the leaderboard.
- **Async Processing**: Offload non-critical tasks (such as notifications and third-party integrations) to background job queues to maintain API responsiveness.

## 5. Additional Comments for Improvement
- **Extended Business Logic**: Continuously refine business rules (e.g., bonus calculations, achievements) based on user feedback and analytics.
- **Monitoring & Alerts**: Set up real-time monitoring for the API to detect anomalies or potential security threats.
- **Modular Architecture**: Consider splitting the API into microservices (e.g., separate services for score processing, notifications, analytics) to improve maintainability and scalability.

## Architecture
[![Architecture Diagram](scoreboard_flow_full_image.html)][1]