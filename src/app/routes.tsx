import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { PaymentPage } from "./pages/PaymentPage";
import { VerifyPaymentPage } from "./pages/VerifyPaymentPage";
import { OrdersPage } from "./pages/OrdersPage";
import { BlogPage } from "./pages/BlogPage";
import { BlogDetailPage } from "./pages/BlogDetailPage";
import { CouponPage } from "./pages/CouponPage";
import { OwnerDashboard } from "./pages/OwnerDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { WishlistPage } from "./pages/WishlistPage";
import { AboutPage } from "./pages/AboutPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
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
      { path: "wishlist", Component: WishlistPage },
      { path: "about", Component: AboutPage },
      { path: "owner", Component: OwnerDashboard },
      { path: "admin", Component: AdminDashboard },
      { path: "*", Component: () => <div className="text-center py-16 font-['IBM_Plex_Sans_Thai_Looped',sans-serif]">404 - ไม่พบหน้า</div> },
    ],
  },
]);