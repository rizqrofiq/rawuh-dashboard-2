import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminOnly from "@/components/auth/AdminOnly";
import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <AdminOnly>
      <DashboardLayout
        title="Settings"
        subtitle="Manage your account and application settings"
      >
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 shrink-0">
            <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-2">
              {[
                { id: "general", label: "General", icon: "settings" },
                { id: "profile", label: "Profile", icon: "person" },
                {
                  id: "notifications",
                  label: "Notifications",
                  icon: "notifications",
                },
                { id: "security", label: "Security", icon: "lock" },
                { id: "api", label: "API Settings", icon: "code" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-[var(--rawuh-primary-muted)] text-[var(--rawuh-primary)]"
                      : "text-[var(--rawuh-text-muted)] hover:bg-gray-50"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === "general" && (
              <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-6">
                <h3 className="text-lg font-semibold text-[var(--rawuh-text)] mb-6">
                  General Settings
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--rawuh-text)] mb-2">
                      Language
                    </label>
                    <select className="w-full h-10 px-4 bg-white rounded-lg text-sm border border-[var(--rawuh-border)]">
                      <option value="en">English</option>
                      <option value="id">Bahasa Indonesia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--rawuh-text)] mb-2">
                      Timezone
                    </label>
                    <select className="w-full h-10 px-4 bg-white rounded-lg text-sm border border-[var(--rawuh-border)]">
                      <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                      <option value="Asia/Makassar">
                        Asia/Makassar (WITA)
                      </option>
                      <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--rawuh-text)] mb-2">
                      Date Format
                    </label>
                    <select className="w-full h-10 px-4 bg-white rounded-lg text-sm border border-[var(--rawuh-border)]">
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[var(--rawuh-background)] rounded-lg">
                    <div>
                      <p className="font-medium text-[var(--rawuh-text)]">
                        Dark Mode
                      </p>
                      <p className="text-sm text-[var(--rawuh-text-muted)]">
                        Enable dark mode for the dashboard
                      </p>
                    </div>
                    <button className="w-12 h-6 bg-gray-200 rounded-full relative">
                      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-all" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-6">
                <h3 className="text-lg font-semibold text-[var(--rawuh-text)] mb-6">
                  Profile Settings
                </h3>

                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold">
                    AT
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-[var(--rawuh-primary)] text-white rounded-lg text-sm font-medium hover:bg-blue-600">
                      Change Photo
                    </button>
                    <p className="text-sm text-[var(--rawuh-text-muted)] mt-2">
                      JPG, GIF or PNG. Max size 2MB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--rawuh-text)] mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Dr. Alan Turing"
                      className="w-full h-10 px-4 bg-white rounded-lg text-sm border border-[var(--rawuh-border)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--rawuh-text)] mb-2">
                      NIP
                    </label>
                    <input
                      type="text"
                      defaultValue="197001011990031001"
                      disabled
                      className="w-full h-10 px-4 bg-gray-50 rounded-lg text-sm border border-[var(--rawuh-border)] text-[var(--rawuh-text-muted)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--rawuh-text)] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="turing@example.com"
                      className="w-full h-10 px-4 bg-white rounded-lg text-sm border border-[var(--rawuh-border)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--rawuh-text)] mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      defaultValue="Computer Science"
                      disabled
                      className="w-full h-10 px-4 bg-gray-50 rounded-lg text-sm border border-[var(--rawuh-border)] text-[var(--rawuh-text-muted)]"
                    />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[var(--rawuh-border)] flex justify-end">
                  <button className="px-6 py-2 bg-[var(--rawuh-primary)] text-white rounded-lg text-sm font-medium hover:bg-blue-600">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-6">
                <h3 className="text-lg font-semibold text-[var(--rawuh-text)] mb-6">
                  Notification Settings
                </h3>

                <div className="space-y-4">
                  {[
                    {
                      title: "Session Reminders",
                      desc: "Get notified before your scheduled sessions",
                    },
                    {
                      title: "Attendance Alerts",
                      desc: "Receive alerts when students record attendance",
                    },
                    {
                      title: "Low Attendance Warnings",
                      desc: "Get notified when attendance drops below threshold",
                    },
                    {
                      title: "Email Notifications",
                      desc: "Receive notifications via email",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-[var(--rawuh-background)] rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-[var(--rawuh-text)]">
                          {item.title}
                        </p>
                        <p className="text-sm text-[var(--rawuh-text-muted)]">
                          {item.desc}
                        </p>
                      </div>
                      <button
                        className={`w-12 h-6 rounded-full relative ${
                          i < 2 ? "bg-[var(--rawuh-primary)]" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                            i < 2 ? "right-1" : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-6">
                <h3 className="text-lg font-semibold text-[var(--rawuh-text)] mb-6">
                  Security Settings
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--rawuh-text)] mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full h-10 px-4 bg-white rounded-lg text-sm border border-[var(--rawuh-border)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--rawuh-text)] mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full h-10 px-4 bg-white rounded-lg text-sm border border-[var(--rawuh-border)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--rawuh-text)] mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full h-10 px-4 bg-white rounded-lg text-sm border border-[var(--rawuh-border)]"
                    />
                  </div>
                  <button className="px-6 py-2 bg-[var(--rawuh-primary)] text-white rounded-lg text-sm font-medium hover:bg-blue-600">
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === "api" && (
              <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-6">
                <h3 className="text-lg font-semibold text-[var(--rawuh-text)] mb-6">
                  API Settings
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--rawuh-text)] mb-2">
                      API Base URL
                    </label>
                    <input
                      type="text"
                      defaultValue="https://service.rawuh.rofiq.dev/api/v1"
                      className="w-full h-10 px-4 bg-white rounded-lg text-sm border border-[var(--rawuh-border)] font-mono"
                    />
                  </div>
                  <div className="p-4 bg-[var(--rawuh-background)] rounded-lg">
                    <p className="text-sm font-medium text-[var(--rawuh-text)] mb-2">
                      API Documentation
                    </p>
                    <a
                      href="#"
                      className="text-sm text-[var(--rawuh-primary)] hover:underline"
                    >
                      View API Documentation →
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </AdminOnly>
  );
}
