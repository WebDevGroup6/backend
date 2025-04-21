// Middleware to check if the user has one of the required roles

export const checkRole = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      // This assumes the user object with a 'role' property is attached
      // by the verifyToken middleware after decoding the JWT.
      // Ensure your JWT payload includes the user's role.
      console.warn(
        "User role not found in request. Ensure verifyToken runs first and JWT contains role."
      );
      return res
        .status(403)
        .json({ message: "Forbidden: Role information missing." });
    }

    const userRole = req.user.role;

    if (!requiredRoles.includes(userRole)) {
      return res
        .status(403)
        .json({
          message: `Forbidden: Requires one of roles [${requiredRoles.join(
            ", "
          )}]`,
        });
    }

    next(); // User has the required role, proceed
  };
};
