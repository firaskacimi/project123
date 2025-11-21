"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { api, setAuthToken } from "@/app/lib/api";

type ChangePasswordProps = { userId: string };

function ChangePasswordForm({ userId }: ChangePasswordProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Le mot de passe de confirmation ne correspond pas.");
      return;
    }

    setLoading(true);
    try {
      // ensure token present in headers
      setAuthToken();

      // Try common endpoint first
      try {
        const res = await api.post("/auth/change-password", {
          currentPassword,
          newPassword,
        });
        if (res?.data) {
          toast.success("Mot de passe changé avec succès.");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setLoading(false);
          return;
        }
      } catch (err: any) {
        // If endpoint not available or fails, fall through to alternate
      }

      // Fallback: put to /users/:id/password
      try {
        const res2 = await api.put(`/users/${userId}/password`, {
          currentPassword,
          newPassword,
        });
        if (res2?.data) {
          toast.success("Mot de passe changé avec succès.");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setLoading(false);
          return;
        }
      } catch (err: any) {
        const msg = err?.response?.data?.message || err.message || "Échec du changement de mot de passe";
        toast.error(msg);
      }
    } catch (err: any) {
      toast.error(err?.message || "Erreur lors de la modification du mot de passe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="password"
        placeholder="Mot de passe actuel"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="w-full p-3 rounded bg-neutral-800 border border-gray-700 text-white"
        required
      />
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full p-3 rounded bg-neutral-800 border border-gray-700 text-white"
        required
      />
      <input
        type="password"
        placeholder="Confirmer le nouveau mot de passe"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full p-3 rounded bg-neutral-800 border border-gray-700 text-white"
        required
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-red-500 rounded text-white font-semibold hover:bg-red-600 disabled:opacity-60"
        >
          {loading ? "En cours..." : "Changer le mot de passe"}
        </button>
      </div>
    </form>
  );
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Retrieve user from localStorage
    const userRaw = localStorage.getItem("user");
    if (!userRaw) {
      toast.error("Vous devez être connecté pour accéder à votre profil");
      router.push("/login");
      return;
    }

    try {
      const userData = JSON.parse(userRaw);
      setUser(userData);
    } catch (err) {
      toast.error("Erreur lors du chargement du profil");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="min-h-screen py-25 p-6 flex items-start justify-center bg-neutral-950 text-white">
      <div className="w-full max-w-2xl bg-[#0b0e17] rounded-xl p-8 border border-gray-800">
        <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>

        <div className="space-y-6">
          {/* Personal Information Section */}
          <div className="bg-neutral-900 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-cyan-400">Informations Personnelles</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Prénom</label>
                <div className="w-full p-3 rounded bg-neutral-800 border border-gray-700 text-white">
                  {user.firstName}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Nom</label>
                <div className="w-full p-3 rounded bg-neutral-800 border border-gray-700 text-white">
                  {user.lastName}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <div className="w-full p-3 rounded bg-neutral-800 border border-gray-700 text-white">
                  {user.email}
                </div>
              </div>

              {user.createdAt && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Membre depuis</label>
                  <div className="w-full p-3 rounded bg-neutral-800 border border-gray-700 text-white">
                    {formatDate(user.createdAt)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Change Password Section */}
          <div className="bg-neutral-900 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-red-400">Changer le mot de passe</h2>
            <ChangePasswordForm userId={user._id} />
          </div>

          {/* Quick Links Section */}
          <div className="bg-neutral-900 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Liens Rapides</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/orders"
                className="p-4 bg-linear-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 rounded-lg text-center font-semibold transition"
              >
                📋 Mes Commandes
              </Link>
              <Link
                href="/cart"
                className="p-4 bg-linear-to-r from-cyan-600 to-cyan-800 hover:from-cyan-500 hover:to-cyan-700 rounded-lg text-center font-semibold transition"
              >
                🛒 Mon Panier
              </Link>
              <Link
                href="/products"
                className="p-4 bg-linear-to-r from-pink-600 to-pink-800 hover:from-pink-500 hover:to-pink-700 rounded-lg text-center font-semibold transition"
              >
                🎮 Parcourir les Produits
              </Link>
              <Link
                href="/"
                className="p-4 bg-linear-to-r from-yellow-600 to-yellow-800 hover:from-yellow-500 hover:to-yellow-700 rounded-lg text-center font-semibold transition"
              >
                🏠 Accueil
              </Link>
            </div>
          </div>

          {/* Account Statistics (optional) */}
          <div className="bg-neutral-900 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-green-400">Statistiques du Compte</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">👤</div>
                <div className="text-sm text-gray-400">Compte Actif</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">✓</div>
                <div className="text-sm text-gray-400">Email Vérifié</div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
