// Where a user goes after logging in
export default function getHomePath(user) {
  return user?.role === 'admin' ? '/admin/services' : '/dashboard';
}
