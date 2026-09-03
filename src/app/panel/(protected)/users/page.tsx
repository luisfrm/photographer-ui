import { getUsersAction, getCurrentUserAction } from "@/app/panel/actions";
import UsersView from "@/components/panel/users/UsersView";

export const metadata = {
  title: "Users | Panel",
};

export default async function UsersPage() {
  const [users, currentUser] = await Promise.all([
    getUsersAction(),
    getCurrentUserAction(),
  ]);

  return <UsersView initialUsers={users} currentUserId={currentUser?.id ?? null} />;
}
