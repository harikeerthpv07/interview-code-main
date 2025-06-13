# Chat Application Migration Plan

The goal is to transform the existing project management application into a dedicated chat application, including real-time communication via sockets. This will involve significant changes to both the backend and frontend.

### **1. Backend Modifications (Node.js/Express with Socket.IO)**

- **Integrate Socket.IO:**
  - Install the `socket.io` package in the `Backend` directory.
  - Modify `Backend/src/app.ts` to integrate Socket.IO with the existing Express server.
- **Chat Message Handling:**
  - Remove the existing project-related API routes (`/projects` POST and GET) from `Backend/src/app.ts`.
  - Implement Socket.IO event listeners for `connection`, `disconnect`, and a custom `chat message` event.
  - When a `chat message` is received, store it (initially in an in-memory array for simplicity) and then broadcast it to all connected clients.
- **Basic User Identification:** For a simple chat, we can assign a unique ID to each connected socket or allow clients to send a username with their messages.

### **2. Frontend Modifications (React with Socket.IO Client)**

- **Integrate Socket.IO Client:**
  - Install the `socket.io-client` package in the `Frontend` directory.
  - Create a new service file, e.g., `Frontend/src/services/socketService.ts`, to manage the Socket.IO client connection and event handling.
- **Chat UI Components:**
  - Remove or repurpose existing components related to project management (e.g., `Frontend/src/components/ProjectCard.tsx`, `Frontend/src/pages/ProjectDetailsPage.tsx`, `Frontend/src/pages/ProjectPage.tsx`, `Frontend/src/controller/ProjectController.ts`, `Frontend/src/models/ProjectModels.ts`).
  - Create new React components for the chat interface:
    - `Frontend/src/components/MessageInput.tsx`: For typing and sending messages. This component will emit `chat message` events to the server.
    - `Frontend/src/components/ChatWindow.tsx`: To display a list of chat messages. This component will listen for incoming `chat message` events from the server and update its state to render new messages in real-time.
- **Application Entry Point:**
  - Update `Frontend/src/App.tsx` to initialize the Socket.IO connection and render the new `ChatWindow` and `MessageInput` components.

### **3. File Structure Changes & Cleanup**

- **Backend:**
  - `Backend/src/app.ts`: Will be heavily modified.
  - Consider adding a new model for chat messages, e.g., `Backend/src/models/message.interface.ts`, if message structure becomes complex.
- **Frontend:**
  - New files: `Frontend/src/components/ChatWindow.tsx`, `Frontend/src/components/MessageInput.tsx`, `Frontend/src/services/socketService.ts`.
  - Remove or clean up unused project-related files.
- **Documentation:** Update `README.md` files in both `Backend` and `Frontend` to reflect the new purpose of the application.

### **Architectural Flow (Mermaid Diagram)**

```mermaid
graph TD
    A[User] --> B(Frontend Application);
    B -- "Connect to Socket.IO" --> C[Backend Server (Express + Socket.IO)];
    B -- "Send Message (Socket.emit)" --> C;
    C -- "Broadcast Message (Socket.broadcast.emit)" --> B;
    C -- "Store Message (In-memory)" --> D[Message Storage];
    B -- "Display Message" --> E(Chat UI Components);
```

### **Step-by-Step Implementation Plan:**

1.  **Backend: Install Socket.IO and Modify `app.ts`**
    - Install `socket.io` in `Backend`.
    - Integrate `socket.io` with the Express server in `Backend/src/app.ts`.
    - Remove project-related routes.
    - Add basic Socket.IO connection/disconnection logging and a `chat message` event handler.
2.  **Frontend: Install Socket.IO Client and Create `socketService.ts`**
    - Install `socket.io-client` in `Frontend`.
    - Create `Frontend/src/services/socketService.ts` to manage the socket connection.
3.  **Frontend: Develop Chat UI Components**
    - Create `Frontend/src/components/MessageInput.tsx`.
    - Create `Frontend/src/components/ChatWindow.tsx`.
4.  **Frontend: Update `App.tsx`**
    - Modify `Frontend/src/App.tsx` to render the new chat components and pass down the socket instance.
    - Remove references to old project components.
5.  **Backend: Implement Chat Message Broadcast**
    - Refine the `chat message` event handler in `Backend/src/app.ts` to store messages and broadcast them to all clients.
6.  **Cleanup:**
    - Delete unused project-related files from the `Frontend` directory.
    - Update `README.md` files.
