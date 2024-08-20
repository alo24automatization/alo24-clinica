const socketIo = require("socket.io");
const {
  getDepartments,
  getDepartmentsOnline,
} = require("./routers/offlineclient/clients.route");

const initializeSocket = (server) => {
  const io = socketIo(server, {
    path: "/ws",
    cors: {
      origin: ["http://localhost:3000", "https://unical-med.uz"],
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  const departmentsRequests = new Map(); // Store requests with unique keys

  io.on("connection", (socket) => {
    socket.on("getDepartments", async (data) => {
      const { clinicaId, departments_ids, next, clientId } = data;

      if (data) {
        setInterval(async () => {
          try {
            const departments = await getDepartments(
              clinicaId,
              departments_ids,
              next,
              clientId,
            );

            // Use clinicaId and departments_ids as the unique key
            const key = `${clinicaId}-${departments_ids.join(",")}`;

            // Check if this request already exists
            if (!departmentsRequests.has(key)) {
              // Store the unique request
              departmentsRequests.set(key, departments);
            }

            // Emit only the current request (avoid re-emitting all stored requests)
            io.emit("departmentsData", departments);
          } catch (error) {
            console.error(error);
            socket.emit("error", error.message);
          }
        }, 1000);
      }
    });

    socket.on("getDepartmentsOnline", async (data) => {
      const { clinicaId, departments_id } = data;

      if (data) {
        setInterval(async () => {
          try {
            const clients = await getDepartmentsOnline(
              clinicaId,
              departments_id,
            );
            if (clients.length > 0) {
              io.emit("departmentsOnlineClientsData", clients);
            }
          } catch (error) {
            console.error(error.message);
            socket.emit("error", error.message);
          }
        }, 1000);
      }
    });

    socket.on("disconnect", () => {});
  });

  return io;
};

module.exports = initializeSocket;
