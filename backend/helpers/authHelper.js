const bcrypt = require('bcryptjs');

const hashPassword = (password) => {
    try {
        const saltRounds = 10;
        return bcrypt.hashSync(password, saltRounds);
    } catch (error) {
        console.log("Error in hash password", error);
    }
}

const comparePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
}

module.exports = {
    hashPassword,
    comparePassword,
}