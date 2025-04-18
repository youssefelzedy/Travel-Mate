import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "./styles/style.css";
import AppLayout from "./ui/AppLayout";
import ErrorBoundary from "./ui/ErrorBoundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60, // 1 minutes
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
                <AppLayout />
            </ErrorBoundary>
        </QueryClientProvider>
    );
}

export default App;
