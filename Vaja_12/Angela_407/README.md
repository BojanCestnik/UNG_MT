# ShopWallet

ShopWallet is a personal wallet for keeping shopping coupons in one place. It is designed for everyday shoppers of different ages and technical experience, with clear navigation, readable coupon cards and straightforward actions.

## Features

- **Dashboard:** See active coupons, coupons expiring soon and savings recorded for used coupons.
- **Add, edit and delete coupons:** Enter store, category, discount, description, expiration date and an optional code. Editing updates the existing coupon; deleting asks for confirmation.
- **Search and sorting:** Search by store or description. On My Coupons, sort by expiration date or store name.
- **Favourite Stores:** Favourite a coupon with its heart button. Favourite brands appear once; selecting one shows its associated coupons, including used and expired coupons.
- **Expiration and archive:** Coupons show active, expiring soon, expired or used status. Marking a coupon as used records the savings amount and makes it available in Archive. Expired coupons are not automatically archived.
- **Coupon details and code copying:** View a coupon's information and copy its code when one is available.
- **Persistence:** Coupons remain available after refreshing the browser.

## React components and data flow

`App` is the main component. It owns coupon data, the current page, search and sort values, and modal selection. It calculates the coupon lists and totals, then passes data and typed callbacks to child components.

The five main components have distinct responsibilities:

- **Sidebar** displays the ShopWallet brand and navigation; it calls a typed callback when the selected page changes.
- **Header** displays the current page title and profile mark.
- **Dashboard** displays dashboard statistics, search and sorting controls, coupon lists and page-specific content.
- **CouponCard** displays an individual coupon and invokes callbacks for actions such as favouriting, marking it used, editing, deleting and viewing details.
- **App** coordinates these components and owns the shared application state.

Supporting components keep related UI focused:

- **FavouriteStores** groups favourited coupons by brand and displays each brand once.
- **AddCouponModal** handles adding and editing coupons.
- **SavingsModal** collects the amount saved when a coupon is marked as used.
- **CouponDetailsModal** displays full coupon details and handles copying an available code.

State flows down from `App` to child components through typed props. User actions flow back through callback props, so `App` can update the shared coupon state and the affected views.

## State and localStorage

Coupon data and shared interface state are managed with React `useState` in `App`. Coupon forms keep their field values in the form component. Typed `Coupon`, `CouponFormData`, page and sort types are defined in `src/types.ts`.

ShopWallet stores coupons under the `shopwallet-coupons` localStorage key. On startup, it reads and validates saved data, using the starter coupons when usable saved data is unavailable. An effect saves the coupon list whenever it changes. Storage errors are handled without preventing the rest of the interface from rendering.

## Design

The visual design uses:

- Navy `#1E293B` for the brand and major headings.
- Blue `#2563EB` for primary actions and selected navigation.
- White `#FFFFFF` cards on a light-grey `#F8FAFC` background.
- Dark text `#0F172A`, secondary text `#64748B` and borders `#E2E8F0`.
- Green `#16A34A` for positive/active status and orange `#F97316` for warning accents. Darker warning text remains in use where needed for readability.

Rounded coupon cards, restrained shadows, consistent spacing, clear status colors and responsive layouts make information easy to scan without distracting from the coupons. The navy and blue create a consistent identity, while the neutral surfaces keep coupon details legible. Status colors help shoppers distinguish expiration and use state at a glance, and larger controls and a single-column mobile layout support touch use on smaller screens.

## Success criteria

ShopWallet is successful when:

1. Users can add, edit and delete coupons.
2. Users can search and sort coupons.
3. Coupon information persists after refreshing the browser.
4. Users can manage favourite stores and archived coupons.
5. Total savings equal the sum of recorded savings for used coupons, without counting active coupons.
6. The interface is usable on desktop and mobile.
7. `npm run build` and `npm run lint` both pass.

## Run and check

- `npm run dev` starts the development server.
- `npm run build` checks TypeScript and creates a production build.
- `npm run lint` runs the project linter.

Keep the code clean and readable — this will be used to teach React fundamentals, so prefer clarity over cleverness.
