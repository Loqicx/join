[![Build and deploy](https://github.com/Loqicx/join/actions/workflows/main.yml/badge.svg)](https://github.com/Loqicx/join/actions/workflows/main.yml)

# Join — Kanban Board

Join is a Kanban board project implemented with Angular for the frontend and Firebase (Firestore & Auth) for the backend. The application allows creating, editing, moving (drag & drop) and deleting tasks as well as managing contacts and users.

#### [Demo](https://join.haensch.dev)

## Key Features

-   Kanban board with four lists (To do, In progress, Await feedback, Done)
-   Drag & Drop for task movement
-   Task details with subtasks, priority, due date and assignments
-   Contact management
-   Firebase Authentication & Firestore for persistence

## Tech Stack

-   Frontend: Angular
-   Backend: Firebase (Firestore, Authentication)
-   Styling: SCSS

## Local Development

1. Install dependencies:
    ```bash
    npm install
    ```
2. Start development server:

    ```bash
    ng serve
    ```

    Default: http://localhost:4200

3. Build for production:

    ```bash
    ng build
    ```

4. Tests:
    - Unit tests: `ng test`
    - E2E (if configured): `ng e2e`

## Deployment

The project includes a Firebase configuration; deployment can be done via the Firebase CLI (see `firebase.json`).

## Contributing

-   Fork → Branch → PR
-   Code style: follow SCSS and Angular conventions
-   Add tests for new features

## License

See LICENSE in the repository (if present).
