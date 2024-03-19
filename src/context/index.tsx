import { AuthProvider } from "./auth";
import QueryProvider from "./react-query/QueryProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <GlobalProviders>{children}</GlobalProviders>
    </AuthProvider>
  );
}

const compose = (providers: React.FC<{ children: React.ReactNode }>[]) =>
  providers.reduce((Prev, Curr) => ({ children }) => {
    const Provider = Prev ? (
      <Prev>
        <Curr>{children}</Curr>
      </Prev>
    ) : (
      <Curr>{children}</Curr>
    );
    return Provider;
  });

const GlobalProviders = compose([
  /* ToastProvider, */
  QueryProvider,
]);
