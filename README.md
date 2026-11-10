# South Esquina local store

## Run the site

The storefront, product catalog, customer registration, and admin dashboard use a local Python server and SQLite database. Python 3.10 or newer is recommended; no additional packages are needed.

From PowerShell, run:

```powershell
python server.py
```

On the first run, create the admin username and password when prompted. Keep these private. Then open:

- Storefront: <http://127.0.0.1:8000/>
- Admin dashboard: <http://127.0.0.1:8000/admin.html>
- Customer sign-in and registration: <http://127.0.0.1:8000/account.html>

The server binds to `127.0.0.1`, so it is available only on this computer. The SQLite database is stored at `%USERPROFILE%\.south-esquina\storefront.sqlite3`; uploaded product images are stored in `uploads\products`. Back up both before moving or reinstalling the site.

The admin can add, edit, and remove products, upload front/back/size-chart images, set inventory quantities for each size, and control the New Releases and Most Popular sections. The four original tees and the Live in Wealth tees are initialized with 5 units for every size and color. The Journey of Becoming sweaters are priced at ₱1,600 and have 5 units in each charted size (XS–3XL) and color; One of One tees are initialized with 5 units in each charted size (XS–3XL) and color. Product pages limit cart quantities to available stock. Signed-in customers can leave one star rating and optional written comment per product. Admins can hide or permanently delete reviews in the dashboard. Customers can create an account, sign in, and sign out. Customer registrations are listed in the admin dashboard; passwords are stored as salted hashes and are never displayed.

This local Python server is not a production or Hostinger deployment setup. Do not expose it to the internet. Public hosting requires a production backend, HTTPS, deployment-specific security settings, and a migration of the local database and image storage.
