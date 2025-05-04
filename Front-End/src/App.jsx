import "./styles/style.css";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { UserDataProvider } from "./context/UserDataContext";
import AppLayout from "./ui/AppLayout";
import ErrorBoundary from "./ui/ErrorBoundary";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60, // 1 minute
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools
                initialIsOpen={false}
                buttonPosition="bottom-left"
            />
            <ErrorBoundary>
                <UserDataProvider>
                    <AppLayout />
                </UserDataProvider>
            </ErrorBoundary>
            <Toaster
                position="top-center"
                gutter={12}
                containerClassName={{ marginTop: "0.5rem" }}
                toastOptions={{
                    success: {
                        duration: 3000,
                        style: {
                            backgroundColor: "#d1fae5",
                            color: "#065f46",
                            fontWeight: "500",
                            padding: "0.75rem 1rem",
                            borderRadius: "0.75rem",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        },
                    },
                    error: {
                        duration: 5000,
                        style: {
                            backgroundColor: "#fee2e2",
                            color: "#991b1b",
                            fontWeight: "500",
                            padding: "0.75rem 1rem",
                            borderRadius: "0.75rem",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        },
                    },
                    loading: {
                        duration: 1000,
                        style: {
                            backgroundColor: "#bfdbfe",
                            color: "#1e3a8a",
                            fontWeight: "500",
                            padding: "0.75rem 1rem",
                            borderRadius: "0.75rem",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        },
                    },
                    style: {
                        fontSize: "1rem",
                        maxWidth: "28rem",
                        padding: "1rem 1.5rem",
                        backgroundColor: "#ffffff",
                        color: "#4b5563",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    },
                }}
            />
        </QueryClientProvider>
    );
}

export default App;
