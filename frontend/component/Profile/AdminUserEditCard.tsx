import Image from "next/image";
import { IUser } from "@/interface";
import ConfirmationModal from "@/component/ui/ConfirmationModal";
import { useEffect, useState } from "react";
import banUser from "@/libs/admin/banUser";
import editAdminUser from "@/libs/admin/editAdminUser";

export type EditableUser = Pick<
  IUser,
  "_id" | "name" | "email" | "tel" | "role" | "status" | "profilePicture"
>;

export default function AdminUserEditorCard({
  user,
  token,
  isCurrentUser,
  onSaved,
  onDeleted,
}: {
  user: EditableUser;
  token: string;
  isCurrentUser: boolean;
  onSaved: (user: EditableUser) => void;
  onDeleted: (userId: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: user.name ?? "",
    email: user.email ?? "",
    tel: user.tel ?? "",
    role: user.role,
    status: user.status,
    profilePicture: user.profilePicture ?? "",
  });
  const avatarSrc = user.profilePicture?.trim() || "";
  const initials = (user.name || "?")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    setForm({
      name: user.name ?? "",
      email: user.email ?? "",
      tel: user.tel ?? "",
      role: user.role,
      status: user.status,
      profilePicture: user.profilePicture ?? "",
    });
  }, [user]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setForm({
      name: user.name ?? "",
      email: user.email ?? "",
      tel: user.tel ?? "",
      role: user.role,
      status: user.status,
      profilePicture: user.profilePicture ?? "",
    });
    setError(null);
    setSuccess(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedTel = form.tel.trim();
    const trimmedProfilePicture = form.profilePicture.trim();

    if (!trimmedName || !trimmedEmail) {
      setError("Name and email are required");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: Record<string, string | null> = {
        name: trimmedName,
        email: trimmedEmail,
        role: form.role,
        status: form.status,
        profilePicture: trimmedProfilePicture || null,
      };

      if (trimmedTel) {
        payload.tel = trimmedTel;
      }

      const data = await editAdminUser(token, user._id, payload);
      onSaved(data.data);
      setSuccess("User updated");
      setIsEditing(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update user"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleHardDelete = async () => {
    setIsDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      await banUser(token, user._id);
      onDeleted(user._id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete user"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <article className="rounded-2xl border border-card-border bg-card p-6 shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-full border border-card-border bg-background">
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt={`${user.name} avatar`}
                  fill
                  className="object-cover"
                />
              ) : null}
              {!avatarSrc ? (
                <div className="flex h-full w-full items-center justify-center text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                  {initials}
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-serif text-text-main">{user.name}</h2>
                {isCurrentUser ? (
                  <span className="rounded-full border border-accent/40 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-accent">
                    Current Admin
                  </span>
                ) : null}
              </div>
              <p className="text-sm text-text-sub">{user.email}</p>
              <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em]">
                <span className="rounded-full border border-white/10 px-3 py-1 text-text-sub">
                  {user.role}
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-text-sub">
                  {user.status}
                </span>
              </div>
            </div>
          </div>

          {!isCurrentUser ? (
            <div className="flex flex-wrap gap-3 md:justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsEditing((prev) => !prev);
                  setError(null);
                  setSuccess(null);
                }}
                className="rounded-xl border border-accent/40 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-accent transition hover:bg-accent hover:text-white"
              >
                {isEditing ? "Close Editor" : "Edit User"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccess(null);
                  setIsDeleteModalOpen(true);
                }}
                disabled={isDeleting}
                className="rounded-xl border border-red-500/40 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-red-400 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Hard Delete"}
              </button>
            </div>
          ) : (
            <p className="text-right text-[11px] uppercase tracking-[0.2em] text-text-sub">
              Edit your own account from the profile page
            </p>
          )}
        </div>

        {isEditing ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.2em] text-text-sub">
                Name
              </span>
              <input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-text-main outline-none transition focus:border-accent"
              />
            </label>

            <label className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.2em] text-text-sub">
                Email
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-text-main outline-none transition focus:border-accent"
              />
            </label>

            <label className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.2em] text-text-sub">
                Telephone
              </span>
              <input
                value={form.tel}
                onChange={(e) => handleChange("tel", e.target.value)}
                placeholder="10 digits"
                className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-text-main outline-none transition focus:border-accent"
              />
            </label>

            <label className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.2em] text-text-sub">
                Profile Picture URL
              </span>
              <input
                type="url"
                value={form.profilePicture}
                onChange={(e) => handleChange("profilePicture", e.target.value)}
                placeholder="https://example.com/avatar.png"
                className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-text-main outline-none transition focus:border-accent"
              />
            </label>

            <label className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.2em] text-text-sub">
                Role
              </span>
              <select
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-text-main outline-none transition focus:border-accent"
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.2em] text-text-sub">
                Status
              </span>
              <select
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-text-main outline-none transition focus:border-accent"
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </label>

            <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={isSaving}
                className="rounded-xl bg-accent px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="rounded-xl border border-card-border px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-text-sub transition hover:text-text-main disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}

        {success ? (
          <p className="mt-4 text-sm text-emerald-400">{success}</p>
        ) : null}
        {error ? (
          <p className="mt-4 text-sm text-red-400">{error}</p>
        ) : null}
      </article>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => void handleHardDelete()}
        title="Delete User"
        message={`This will permanently remove ${user.name} and related records. This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Delete Permanently"}
        isDanger
      />
    </>
  );
}
