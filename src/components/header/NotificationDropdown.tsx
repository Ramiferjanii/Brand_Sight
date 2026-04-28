"use client";
import React, { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import api from "../../lib/api"; // Added the proper relative path because "@/lib/api" is not guaranteed

import { useAuth } from "@/context/AuthContext";

type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  createdAt: string;
};

export default function NotificationDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Increased interval to 30s to reduce load
    return () => clearInterval(interval);
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
        const response = await api.get('/notifications');
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unreadCount || 0);
    } catch (error: any) {
        if (error.response?.status !== 401) {
            console.error('Failed to fetch notifications:', error);
        }
    }
  };

  const markAsRead = async (id: string, isAlreadyRead: boolean) => {
      if (isAlreadyRead) return;
      try {
          await api.put(`/notifications/${id}/read`);
          setUnreadCount(prev => Math.max(0, prev - 1));
          setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      } catch (error) {
          console.error("Failed to mark as read", error);
      }
  };

  const markAllAsRead = async () => {
      if (unreadCount === 0) return;
      try {
          await api.put(`/notifications/read-all`);
          setUnreadCount(0);
          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      } catch (error) {
          console.error("Failed to mark all as read", error);
      }
  };

  function toggleDropdown() {
    setIsOpen(!isOpen);
    // When opened, we can also conditionally clear all visually
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + " yr ago";
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + " mo ago";
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + " d ago";
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + " hr ago";
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + " min ago";
    return Math.max(0, Math.floor(seconds)) + " sec ago";
  };

  const getTypeColor = (type: string) => {
      switch(type) {
          case 'success': return 'bg-success-500';
          case 'error': return 'bg-error-500';
          case 'warning': return 'bg-orange-500';
          default: return 'bg-blue-500';
      }
  }

  return (
    <div className="relative">
      <button
        className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={toggleDropdown}
      >
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0.5 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-orange-400 text-[10px] font-medium text-white shadow-sm ring-2 ring-white dark:ring-gray-900">
             {unreadCount > 9 ? '9+' : unreadCount}
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
          </span>
        )}
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notifications
          </h5>
          <div className="flex gap-2 items-center">
              {unreadCount > 0 && (
                <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-brand-500 hover:text-brand-600 dark:text-brand-400 transition"
              >
                Mark all read
              </button>
              )}
              <button
                onClick={toggleDropdown}
                className="text-gray-500 transition dropdown-toggle dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <svg
                  className="fill-current"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
          </div>
        </div>
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {notifications.length === 0 ? (
              <li className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  No notifications to show.
              </li>
          ) : (
             notifications.map((notification) => (
                <li key={notification.id}>
                  <DropdownItem
                    onItemClick={() => {
                        markAsRead(notification.id, notification.isRead);
                    }}
                    className={`flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 dark:border-gray-800 transition-colors ${
                        !notification.isRead 
                        ? "bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-900/10 dark:hover:bg-blue-900/20" 
                        : "hover:bg-gray-100 dark:hover:bg-white/5"
                    }`}
                  >
                        <div className={`mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white ${getTypeColor(notification.type)}`}>
                            {notification.type === 'success' ? (
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                            ) : notification.type === 'error' ? (
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                            ) : (
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            )}
                        </div>
      
                    <span className="block flex-1 min-w-0">
                      <span className="mb-1 block text-theme-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-gray-800 dark:text-white/90 mr-1 block truncate">
                          {notification.title}
                        </span>
                        <span className="line-clamp-2 text-xs h-auto overflow-hidden text-ellipsis leading-4">
                            {notification.message}
                        </span>
                      </span>
      
                      <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400 font-medium">
                        <span>{formatTimeAgo(notification.createdAt)}</span>
                        {!notification.isRead && (
                             <span className="w-1.5 h-1.5 bg-brand-500 rounded-full ml-auto"></span>
                        )}
                      </span>
                    </span>
                  </DropdownItem>
                </li>
             ))
          )}
        </ul>
      </Dropdown>
    </div>
  );
}
