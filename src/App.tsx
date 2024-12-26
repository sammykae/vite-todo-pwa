import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Tasks from "./pages/Tasks";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer position="top-center" />
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Tasks />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
