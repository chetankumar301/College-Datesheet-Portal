const adminOnly = (req, res, next) => {

    if (!req.user || req.user.role !== "admin") {

        return res.status(403).json({

            success: false,

            message: "Admin Access Only"

        });

    }

    next();

};

module.exports = {
    adminOnly
};
