import { useAuth } from "./AuthContext";

export default function RoleGate({
  roles,
  children
}: {
  roles: string[];
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  if (!user || !roles.includes(user.role)) {
    return (
      <div className="card">
        <h3>Access restricted</h3>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }
  return <>{children}</>;
}
