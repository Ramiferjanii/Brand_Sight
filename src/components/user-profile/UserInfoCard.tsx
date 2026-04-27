"use client";
import React, { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Alert from "../ui/alert/Alert";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export default function UserInfoCard() {
  const { user, refreshUser } = useAuth();
  const { isOpen, openModal, closeModal } = useModal();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{type: "success" | "error", message: string} | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.user_metadata.full_name || "");
      setEmail(user.email || "");
      setPassword("");
      setOldPassword("");
      setShowOldPassword(false);
      setShowNewPassword(false);
      setNotification(null);
    }
  }, [user, isOpen]);

  const handleResetPassword = async () => {
    setNotification(null);
    if (!user?.email) return;
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setNotification({ type: "success", message: "Un email de réinitialisation de mot de passe a été envoyé. Veuillez vérifier votre boîte de réception." });
    } catch (error: any) {
      setNotification({ type: "error", message: "Erreur lors de l'envoi de l'email : " + error.message });
    }
  };



  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);
    try {
        // Handle password update if a new password is provided
        if (password && password.length >= 8) {
            if (!oldPassword) {
                setNotification({ type: "error", message: "Veuillez entrer votre mot de passe actuel pour en définir un nouveau." });
                setLoading(false);
                return;
            }
            
            // Verify old password
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user?.email || '',
                password: oldPassword
            });

            if (signInError) {
                setNotification({ type: "error", message: "Mot de passe actuel incorrect." });
                setLoading(false);
                return;
            }

            // Update to new password
            const { error: updatePasswordError } = await supabase.auth.updateUser({ password: password });
            if (updatePasswordError) throw updatePasswordError;
        }

        // Handle name update
        if (name !== user?.user_metadata.full_name) {
            const { error: updateNameError } = await supabase.auth.updateUser({
              data: { full_name: name }
            });
            if (updateNameError) throw updateNameError;
        }
        
        await refreshUser();
        closeModal();
    } catch (error: any) {
        setNotification({ type: "error", message: "Failed to update profile: " + error.message });
    } finally {
        setLoading(false);
    }
  };

  if (!user) return <div className="p-6 text-gray-500">Loading profile data...</div>;

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Full Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.user_metadata.full_name || "N/A"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.email || "N/A"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                User ID
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90 font-mono text-xs">
                {user.id}
              </p>
            </div>
            
             <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Status
              </p>
              <p className="text-sm font-medium text-green-500">
                {user.aud === 'authenticated' ? "Active" : "Unverified"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z" fill="" />
          </svg>
          Edit
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4 p-5 lg:p-11 overflow-y-auto">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col" onSubmit={handleSave}>
            <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
              {notification && (
                <div className="mb-5">
                  <Alert 
                    variant={notification.type} 
                    title={notification.type === "success" ? "Succès" : "Erreur"} 
                    message={notification.message} 
                  />
                </div>
              )}
              <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                <div>
                  <Label>Full Name</Label>
                  <Input type="text" value={name} onChange={e => setName(e.target.value)} />
                </div>

                <div>
                  <Label>Email Address (Read Only)</Label>
                  <Input type="text" value={email} disabled className="opacity-70 cursor-not-allowed" />
                </div>

                <div>
                    <Label>Current Password</Label>
                    <div className="relative">
                        <Input 
                            type={showOldPassword ? "text" : "password"} 
                            placeholder="Required to set a new password" 
                            value={oldPassword} 
                            onChange={e => setOldPassword(e.target.value)} 
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                            tabIndex={-1}
                        >
                            {showOldPassword ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div>
                    <Label>New Password (Optional)</Label>
                    <div className="relative">
                        <Input 
                            type={showNewPassword ? "text" : "password"} 
                            placeholder="Leave empty to keep current" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                            tabIndex={-1}
                        >
                            {showNewPassword ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            )}
                        </button>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">Min. 8 characters</p>
                      <button 
                        type="button" 
                        onClick={handleResetPassword} 
                        className="text-xs font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
                      >
                        Reset Password via Email
                      </button>
                    </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal} type="button">
                Close
              </Button>
              <Button size="sm" type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
      </Modal>
    </div>
  );
}
