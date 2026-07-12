const authorize = (...roles) => {

    return (req, res, next) => {

        const isAllowed =
            roles.includes(req.user.role) ||
            (req.user.role === "super_admin" && roles.includes("admin"));

        if (!isAllowed) {

            return res.status(403).json({

                success: false,

                message: "Unauthorized"

            });

        }

        next();

    };

};

module.exports = {
    authorize,
};