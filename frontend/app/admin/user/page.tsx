'use client'

import AdminUserEditorCard, { EditableUser } from "@/component/Profile/AdminUserEditCard";
import getAllUser from "@/libs/admin/getAllUser";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";


export default function AdminUserPage() {
  const { data: session, status } = useSession();
  const [allUserData, setAllUserData] = useState<EditableUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllUsers() {
      if (!session?.user?.token) return;

      setIsLoading(true);
      setError(null);

      try {
        const res = await getAllUser(session.user.token);
        setAllUserData(res.data ?? []);
      } catch {
        setError("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    }

    if (session?.user?.token) {
      void fetchAllUsers();
      return;
    }

    if (status !== "loading") {
      setIsLoading(false);
    }
  }, [session?.user?.token, status]);

  const handleUserSaved = (updatedUser: EditableUser) => {
    setAllUserData((prev) =>
      prev.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
  };

  const handleUserDeleted = (deletedUserId: string) => {
    setAllUserData((prev) => prev.filter((user) => user._id !== deletedUserId));
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="m-10 text-sm uppercase tracking-[0.2em] text-text-sub">
        Loading users...
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    return (
      <div className="m-10 text-sm uppercase tracking-[0.2em] text-red-400">
        Admin access required
      </div>
    );
  }

  return (
    <main className="m-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-serif text-text-main">User Management</h1>
        <p className="text-sm uppercase tracking-[0.2em] text-text-sub">
          Edit other users without leaving the admin dashboard
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5">
        {allUserData.map((user) => (
          <AdminUserEditorCard
            key={user._id}
            user={user}
            token={session.user.token}
            isCurrentUser={user._id === session.user._id}
            onSaved={handleUserSaved}
            onDeleted={handleUserDeleted}
          />
        ))}
      </div>
    </main>
  );
}
