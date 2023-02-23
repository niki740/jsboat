let dataResp = null;

const socketResp = (resp) => {
  dataResp = resp;
};

const conn = async (socket) => {
  // console.log("a user connected", socket.id);
  socket.on("like", (data) => {
    if (dataResp) {
      socket.broadcast.emit("like_response", JSON.stringify(dataResp));
    }
  });
};

module.exports = { socketResp, conn };
