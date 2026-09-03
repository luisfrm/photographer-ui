import { hasRegisteredUsersAction } from "../actions";
import AuthCard from "./AuthCard";

export const metadata = {
  title: "Panel Access",
};

export default async function LoginPage() {
  const hasRegisteredUsers = await hasRegisteredUsersAction();

  return <AuthCard initialHasUsers={hasRegisteredUsers} />;
}