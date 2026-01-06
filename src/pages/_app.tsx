import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const publicPages = ["/auth/login"];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isPublicPage = publicPages.includes(router.pathname);

  return (
    <AuthProvider>
      {isPublicPage ? (
        <Component {...pageProps} />
      ) : (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      )}
    </AuthProvider>
  );
}
