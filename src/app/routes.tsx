import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProductsPage } from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { PaymentPage } from "./pages/PaymentPage";
import { VerifyPaymentPage } from "./pages/VerifyPaymentPage";
import { OrdersPage } from "./pages/OrdersPage";
import { BlogPage } from "./pages/BlogPage";
import { BlogDetailPage } from "./pages/BlogDetailPage";
import { CouponPage } from "./pages/CouponPage";
import { MyCouponsPage } from "./pages/MyCouponsPage";
import { OwnerDashboard } from "./pages/OwnerDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { WishlistPage } from "./pages/WishlistPage";
import { AboutPage } from "./pages/AboutPage";
import { ShopProfilePage } from "./pages/ShopProfilePage";
import { ComplaintSelectPage } from "./pages/ComplaintSelectPage";
import { ComplaintFormPage } from "./pages/ComplaintFormPage";
import { ComplaintStatusPage } from "./pages/ComplaintStatusPage";
import { AccountPage } from "./pages/AccountPage";
import { AuthProvider } from "./store/AuthContext";
import { CartProvider } from "./store/CartContext";
import { OrderProvider } from "./store/OrderContext";
import { WishlistProvider } from "./store/WishlistContext";
import { NotificationProvider } from "./store/NotificationContext";
import { ChatProvider } from "./store/ChatContext";
import { ShopProvider } from "./store/ShopContext";
import { RecentlyViewedProvider } from "./store/RecentlyViewedContext";
import { Toaster } from "sonner";

function Providers() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <WishlistProvider>
            <NotificationProvider>
              <ShopProvider>
                <ChatProvider>
                  <RecentlyViewedProvider>
                    <Toaster position="top-center" richColors />
                    <Layout />
                  </RecentlyViewedProvider>
                </ChatProvider>
              </ShopProvider>
            </NotificationProvider>
          </WishlistProvider>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Providers,
    children: [
      { index: true, Component: HomePage },
      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },
      { path: "products", Component: ProductsPage },
      { path: "product/:id", Component: ProductDetailPage },
      { path: "cart", Component: CartPage },
      { path: "payment", Component: PaymentPage },
      { path: "verify-payment/:id", Component: VerifyPaymentPage },
      { path: "orders", Component: OrdersPage },
      { path: "blog", Component: BlogPage },
      { path: "blog/:id", Component: BlogDetailPage },
      { path: "coupons", Component: CouponPage },
      { path: "my-coupons", Component: MyCouponsPage },
      { path: "wishlist", Component: WishlistPage },
      { path: "about", Component: AboutPage },
      { path: "shop/:shopId", Component: ShopProfilePage },
      { path: "complaint/select/:orderId", Component: ComplaintSelectPage },
      { path: "complaint/form/:orderId", Component: ComplaintFormPage },
      { path: "complaint/status/:orderId", Component: ComplaintStatusPage },
      { path: "account", Component: AccountPage },
      { path: "owner", Component: OwnerDashboard },
      { path: "admin", Component: AdminDashboard },
      { path: "*", Component: () => <div className="text-center py-16 font-['IBM_Plex_Sans_Thai_Looped',sans-serif]">404 - ไม่พบหน้า</div> },
    ],
  },
]);