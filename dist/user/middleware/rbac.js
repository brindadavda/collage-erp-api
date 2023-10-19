"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
function checkRole(allowedRoles) {
    return (req, res, next) => {
        const role = req.role;
        if (role && !allowedRoles.includes(role)) {
            return res.status(403).json({ message: `Forbidden, you are a ${role} and this service is only available for ${allowedRoles}` });
        }
        next();
    };
}
exports.checkRole = checkRole;
//# sourceMappingURL=rbac.js.map