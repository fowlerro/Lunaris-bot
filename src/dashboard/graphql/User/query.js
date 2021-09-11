const { UserType } = require("./types/User");

const getUser = {
    type: UserType,
    resolve(parent, args, request) {
        return request.user ? request.user : null;
    }
}

module.exports = { getUser }