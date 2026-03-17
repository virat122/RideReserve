const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserRepository = require("../repositories/user.repository");

class AuthService {

  constructor() {
    this.userRepository = new UserRepository();
  }

  async registerUser(data) {

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.createUser({
      email: data.email,
      password: hashedPassword
    });

    return user;

  }

  async loginUser(data) {

    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new Error("User not found");
    }

    const match = await bcrypt.compare(data.password, user.password);

    if (!match) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { id: user.id },
      "SECRET_KEY",
      { expiresIn: "1h" }
    );

    return token;

  }

}

module.exports = AuthService;