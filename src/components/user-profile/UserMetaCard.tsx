"use client";
import React, { useState, useEffect, useRef } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import api from "@/lib/api";

export default function UserMetaCard() {
  const { user, refreshUser } = useAuth();
  const { isOpen, openModal, closeModal } = useModal();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.user_metadata) {
        setJobTitle(user.user_metadata.jobTitle || "");
        setLocation(user.user_metadata.location || "");
        setFacebook(user.user_metadata.facebook || "");
        setTwitter(user.user_metadata.twitter || "");
        setLinkedin(user.user_metadata.linkedin || "");
        setInstagram(user.user_metadata.instagram || "");
        setAvatarUrl(user.user_metadata.avatar || null);
    }
  }, [user, isOpen]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
          alert("File too large. Max 5MB.");
          return;
      }

      try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${user?.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
              .from('avatars')
              .upload(filePath, file);

          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(filePath);
          
          setAvatarUrl(publicUrl); 
          
          const { error: updateError } = await supabase.auth.updateUser({
            data: { avatar: publicUrl }
          });

          if (updateError) throw updateError;
          
          // Sync with backend
          try {
              await api.post('/auth/sync-user', {
                  id: user?.id,
                  email: user?.email,
                  full_name: user?.user_metadata.full_name,
                  image: publicUrl 
              });
          } catch (syncError) {
              console.error("Failed to sync avatar to backend:", syncError);
          }

          await refreshUser();
          
      } catch (error: any) {
          console.error("Upload Error:", error);
          alert(`Failed to upload image. Ensure 'avatars' bucket exists in Supabase project and is public: ${error.message}`);
      }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
        const { error } = await supabase.auth.updateUser({
            data: {
                jobTitle,
                location,
                facebook,
                twitter,
                linkedin,
                instagram,
                avatar: avatarUrl 
            }
        });
        
        if (error) throw error;
        await refreshUser();
        closeModal();
    } catch (error: any) {
        alert("Failed to update profile: " + error.message);
    } finally {
        setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            
            {/* Avatar Section */}
            <div 
                className="relative w-24 h-24 border-2 border-brand-500/20 rounded-full group cursor-pointer p-1"
                onClick={() => fileInputRef.current?.click()}
                title="Click to upload new image"
            >
              <div className="w-full h-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                {avatarUrl ? (
                  <Image
                    width={96}
                    height={96}
                    src={avatarUrl}
                    alt="user"
                    className="object-cover w-full h-full shadow-lg"
                    unoptimized
                  />
                ) : (
                  <div className="text-2xl font-bold text-gray-400 uppercase">
                    {user.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('') || user.email?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
              </div>
              
              <div className="absolute bottom-1 right-1 p-2 bg-brand-500 text-white rounded-full shadow-lg border-2 border-white dark:border-gray-900 group-hover:scale-110 transition-transform">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </div>

              <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
              />
            </div>

            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user.user_metadata?.full_name || user.email?.split('@')[0] || "User"}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {jobTitle || "Job Title Not Set"}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {location || "Location Not Set"}
                </p>
              </div>
            </div>
            <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
                {/* Social Links - Only show if set */}
                {facebook && (
                    <a target="_blank" rel="noreferrer" href={facebook} className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.6666 11.2503H13.7499L14.5833 7.91699H11.6666V6.25033C11.6666 5.39251 11.6666 4.58366 13.3333 4.58366H14.5833V1.78374C14.3118 1.7477 13.2858 1.66699 12.2023 1.66699C9.94025 1.66699 8.33325 3.04771 8.33325 5.58342V7.91699H5.83325V11.2503H8.33325V18.3337H11.6666V11.2503Z" fill=""/>
                        </svg>
                    </a>
                )}
                {twitter && (
                   <a href={twitter} target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.1708 1.875H17.9274L11.9049 8.75833L18.9899 18.125H13.4424L9.09742 12.4442L4.12578 18.125H1.36745L7.80912 10.7625L1.01245 1.875H6.70078L10.6283 7.0675L15.1708 1.875ZM14.2033 16.475H15.7308L5.87078 3.43833H4.23162L14.2033 16.475Z" fill=""/>
                        </svg>
                   </a>
                )}
                {linkedin && (
                   <a href={linkedin} target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.78381 4.16645C5.78351 4.84504 5.37181 5.45569 4.74286 5.71045C4.11391 5.96521 3.39331 5.81321 2.92083 5.32613C2.44836 4.83904 2.31837 4.11413 2.59216 3.49323C2.86596 2.87233 3.48886 2.47942 4.16715 2.49978C5.06804 2.52682 5.78422 3.26515 5.78381 4.16645ZM5.83381 7.06645H2.50048V17.4998H5.83381V7.06645ZM11.1005 7.06645H7.78381V17.4998H11.0672V12.0248C11.0672 8.97475 15.0422 8.69142 15.0422 12.0248V17.4998H18.3338V10.8914C18.3338 5.74978 12.4505 5.94145 11.0672 8.46642L11.1005 7.06645Z" fill=""/>
                        </svg>
                   </a>
                )}
                {instagram && (
                   <a href={instagram} target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.8567 1.66699C11.7946 1.66854 12.2698 1.67351 12.6805 1.68573L12.8422 1.69102C13.0291 1.69766 13.2134 1.70599 13.4357 1.71641C14.3224 1.75738 14.9273 1.89766 15.4586 2.10391C16.0078 2.31572 16.4717 2.60183 16.9349 3.06503C17.3974 3.52822 17.6836 3.99349 17.8961 4.54141C18.1016 5.07197 18.2419 5.67753 18.2836 6.56433C18.2935 6.78655 18.3015 6.97088 18.3081 7.15775L18.3133 7.31949C18.3255 7.73011 18.3311 8.20543 18.3328 9.1433L18.3335 9.76463C18.3336 9.84055 18.3336 9.91888 18.3336 9.99972L18.3335 10.2348L18.333 10.8562C18.3314 11.794 18.3265 12.2694 18.3142 12.68L18.3089 12.8417C18.3023 13.0286 18.294 13.213 18.2836 13.4351C18.2426 14.322 18.1016 14.9268 17.8961 15.458C17.6842 16.0074 17.3974 16.4713 16.9349 16.9345C16.4717 17.397 16.0057 17.6831 15.4586 17.8955C14.9273 18.1011 14.3224 18.2414 13.4357 18.2831C13.2134 18.293 13.0291 18.3011 12.8422 18.3076L12.6805 18.3128C12.2698 18.3251 11.7946 18.3306 10.8567 18.3324L10.2353 18.333C10.1594 18.333 10.0811 18.333 10.0002 18.333H9.76516L9.14375 18.3325C8.20591 18.331 7.7306 18.326 7.31997 18.3137L7.15824 18.3085C6.97136 18.3018 6.78703 18.2935 6.56481 18.2831C5.67801 18.2421 5.07384 18.1011 4.5419 17.8955C3.99328 17.6838 3.5287 17.397 3.06551 16.9345C2.60231 16.4713 2.3169 16.0053 2.1044 15.458C1.89815 14.9268 1.75856 14.322 1.7169 13.4351C1.707 13.213 1.69892 13.0286 1.69238 12.8417L1.68714 12.68C1.67495 12.2694 1.66939 11.794 1.66759 10.8562L1.66748 9.1433C1.66903 8.20543 1.67399 7.73011 1.68621 7.31949L1.69151 7.15775C1.69815 6.97088 1.70648 6.78655 1.7169 6.56433C1.75786 5.67683 1.89815 5.07266 2.1044 4.54141C2.3162 3.9928 2.60231 3.52822 3.06551 3.06503C3.5287 2.60183 3.99398 2.31641 4.5419 2.10391C5.07315 1.89766 5.67731 1.75808 6.56481 1.71641C6.78703 1.70652 6.97136 1.69844 7.15824 1.6919L7.31997 1.68666C7.7306 1.67446 8.20591 1.6689 9.14375 1.6671L10.8567 1.66699ZM10.0002 5.83308C7.69781 5.83308 5.83356 7.69935 5.83356 9.99972C5.83356 12.3021 7.69984 14.1664 10.0002 14.1664C12.3027 14.1664 14.1669 12.3001 14.1669 9.99972C14.1669 7.69732 12.3006 5.83308 10.0002 5.83308ZM10.0002 7.49974C11.381 7.49974 12.5002 8.61863 12.5002 9.99972C12.5002 11.3805 11.3813 12.4997 10.0002 12.4997C8.6195 12.4997 7.50023 11.3809 7.50023 9.99972C7.50023 8.61897 8.61908 7.49974 10.0002 7.49974ZM14.3752 4.58308C13.8008 4.58308 13.3336 5.04967 13.3336 5.62403C13.3336 6.19841 13.8002 6.66572 14.3752 6.66572C14.9496 6.66572 15.4169 6.19913 15.4169 5.62403C15.4169 5.04967 14.9488 4.58236 14.3752 4.58308Z" fill=""/>
            </svg>
                </a>
                )}
            </div>
          </div>
          <button onClick={openModal} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.61334 14.5469C2.45501 14.7061 2.37834 14.9202 2.37834 15.1444V16.7919C2.37834 17.2519 2.75084 17.6244 3.21084 17.6244H4.85834C5.08251 17.6244 5.29668 17.5477 5.45584 17.3894L13.7958 9.04938L10.9533 6.20688L2.61334 14.5469ZM15.9892 6.85605C16.2842 6.56105 16.2842 6.08522 15.9892 5.79022L14.2125 4.01355C13.9175 3.71855 13.4417 3.71855 13.1467 4.01355L11.7642 5.39605L14.6067 8.23855L15.9892 6.85605Z" fill="" />
            </svg>
            Edit
          </button>

        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4 p-5 lg:p-11 overflow-y-auto">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Profile Details
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your job title, location, and social links.
            </p>
          </div>
          <form className="flex flex-col" onSubmit={handleSave}>
            <div className="custom-scrollbar max-h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Profile Picture
                </h5>
                <div className="flex items-center gap-5 mb-8">
                    <div className="relative w-20 h-20 border border-gray-200 rounded-full dark:border-gray-800 flex items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-hidden">
                        {avatarUrl ? (
                            <Image
                                width={80}
                                height={80}
                                src={avatarUrl}
                                alt="preview"
                                className="object-cover w-full h-full rounded-full"
                                unoptimized
                            />
                        ) : (
                            <span className="text-xl font-bold text-gray-400 uppercase">
                                 {user.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('') || user.email?.charAt(0) || "U"}
                            </span>
                        )}
                    </div>
                    <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 text-sm font-medium text-brand-500 bg-brand-50 dark:bg-brand-500/10 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors"
                    >
                        Change Photo
                    </button>
                    <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size of 5MB</p>
                </div>

                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  General Info
                </h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mb-6">
                    <div>
                        <Label>Job Title / Role</Label>
                        <Input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Team Manager" />
                    </div>
                    <div>
                        <Label>Location</Label>
                        <Input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. New York, USA" />
                    </div>
                </div>

                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Social Links
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Facebook URL</Label>
                    <Input
                      type="text"
                      value={facebook}
                      onChange={e => setFacebook(e.target.value)}
                      placeholder="https://facebook.com/..."
                    />
                  </div>

                  <div>
                    <Label>X / Twitter URL</Label>
                    <Input type="text" value={twitter} onChange={e => setTwitter(e.target.value)} placeholder="https://x.com/..." />
                  </div>

                  <div>
                    <Label>Linkedin URL</Label>
                    <Input
                      type="text"
                      value={linkedin}
                      onChange={e => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>

                  <div>
                    <Label>Instagram URL</Label>
                    <Input
                      type="text"
                      value={instagram}
                      onChange={e => setInstagram(e.target.value)}
                      placeholder="https://instagram.com/..."
                    />
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
    </>
  );
}
