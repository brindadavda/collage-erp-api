export function checkRole(role: string) {
  if (role == "ADMIN" || role == "STAFF") {
    return true;
  }

  return false;
}
