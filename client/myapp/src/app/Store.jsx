import { configureStore} from '@reduxjs/toolkit';
import UserSlice from '../features/UserFeature';
import ProductSlice from '../features/ProductFeatures';
import WishlistSlice from '../features/WishlistFeature';
import CartSlice from '../features/CartFeatures';
import BuyNowForMeSlice from '../features/BuyNowForMeFeatures';
import notificationSlice from '../features/NotificationFeature';
import sellerSlice from '../features/SellerFeature';
import VendorSlice from '../features/VendorFeatures';
 const Store = configureStore({
    reducer: {
        user: UserSlice,
        product : ProductSlice,
        wishlist : WishlistSlice,
        cart : CartSlice,
        buyNowForMe: BuyNowForMeSlice,
        notification : notificationSlice,
        seller : sellerSlice,
        vendor : VendorSlice
    }
})

export default Store ;
