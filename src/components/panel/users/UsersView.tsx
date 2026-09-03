"use client";

import { useState } from "react";
import { UserPlus, Mail, Phone, Calendar, Trash2, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  createAdminUserAction,
  deleteAdminUserAction,
  type AdminUserItem,
} from "@/app/panel/actions";

interface UsersViewProps {
  initialUsers: AdminUserItem[];
  currentUserId: string | null;
}

type NewUserFormState = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

const emptyForm: NewUserFormState = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

export default function UsersView({
  initialUsers,
  currentUserId,
}: Readonly<UsersViewProps>) {
  const [users, setUsers] = useState<AdminUserItem[]>(initialUsers);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [form, setForm] = useState<NewUserFormState>(emptyForm);
  const [isPending, setIsPending] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData();
    formData.set("name", form.name);
    formData.set("email", form.email);
    formData.set("phone", form.phone);
    formData.set("password", form.password);

    const result = await createAdminUserAction(null, formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.success || "User created successfully");
      setIsSheetOpen(false);
      setForm(emptyForm);

      // Optimistically add user to list
      const newUser: AdminUserItem = {
        id: `temp-${Date.now()}`,
        email: form.email,
        name: form.name,
        phone: form.phone,
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => [newUser, ...prev]);
    }

    setIsPending(false);
  };

  const handleDeleteUser = async (user: AdminUserItem) => {
    if (user.id === currentUserId) {
      toast.error("You cannot delete your own account");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete user "${user.name}" (${user.email})? This action cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(user.id);
    const result = await deleteAdminUserAction(user.id);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.success || "User deleted successfully");
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    }

    setDeletingId(null);
  };

  const getInitials = (name: string, email: string) => {
    if (name && name !== "User") {
      return name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }
    return email ? email.substring(0, 2).toUpperCase() : "US";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage administrative team members with access to the studio panel.
          </p>
        </div>

        <Button
          onClick={() => setIsSheetOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-xs self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Create User
        </Button>
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => {
          const isCurrentUser = user.id === currentUserId;
          const initials = getInitials(user.name, user.email);

          return (
            <div
              key={user.id}
              className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between relative group"
            >
              <div>
                {/* User Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary border border-primary/25 font-bold text-base flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                          {user.name}
                        </h3>
                        {isCurrentUser && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/25">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">Administrator</p>
                    </div>
                  </div>

                  {!isCurrentUser && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user)}
                      disabled={deletingId === user.id}
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50 -mr-2 -mt-1 rounded-lg"
                      aria-label={`Delete ${user.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* User Details */}
                <div className="space-y-2.5 text-sm text-gray-600 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-primary shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>

                  {user.phone ? (
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-primary shrink-0" />
                      <span>{user.phone}</span>
                    </div>
                  ) : null}

                  <div className="flex items-center gap-2.5 text-xs text-gray-400">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Joined{" "}
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Recently"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create User Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <form onSubmit={handleCreateUser} className="flex flex-col h-full">
            <SheetHeader className="pb-4 border-b border-gray-100">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold mb-2 border border-primary/25 self-start">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Access</span>
              </div>
              <SheetTitle className="text-2xl font-serif text-gray-900">
                Create New User
              </SheetTitle>
              <SheetDescription className="text-sm text-gray-500">
                Add an administrative user. They will have full access to manage content,
                appointments, and studio settings.
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-4 py-6">
              <div className="space-y-1.5">
                <Label htmlFor="create-user-name" className="text-sm text-gray-900">
                  Full name
                </Label>
                <Input
                  id="create-user-name"
                  name="name"
                  type="text"
                  placeholder="e.g. Maria Gonzalez"
                  required
                  value={form.name}
                  onChange={onChange}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="create-user-email" className="text-sm text-gray-900">
                  Email address
                </Label>
                <Input
                  id="create-user-email"
                  name="email"
                  type="email"
                  placeholder="photographer@example.com"
                  required
                  value={form.email}
                  onChange={onChange}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="create-user-phone" className="text-sm text-gray-900">
                  Phone number <span className="text-gray-400 font-normal">(Optional)</span>
                </Label>
                <Input
                  id="create-user-phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={onChange}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="create-user-password" className="text-sm text-gray-900">
                  Temporary password
                </Label>
                <PasswordInput
                  id="create-user-password"
                  name="password"
                  placeholder="Min. 6 characters"
                  required
                  value={form.password}
                  onChange={onChange}
                />
                <p className="text-xs text-gray-400">
                  Must be at least 6 characters. The user can use this password to sign in immediately.
                </p>
              </div>
            </div>

            <SheetFooter className="pt-4 border-t border-gray-100 flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSheetOpen(false)}
                className="w-1/2 rounded-xl"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-1/2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl"
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Create User"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
