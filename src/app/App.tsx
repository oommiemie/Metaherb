import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./store/AuthContext";
import { CartProvider } from "./store/CartContext";
import { OrderProvider } from "./store/OrderContext";
import { WishlistProvider } from "./store/WishlistContext";
import { NotificationProvider } from "./store/NotificationContext";
import { ChatProvider } from "./store/ChatContext";
import { RecentlyViewedProvider } from "./store/RecentlyViewedContext";
import { Toaster } from "sonner";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <WishlistProvider>
            <NotificationProvider>
              <ChatProvider>
                <RecentlyViewedProvider>
                  <Toaster position="top-center" richColors />
                  <RouterProvider router={router} />
                </RecentlyViewedProvider>
              </ChatProvider>
            </NotificationProvider>
          </WishlistProvider>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}
