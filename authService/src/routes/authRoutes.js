const AuthService = require("../services/auth.service");

class AuthController {

    constructor() {
        this.authService = new AuthService();
    }

    register = async (req, res) => {
        try {
            const user = await this.authService.registerUser(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    login = async (req, res) => {
        try {
            const token = await this.authService.loginUser(req.body);
            res.json({ token });

        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    };

}

module.exports = AuthController;