import { server } from "./app";

const port = process.env.PORT || 3000;

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});