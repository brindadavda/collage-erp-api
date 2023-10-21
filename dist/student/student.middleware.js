"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
function checkRole(role) {
    if (role == "ADMIN" || role == "STAFF") {
        return true;
    }
    return false;
}
exports.checkRole = checkRole;
//# sourceMappingURL=student.middleware.js.map