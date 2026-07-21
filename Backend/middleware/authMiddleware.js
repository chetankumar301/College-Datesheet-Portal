const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const { getAccessSecret } = require("../services/tokenService");

const protect = async (req, res, next) => {

    try {

        let token;

        if (

            req.headers.authorization &&

            req.headers.authorization.startsWith("Bearer")

        ) {

            token = req.headers.authorization.split(" ")[1];

        }

        if (!token) {

            return res.status(401).json({

                success: false,

                message: "Not Authorized"

            });

        }

        const decoded = jwt.verify(

            token,

            getAccessSecret()

        );

        let user = await User.findById(decoded.id)

            .select("-password")

            .populate("course")

            .populate("branch")

            .populate("academicSession");

        if (!user) {
            user = await Admin.findById(decoded.id).select("-password");
        }

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }

        req.user = user;

        next();

    }

    catch (err) {

        return res.status(401).json({

            success: false,

            message: "Invalid Token"

        });

    }

};

const adminOnly = (req, res, next) => {

    if (req.user.role !== "admin" && req.user.role !== "super_admin") {

        return res.status(403).json({

            success: false,

            message: "Admin Access Only"

        });

    }

    next();

};

const studentOnly = (req, res, next) => {

    if (req.user.role !== "student") {

        return res.status(403).json({

            success: false,

            message: "Student Access Only"

        });

    }

    next();

};

module.exports = {

    protect,

    adminOnly,

    studentOnly

};
