import { createRoot } from "react-dom/client";
import "./global.css";
import MainLayout from "./layout/MainLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { store } from "./app/store";
import { Provider } from "react-redux";

export const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <MainLayout />
       <ReactQueryDevtools/>
    </Provider>
  </QueryClientProvider>
);
