const users = [];

//  Join user to chat

function userJoin(id, username, room) {
  const user = {
    id,
    username,
    room,
  };

  users.push(user);
  return user;
}

//  Get current user

function getCurrentUser(id) {
  return users.find((user) => id === user.id);
}
// user leaves the room

function userLeave(id) {
  // const index = users.findIndex((user) => user.id === id);
  // if (index !== -1) {
  //   return users.splice(index, 1)[0];
  // here splice(index, 1) removes 1 element at position index from the users array.
  //splice() returns an array containing the removed element(s), so [0] is used to extract the first (and only) removed user.
  // }
  const leftUser = users.filter((user) => user.id === id);
  return leftUser[0];
}

// Get room users

function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}
module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
