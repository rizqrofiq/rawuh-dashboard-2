import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";

interface StartSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: number;
  className: string;
  classCode: string;
  onSessionStarted: () => void;
}

export default function StartSessionModal({
  isOpen,
  onClose,
  classId,
  className,
  classCode,
  onSessionStarted,
}: StartSessionModalProps) {
  const [step, setStep] = useState<"select" | "active">("select");
  const [week, setWeek] = useState(1);
  const [mode, setMode] = useState<"original" | "demo">("demo");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep("select");
      setWeek(1);
      setMode("demo");
      setError(null);
      setSessionId(null);
      setToken(null);
      setExpiresAt(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (step !== "active" || mode !== "original" || !sessionId) return;

    const refreshToken = async () => {
      try {
        const res = await apiClient.getSessionToken(sessionId);
        setToken(res.data.token);
        setExpiresAt(res.data.expires_at);
      } catch (err) {
        console.error("Failed to refresh token:", err);
      }
    };

    const interval = setInterval(refreshToken, 30000);
    return () => clearInterval(interval);
  }, [step, mode, sessionId]);

  const handleStartSession = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (mode === "original") {
        const res = await apiClient.startSessionV1(classId, week);
        setSessionId(res.data.session_id);
        setToken(res.data.token);
        setExpiresAt(res.data.expires_at);
      } else {
        const res = await apiClient.startSessionV2(classId, week);
        setSessionId(res.data.session_id);
      }
      setStep("active");
      onSessionStarted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start session");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSession = async () => {
    if (!sessionId) return;
    if (!confirm("Are you sure you want to close this session?")) return;

    setIsLoading(true);
    try {
      if (mode === "original") {
        await apiClient.closeSessionV1(sessionId);
      } else {
        await apiClient.closeSessionV2(sessionId);
      }
      onSessionStarted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to close session");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--rawuh-border)] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--rawuh-text)]">
              {step === "select" ? "Start New Session" : "Active Session"}
            </h2>
            <p className="text-sm text-[var(--rawuh-text-muted)]">
              {className} • {classCode}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-[var(--rawuh-text-muted)]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-[var(--rawuh-error-muted)] border border-[var(--rawuh-error)]/20 rounded-lg">
              <p className="text-sm text-[var(--rawuh-error)]">{error}</p>
            </div>
          )}

          {step === "select" && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--rawuh-text)] mb-2">
                  Select Week
                </label>
                <select
                  value={week}
                  onChange={(e) => setWeek(parseInt(e.target.value))}
                  className="w-full h-12 px-4 rounded-lg border border-[var(--rawuh-border)] bg-white text-[var(--rawuh-text)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--rawuh-primary)] focus:border-transparent cursor-pointer"
                >
                  {Array.from({ length: 16 }, (_, i) => i + 1).map((w) => (
                    <option key={w} value={w}>
                      Week {w}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--rawuh-text)] mb-2">
                  Session Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMode("original")}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      mode === "original"
                        ? "border-[var(--rawuh-primary)] bg-[var(--rawuh-primary-muted)]"
                        : "border-[var(--rawuh-border)] hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`material-symbols-outlined ${
                          mode === "original"
                            ? "text-[var(--rawuh-primary)]"
                            : "text-[var(--rawuh-text-muted)]"
                        }`}
                      >
                        qr_code_2
                      </span>
                      <span
                        className={`font-semibold ${
                          mode === "original"
                            ? "text-[var(--rawuh-primary)]"
                            : "text-[var(--rawuh-text)]"
                        }`}
                      >
                        Original
                      </span>
                    </div>
                    <p className="text-xs text-[var(--rawuh-text-muted)]">
                      QR code + Face recognition for attendance
                    </p>
                  </button>

                  <button
                    onClick={() => setMode("demo")}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      mode === "demo"
                        ? "border-[var(--rawuh-primary)] bg-[var(--rawuh-primary-muted)]"
                        : "border-[var(--rawuh-border)] hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`material-symbols-outlined ${
                          mode === "demo"
                            ? "text-[var(--rawuh-primary)]"
                            : "text-[var(--rawuh-text-muted)]"
                        }`}
                      >
                        face
                      </span>
                      <span
                        className={`font-semibold ${
                          mode === "demo"
                            ? "text-[var(--rawuh-primary)]"
                            : "text-[var(--rawuh-text)]"
                        }`}
                      >
                        Demo
                      </span>
                    </div>
                    <p className="text-xs text-[var(--rawuh-text-muted)]">
                      Face recognition only, no token required
                    </p>
                  </button>
                </div>
              </div>

              <button
                onClick={handleStartSession}
                disabled={isLoading}
                className="w-full py-3 bg-[var(--rawuh-primary)] text-white rounded-xl font-semibold hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">
                      progress_activity
                    </span>
                    Starting...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">
                      play_circle
                    </span>
                    Start Session
                  </>
                )}
              </button>
            </>
          )}

          {step === "active" && (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--rawuh-success-muted)] text-[var(--rawuh-success)] rounded-full mb-4">
                  <span className="w-2 h-2 bg-[var(--rawuh-success)] rounded-full animate-pulse" />
                  <span className="text-sm font-medium">
                    Session Active - Week {week}
                  </span>
                </div>
                <p className="text-sm text-[var(--rawuh-text-muted)]">
                  {mode === "original"
                    ? "Students can scan QR code and use face recognition"
                    : "Students can use face recognition to mark attendance"}
                </p>
              </div>

              {mode === "original" && token && (
                <div className="mb-6">
                  <div className="bg-white border-2 border-[var(--rawuh-border)] rounded-xl p-6 flex flex-col items-center">
                    <div className="w-48 h-48 bg-[var(--rawuh-background)] rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
                      <div className="absolute inset-4 border-2 border-dashed border-[var(--rawuh-text-muted)] rounded-lg" />
                      <div className="text-center">
                        <span className="material-symbols-outlined text-4xl text-[var(--rawuh-text-muted)]">
                          qr_code_2
                        </span>
                        <p className="text-xs text-[var(--rawuh-text-muted)] mt-2">
                          QR Code
                        </p>
                      </div>
                    </div>

                    <div className="w-full p-3 bg-[var(--rawuh-background)] rounded-lg">
                      <p className="text-xs text-[var(--rawuh-text-muted)] mb-1">
                        Session Token
                      </p>
                      <p className="font-mono text-lg font-bold text-[var(--rawuh-text)] tracking-wider text-center">
                        {token}
                      </p>
                    </div>

                    {expiresAt && (
                      <p className="text-xs text-[var(--rawuh-text-muted)] mt-2">
                        Token refreshes automatically
                      </p>
                    )}
                  </div>
                </div>
              )}

              {mode === "demo" && (
                <div className="mb-6 p-6 bg-[var(--rawuh-background)] rounded-xl text-center">
                  <span className="material-symbols-outlined text-5xl text-[var(--rawuh-primary)] mb-3">
                    face
                  </span>
                  <p className="font-medium text-[var(--rawuh-text)]">
                    Face Recognition Mode
                  </p>
                  <p className="text-sm text-[var(--rawuh-text-muted)] mt-1">
                    Students can mark attendance using face recognition on the
                    mobile app
                  </p>
                </div>
              )}

              <button
                onClick={handleCloseSession}
                disabled={isLoading}
                className="w-full py-3 bg-[var(--rawuh-error)] text-white rounded-xl font-semibold hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">
                      progress_activity
                    </span>
                    Closing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">
                      stop_circle
                    </span>
                    Close Session
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
