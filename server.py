import getpass
import hashlib
import hmac
import json
import os
import re
import secrets
import sqlite3
import sys
import uuid
from datetime import datetime, timedelta, timezone
from email import policy
from email.parser import BytesParser
from http.cookies import SimpleCookie
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parent
DB_PATH = Path(os.environ.get("SOUTH_ESQUINA_DB", Path.home() / ".south-esquina" / "storefront.sqlite3"))
UPLOAD_DIR = ROOT / "uploads" / "products"
HOST = "127.0.0.1"
PORT = int(os.environ.get("SOUTH_ESQUINA_PORT", "8000"))
CATEGORIES = ("Tees", "Hoodies", "Sweaters", "Polos", "Pants", "Shorts")
MAX_BODY_SIZE = 25 * 1024 * 1024
MAX_IMAGE_SIZE = 8 * 1024 * 1024
PASSWORD_ROUNDS = 310_000
ADMIN_SESSION_HOURS = 8
CUSTOMER_SESSION_DAYS = 30
LOGIN_FAILURES = {}

INITIAL_PRODUCTS = (
    {
        "id": "from-the-south-black",
        "name": "From The South - Black",
        "category": "Tees",
        "price": 800,
        "description": "",
        "sizes": ["S", "M", "L", "XL"],
        "stock": {"S": 5, "M": 5, "L": 5, "XL": 5},
        "frontImage": "TEES/From The South - South Esquina/From The South - Black (front).png",
        "backImage": "TEES/From The South - South Esquina/From The South - Black (back).png",
        "sizeChartImage": "TEES/From The South - South Esquina/From The South - Black (Size Chart).png",
        "isNewRelease": False,
        "isPopular": True,
    },
    {
        "id": "from-the-south-white",
        "name": "From The South - White",
        "category": "Tees",
        "price": 800,
        "description": "",
        "sizes": ["S", "M", "L", "XL"],
        "stock": {"S": 5, "M": 5, "L": 5, "XL": 5},
        "frontImage": "TEES/From The South - South Esquina/From The South - White (front).png",
        "backImage": "TEES/From The South - South Esquina/From The South - White (back).png",
        "sizeChartImage": "TEES/From The South - South Esquina/From The South - White (Size Chart).png",
        "isNewRelease": False,
        "isPopular": True,
    },
    {
        "id": "luxury-black",
        "name": "Luxury - Black",
        "category": "Tees",
        "price": 800,
        "description": "",
        "sizes": ["S", "M", "L", "XL"],
        "stock": {"S": 5, "M": 5, "L": 5, "XL": 5},
        "frontImage": "TEES/Luxury - South Esquina/Luxury - Black (front).png",
        "backImage": "TEES/Luxury - South Esquina/Luxury - Black (back).png",
        "sizeChartImage": "TEES/Luxury - South Esquina/Luxury - Black (Size Chart).png",
        "isNewRelease": True,
        "isPopular": False,
    },
    {
        "id": "luxury-white",
        "name": "Luxury - White",
        "category": "Tees",
        "price": 800,
        "description": "",
        "sizes": ["S", "M", "L", "XL"],
        "stock": {"S": 5, "M": 5, "L": 5, "XL": 5},
        "frontImage": "TEES/Luxury - South Esquina/Luxury - White (front).png",
        "backImage": "TEES/Luxury - South Esquina/Luxury - White (back).png",
        "sizeChartImage": "TEES/Luxury - South Esquina/Luxury - White (Size Chart).png",
        "isNewRelease": True,
        "isPopular": False,
    },
    {
        "id": "live-in-wealth-black",
        "name": "Live in Wealth - Black",
        "category": "Tees",
        "price": 800,
        "description": "",
        "sizes": ["S", "M", "L", "XL"],
        "stock": {"S": 5, "M": 5, "L": 5, "XL": 5},
        "frontImage": "TEES/Live in Wealth - South Esquina/Live in Wealth - Black (front).png",
        "backImage": "TEES/Live in Wealth - South Esquina/Live in Wealth - Black (back).png",
        "sizeChartImage": "TEES/Live in Wealth - South Esquina/Live in Wealth - Black (size chat).png",
        "isNewRelease": True,
        "isPopular": False,
    },
    {
        "id": "live-in-wealth-white",
        "name": "Live in Wealth - White",
        "category": "Tees",
        "price": 800,
        "description": "",
        "sizes": ["S", "M", "L", "XL"],
        "stock": {"S": 5, "M": 5, "L": 5, "XL": 5},
        "frontImage": "TEES/Live in Wealth - South Esquina/Live in Wealth - White (front).png",
        "backImage": "TEES/Live in Wealth - South Esquina/Live in Wealth - White (back).png",
        "sizeChartImage": "TEES/Live in Wealth - South Esquina/Live in Wealth - White (size chart).png",
        "isNewRelease": True,
        "isPopular": False,
    },
    {
        "id": "journey-of-becoming-black",
        "name": "Journey of Becoming - Black",
        "category": "Sweaters",
        "price": 1400,
        "description": "",
        "sizes": ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
        "stock": {"XS": 5, "S": 5, "M": 5, "L": 5, "XL": 5, "2XL": 5, "3XL": 5},
        "frontImage": "SWEATERS/Journey of Becoming - South Esquina/Journey of Becoming - Black (front).jpg",
        "backImage": "SWEATERS/Journey of Becoming - South Esquina/Journey of Becoming - Black (back).jpg",
        "sizeChartImage": "SWEATERS/Journey of Becoming - South Esquina/Journey of Becoming - Black (size chart).jpg",
        "isNewRelease": True,
        "isPopular": False,
    },
    {
        "id": "journey-of-becoming-white",
        "name": "Journey of Becoming - White",
        "category": "Sweaters",
        "price": 1400,
        "description": "",
        "sizes": ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
        "stock": {"XS": 5, "S": 5, "M": 5, "L": 5, "XL": 5, "2XL": 5, "3XL": 5},
        "frontImage": "SWEATERS/Journey of Becoming - South Esquina/Journey of Becoming - White (front).jpg",
        "backImage": "SWEATERS/Journey of Becoming - South Esquina/Journey of Becoming - White (back).jpg",
        "sizeChartImage": "SWEATERS/Journey of Becoming - South Esquina/Journey of Becoming - White (size chart).jpg",
        "isNewRelease": True,
        "isPopular": False,
    },
    {
        "id": "one-of-one-black",
        "name": "One of One - Black",
        "category": "Tees",
        "price": 800,
        "description": "",
        "sizes": ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
        "stock": {"XS": 5, "S": 5, "M": 5, "L": 5, "XL": 5, "2XL": 5, "3XL": 5},
        "frontImage": "TEES/One of One - South Esquina/One of One - Black (front).jpg",
        "backImage": "TEES/One of One - South Esquina/One of One - Black (back).jpg",
        "sizeChartImage": "TEES/One of One - South Esquina/One of One - Black (size chart).jpg",
        "isNewRelease": True,
        "isPopular": False,
    },
    {
        "id": "one-of-one-white",
        "name": "One of One - White",
        "category": "Tees",
        "price": 800,
        "description": "",
        "sizes": ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
        "stock": {"XS": 5, "S": 5, "M": 5, "L": 5, "XL": 5, "2XL": 5, "3XL": 5},
        "frontImage": "TEES/One of One - South Esquina/One of One - White (front).jpg",
        "backImage": "TEES/One of One - South Esquina/One of One - White (back).jpg",
        "sizeChartImage": "TEES/One of One - South Esquina/One of One - White (size chart).jpg",
        "isNewRelease": True,
        "isPopular": False,
    },
)


def db_connect():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH, timeout=10)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def hash_password(password, salt=None):
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PASSWORD_ROUNDS)
    return salt.hex(), digest.hex()


def password_matches(password, salt_hex, digest_hex):
    _, candidate = hash_password(password, bytes.fromhex(salt_hex))
    return hmac.compare_digest(candidate, digest_hex)


def utc_now():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def initialize_database():
    with db_connect() as connection:
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                price REAL NOT NULL,
                description TEXT NOT NULL DEFAULT '',
                sizes TEXT NOT NULL,
                stock TEXT NOT NULL DEFAULT '{}',
                front_image TEXT NOT NULL,
                back_image TEXT NOT NULL DEFAULT '',
                size_chart_image TEXT NOT NULL DEFAULT '',
                is_new_release INTEGER NOT NULL DEFAULT 0,
                is_popular INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS admins (
                username TEXT PRIMARY KEY COLLATE NOCASE,
                salt TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS admin_sessions (
                token_hash TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                expires_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS customers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE COLLATE NOCASE,
                salt TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS customer_sessions (
                token_hash TEXT PRIMARY KEY,
                customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
                expires_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS product_reviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
                rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
                comment TEXT NOT NULL DEFAULT '',
                is_hidden INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                UNIQUE (product_id, customer_id)
            );
            CREATE TABLE IF NOT EXISTS store_meta (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );
            """
        )
        product_columns = {
            row["name"] for row in connection.execute("PRAGMA table_info(products)")
        }
        if "stock" not in product_columns:
            connection.execute("ALTER TABLE products ADD COLUMN stock TEXT NOT NULL DEFAULT '{}'")
        review_columns = {
            row["name"] for row in connection.execute("PRAGMA table_info(product_reviews)")
        }
        if "is_hidden" not in review_columns:
            connection.execute("ALTER TABLE product_reviews ADD COLUMN is_hidden INTEGER NOT NULL DEFAULT 0")
        for row in connection.execute("SELECT id, sizes FROM products WHERE stock = '{}'").fetchall():
            sizes = json.loads(row["sizes"])
            connection.execute(
                "UPDATE products SET stock = ? WHERE id = ?",
                (json.dumps({size: 5 for size in sizes}), row["id"]),
            )
        seed_marker = connection.execute(
            "SELECT value FROM store_meta WHERE key = 'initial_products_seeded'"
        ).fetchone()
        if not seed_marker:
            has_products = connection.execute("SELECT 1 FROM products LIMIT 1").fetchone()
            if not has_products:
                now = utc_now()
                connection.executemany(
                    """
                    INSERT INTO products
                    (id, name, category, price, description, sizes, stock, front_image, back_image,
                     size_chart_image, is_new_release, is_popular, created_at, updated_at)
                    VALUES (:id, :name, :category, :price, :description, :sizes, :stock, :frontImage,
                            :backImage, :sizeChartImage, :isNewRelease, :isPopular, :created, :created)
                    """,
                    [
                        {
                            **product,
                            "sizes": json.dumps(product["sizes"]),
                            "stock": json.dumps(product["stock"]),
                            "isNewRelease": int(product["isNewRelease"]),
                            "isPopular": int(product["isPopular"]),
                            "created": now,
                        }
                        for product in INITIAL_PRODUCTS
                    ],
                )
            connection.execute(
                "INSERT INTO store_meta (key, value) VALUES ('initial_products_seeded', 'true')"
            )
        wealth_seed_marker = connection.execute(
            "SELECT value FROM store_meta WHERE key = 'live_in_wealth_products_seeded'"
        ).fetchone()
        if not wealth_seed_marker:
            now = utc_now()
            connection.executemany(
                """
                INSERT OR IGNORE INTO products
                (id, name, category, price, description, sizes, stock, front_image, back_image,
                 size_chart_image, is_new_release, is_popular, created_at, updated_at)
                VALUES (:id, :name, :category, :price, :description, :sizes, :stock, :frontImage,
                        :backImage, :sizeChartImage, :isNewRelease, :isPopular, :created, :created)
                """,
                [
                    {
                        **product,
                        "sizes": json.dumps(product["sizes"]),
                        "stock": json.dumps(product["stock"]),
                        "isNewRelease": int(product["isNewRelease"]),
                        "isPopular": int(product["isPopular"]),
                        "created": now,
                    }
                    for product in INITIAL_PRODUCTS
                    if product["id"] in ("live-in-wealth-black", "live-in-wealth-white")
                ],
            )
            connection.execute(
                "INSERT INTO store_meta (key, value) VALUES ('live_in_wealth_products_seeded', 'true')"
            )
        sweater_seed_marker = connection.execute(
            "SELECT value FROM store_meta WHERE key = 'journey_of_becoming_products_seeded'"
        ).fetchone()
        if not sweater_seed_marker:
            now = utc_now()
            connection.executemany(
                """
                INSERT OR IGNORE INTO products
                (id, name, category, price, description, sizes, stock, front_image, back_image,
                 size_chart_image, is_new_release, is_popular, created_at, updated_at)
                VALUES (:id, :name, :category, :price, :description, :sizes, :stock, :frontImage,
                        :backImage, :sizeChartImage, :isNewRelease, :isPopular, :created, :created)
                """,
                [
                    {
                        **product,
                        "sizes": json.dumps(product["sizes"]),
                        "stock": json.dumps(product["stock"]),
                        "isNewRelease": int(product["isNewRelease"]),
                        "isPopular": int(product["isPopular"]),
                        "created": now,
                    }
                    for product in INITIAL_PRODUCTS
                    if product["id"] in (
                        "journey-of-becoming-black",
                        "journey-of-becoming-white",
                    )
                ],
            )
            connection.execute(
                "INSERT INTO store_meta (key, value) VALUES ('journey_of_becoming_products_seeded', 'true')"
            )
        sweater_price_marker = connection.execute(
            "SELECT value FROM store_meta WHERE key = 'journey_of_becoming_price_updated_1600'"
        ).fetchone()
        if not sweater_price_marker:
            connection.execute(
                """
                UPDATE products SET price = 1600
                WHERE id IN ('journey-of-becoming-black', 'journey-of-becoming-white')
                """
            )
            connection.execute(
                "INSERT INTO store_meta (key, value) VALUES ('journey_of_becoming_price_updated_1600', 'true')"
            )
        one_of_one_seed_marker = connection.execute(
            "SELECT value FROM store_meta WHERE key = 'one_of_one_products_seeded'"
        ).fetchone()
        if not one_of_one_seed_marker:
            now = utc_now()
            connection.executemany(
                """
                INSERT OR IGNORE INTO products
                (id, name, category, price, description, sizes, stock, front_image, back_image,
                 size_chart_image, is_new_release, is_popular, created_at, updated_at)
                VALUES (:id, :name, :category, :price, :description, :sizes, :stock, :frontImage,
                        :backImage, :sizeChartImage, :isNewRelease, :isPopular, :created, :created)
                """,
                [
                    {
                        **product,
                        "sizes": json.dumps(product["sizes"]),
                        "stock": json.dumps(product["stock"]),
                        "isNewRelease": int(product["isNewRelease"]),
                        "isPopular": int(product["isPopular"]),
                        "created": now,
                    }
                    for product in INITIAL_PRODUCTS
                    if product["id"] in ("one-of-one-black", "one-of-one-white")
                ],
            )
            connection.execute(
                "INSERT INTO store_meta (key, value) VALUES ('one_of_one_products_seeded', 'true')"
            )
        connection.execute("DELETE FROM admin_sessions WHERE expires_at <= ?", (utc_now(),))
        connection.execute("DELETE FROM customer_sessions WHERE expires_at <= ?", (utc_now(),))


def bootstrap_admin():
    with db_connect() as connection:
        if connection.execute("SELECT 1 FROM admins LIMIT 1").fetchone():
            return

    username = os.environ.get("SOUTH_ESQUINA_ADMIN")
    password = os.environ.get("SOUTH_ESQUINA_ADMIN_PASSWORD")
    if not username and not password:
        if not sys.stdin.isatty():
            raise RuntimeError(
                "No admin account exists. Run server.py in a terminal to set one up, "
                "or set SOUTH_ESQUINA_ADMIN and SOUTH_ESQUINA_ADMIN_PASSWORD."
            )
        print("Create the local South Esquina admin account.")
        username = input("Admin username: ").strip()
        password = getpass.getpass("Admin password (at least 12 characters): ")
        confirmation = getpass.getpass("Confirm admin password: ")
        if password != confirmation:
            raise RuntimeError("The admin passwords did not match.")
    elif not username or not password:
        raise RuntimeError("Set both SOUTH_ESQUINA_ADMIN and SOUTH_ESQUINA_ADMIN_PASSWORD.")

    username = username.strip()
    if not re.fullmatch(r"[A-Za-z0-9_.-]{3,40}", username):
        raise RuntimeError("Admin username must be 3-40 letters, numbers, dots, underscores, or hyphens.")
    if len(password) < 12 or len(password) > 200:
        raise RuntimeError("Admin password must be between 12 and 200 characters.")

    salt, digest = hash_password(password)
    with db_connect() as connection:
        connection.execute(
            "INSERT INTO admins (username, salt, password_hash, created_at) VALUES (?, ?, ?, ?)",
            (username, salt, digest, utc_now()),
        )
    print(f"Created local admin account: {username}")


def public_product(row):
    return {
        "id": row["id"],
        "name": row["name"],
        "category": row["category"],
        "price": row["price"],
        "description": row["description"],
        "sizes": json.loads(row["sizes"]),
        "stock": json.loads(row["stock"]),
        "frontImage": row["front_image"],
        "backImage": row["back_image"],
        "sizeChartImage": row["size_chart_image"],
        "isNewRelease": bool(row["is_new_release"]),
        "isPopular": bool(row["is_popular"]),
    }


class StoreHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        super().end_headers()

    def send_json(self, status, payload, headers=None):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        if headers:
            for name, value in headers.items():
                self.send_header(name, value)
        self.end_headers()
        self.wfile.write(body)

    def send_error_json(self, status, message):
        self.send_json(status, {"error": message})

    def read_body(self, limit=MAX_BODY_SIZE):
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            raise ValueError("Invalid request body size.")
        if length < 0 or length > limit:
            raise ValueError("The request is too large.")
        return self.rfile.read(length)

    def read_json(self):
        body = self.read_body()
        try:
            data = json.loads(body.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            raise ValueError("Provide valid JSON.")
        if not isinstance(data, dict):
            raise ValueError("Provide a JSON object.")
        return data

    def read_form_data(self):
        body = self.read_body()
        content_type = self.headers.get("Content-Type", "")
        if content_type.startswith("multipart/form-data"):
            message = BytesParser(policy=policy.default).parsebytes(
                b"Content-Type: " + content_type.encode("ascii", "strict") +
                b"\r\nMIME-Version: 1.0\r\n\r\n" + body
            )
            fields = {}
            files = {}
            for part in message.iter_parts():
                name = part.get_param("name", header="content-disposition")
                if not name:
                    continue
                payload = part.get_payload(decode=True) or b""
                filename = part.get_filename()
                if filename:
                    if len(payload) > MAX_IMAGE_SIZE:
                        raise ValueError("Each image must be 8 MB or smaller.")
                    files[name] = {
                        "filename": filename,
                        "content_type": part.get_content_type(),
                        "data": payload,
                    }
                else:
                    fields[name] = payload.decode("utf-8").strip()
            return fields, files
        raise ValueError("Send product details as a form.")

    def verify_local_origin(self):
        origin = self.headers.get("Origin")
        if not origin:
            return True
        parsed = urlparse(origin)
        try:
            origin_port = parsed.port or (443 if parsed.scheme == "https" else 80)
            host_header = self.headers.get("Host", "")
            host_port = int(host_header.rsplit(":", 1)[1]) if ":" in host_header else 80
        except ValueError:
            return False
        return (
            parsed.scheme == "http"
            and parsed.hostname in ("127.0.0.1", "localhost")
            and origin_port == host_port
        )

    def session_username(self):
        cookie = SimpleCookie()
        cookie.load(self.headers.get("Cookie", ""))
        morsel = cookie.get("south_esquina_admin")
        if not morsel:
            return None
        token_hash = hashlib.sha256(morsel.value.encode("utf-8")).hexdigest()
        with db_connect() as connection:
            row = connection.execute(
                "SELECT username, expires_at FROM admin_sessions WHERE token_hash = ?",
                (token_hash,),
            ).fetchone()
            if not row:
                return None
            if row["expires_at"] <= utc_now():
                connection.execute("DELETE FROM admin_sessions WHERE token_hash = ?", (token_hash,))
                return None
            return row["username"]

    def require_admin(self):
        username = self.session_username()
        if not username:
            self.send_error_json(401, "Please sign in as an admin.")
            return None
        return username

    def customer_session(self):
        cookie = SimpleCookie()
        cookie.load(self.headers.get("Cookie", ""))
        morsel = cookie.get("south_esquina_customer")
        if not morsel:
            return None
        token_hash = hashlib.sha256(morsel.value.encode("utf-8")).hexdigest()
        with db_connect() as connection:
            row = connection.execute(
                """
                SELECT customers.id, customers.name, customers.email, customer_sessions.expires_at
                FROM customer_sessions
                JOIN customers ON customers.id = customer_sessions.customer_id
                WHERE customer_sessions.token_hash = ?
                """,
                (token_hash,),
            ).fetchone()
            if not row:
                return None
            if row["expires_at"] <= utc_now():
                connection.execute("DELETE FROM customer_sessions WHERE token_hash = ?", (token_hash,))
                return None
            return {"id": row["id"], "name": row["name"], "email": row["email"]}

    def do_GET(self):
        path = urlparse(self.path).path
        review_match = re.fullmatch(r"/api/products/([a-zA-Z0-9_-]+)/reviews", path)
        if review_match:
            product_id = review_match.group(1)
            with db_connect() as connection:
                exists = connection.execute(
                    "SELECT 1 FROM products WHERE id = ?", (product_id,)
                ).fetchone()
                if not exists:
                    self.send_error_json(404, "Product not found.")
                    return
                rows = connection.execute(
                    """
                    SELECT product_reviews.id, product_reviews.rating, product_reviews.comment, product_reviews.created_at,
                           customers.name
                    FROM product_reviews
                    JOIN customers ON customers.id = product_reviews.customer_id
                    WHERE product_reviews.product_id = ? AND product_reviews.is_hidden = 0
                    ORDER BY product_reviews.created_at DESC, product_reviews.id DESC
                    """,
                    (product_id,),
                ).fetchall()
            ratings = [row["rating"] for row in rows]
            self.send_json(200, {
                "count": len(rows),
                "averageRating": round(sum(ratings) / len(ratings), 1) if ratings else 0,
                "reviews": [dict(row) for row in rows],
            })
            return
        if path == "/api/products":
            with db_connect() as connection:
                rows = connection.execute(
                    "SELECT * FROM products ORDER BY created_at DESC, rowid DESC"
                ).fetchall()
            self.send_json(200, [public_product(row) for row in rows])
            return
        if path == "/api/admin/session":
            username = self.session_username()
            self.send_json(200, {"authenticated": bool(username), "username": username})
            return
        if path == "/api/account/session":
            customer = self.customer_session()
            self.send_json(200, {
                "authenticated": bool(customer),
                "customer": {"name": customer["name"], "email": customer["email"]} if customer else None,
            })
            return
        if path == "/api/admin/accounts":
            if not self.require_admin():
                return
            with db_connect() as connection:
                count = connection.execute("SELECT COUNT(*) FROM customers").fetchone()[0]
                rows = connection.execute(
                    "SELECT name, email, created_at FROM customers ORDER BY created_at DESC, id DESC"
                ).fetchall()
            self.send_json(200, {
                "count": count,
                "accounts": [dict(row) for row in rows],
            })
            return
        if path == "/api/admin/reviews":
            if not self.require_admin():
                return
            with db_connect() as connection:
                rows = connection.execute(
                    """
                    SELECT product_reviews.id, product_reviews.product_id, products.name AS product_name,
                           customers.name AS customer_name, customers.email, product_reviews.rating,
                           product_reviews.comment, product_reviews.is_hidden, product_reviews.created_at
                    FROM product_reviews
                    JOIN products ON products.id = product_reviews.product_id
                    JOIN customers ON customers.id = product_reviews.customer_id
                    ORDER BY product_reviews.created_at DESC, product_reviews.id DESC
                    """
                ).fetchall()
            self.send_json(200, [dict(row) for row in rows])
            return
        if path.startswith("/api/"):
            self.send_error_json(404, "API endpoint not found.")
            return
        super().do_GET()

    def do_POST(self):
        path = urlparse(self.path).path
        if path.startswith("/api/") and not self.verify_local_origin():
            self.send_error_json(403, "Requests must come from this local site.")
            return
        try:
            if path == "/api/register":
                self.register_customer()
            elif path == "/api/account/login":
                self.customer_login()
            elif path == "/api/account/logout":
                self.customer_logout()
            elif re.fullmatch(r"/api/products/[a-zA-Z0-9_-]+/reviews", path):
                self.submit_product_review(path.split("/")[3])
            elif path == "/api/admin/login":
                self.admin_login()
            elif path == "/api/admin/logout":
                self.admin_logout()
            elif path == "/api/admin/products":
                if self.require_admin():
                    self.save_product()
            else:
                self.send_error_json(404, "API endpoint not found.")
        except ValueError as error:
            self.send_error_json(400, str(error))
        except sqlite3.IntegrityError:
            self.send_error_json(409, "That email address is already registered.")
        except (UnicodeDecodeError, LookupError):
            self.send_error_json(400, "The request contains invalid text or image data.")

    def do_PUT(self):
        if not self.verify_local_origin():
            self.send_error_json(403, "Requests must come from this local site.")
            return
        match = re.fullmatch(r"/api/admin/products/([a-zA-Z0-9_-]+)", urlparse(self.path).path)
        if not match:
            self.send_error_json(404, "API endpoint not found.")
            return
        if not self.require_admin():
            return
        try:
            self.save_product(product_id=match.group(1))
        except ValueError as error:
            self.send_error_json(400, str(error))
        except LookupError:
            self.send_error_json(404, "Product not found.")

    def do_PATCH(self):
        if not self.verify_local_origin():
            self.send_error_json(403, "Requests must come from this local site.")
            return
        match = re.fullmatch(r"/api/admin/reviews/(\d+)", urlparse(self.path).path)
        if not match:
            self.send_error_json(404, "API endpoint not found.")
            return
        if not self.require_admin():
            return
        try:
            data = self.read_json()
        except ValueError as error:
            self.send_error_json(400, str(error))
            return
        if not isinstance(data.get("hidden"), bool):
            self.send_error_json(400, "Provide a hidden true/false value.")
            return
        with db_connect() as connection:
            cursor = connection.execute(
                "UPDATE product_reviews SET is_hidden = ? WHERE id = ?",
                (int(data["hidden"]), int(match.group(1))),
            )
        if cursor.rowcount == 0:
            self.send_error_json(404, "Review not found.")
            return
        self.send_json(200, {"hidden": data["hidden"]})

    def do_DELETE(self):
        if not self.verify_local_origin():
            self.send_error_json(403, "Requests must come from this local site.")
            return
        if not self.require_admin():
            return
        review_match = re.fullmatch(r"/api/admin/reviews/(\d+)", urlparse(self.path).path)
        if review_match:
            with db_connect() as connection:
                cursor = connection.execute(
                    "DELETE FROM product_reviews WHERE id = ?",
                    (int(review_match.group(1)),),
                )
            if cursor.rowcount == 0:
                self.send_error_json(404, "Review not found.")
                return
            self.send_json(200, {"deleted": int(review_match.group(1))})
            return
        match = re.fullmatch(r"/api/admin/products/([a-zA-Z0-9_-]+)", urlparse(self.path).path)
        if not match:
            self.send_error_json(404, "API endpoint not found.")
            return
        product_id = match.group(1)
        with db_connect() as connection:
            row = connection.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
            if not row:
                self.send_error_json(404, "Product not found.")
                return
            connection.execute("DELETE FROM products WHERE id = ?", (product_id,))
        for column in ("front_image", "back_image", "size_chart_image"):
            self.delete_uploaded_file(row[column])
        self.send_json(200, {"deleted": product_id})

    def register_customer(self):
        data = self.read_json()
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        if not all(isinstance(value, str) for value in (name, email, password)):
            raise ValueError("Enter your name, email address, and password.")
        name = name.strip()
        email = email.strip().lower()
        if not name or len(name) > 100:
            raise ValueError("Enter your name (up to 100 characters).")
        if len(email) > 254 or not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
            raise ValueError("Enter a valid email address.")
        if len(password) < 8 or len(password) > 200:
            raise ValueError("Password must be between 8 and 200 characters.")
        salt, digest = hash_password(password)
        with db_connect() as connection:
            connection.execute(
                "INSERT INTO customers (name, email, salt, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
                (name, email, salt, digest, utc_now()),
            )
        self.send_json(201, {"message": "Your account has been registered."})

    def submit_product_review(self, product_id):
        customer = self.customer_session()
        if not customer:
            self.send_error_json(401, "Sign in to leave a review.")
            return
        data = self.read_json()
        rating = data.get("rating")
        comment = data.get("comment", "")
        if not isinstance(rating, int) or isinstance(rating, bool) or not 1 <= rating <= 5:
            raise ValueError("Choose a rating from 1 to 5 stars.")
        if not isinstance(comment, str):
            raise ValueError("Enter a valid comment.")
        comment = comment.strip()
        if len(comment) > 1000:
            raise ValueError("Review comments must be 1,000 characters or fewer.")
        try:
            with db_connect() as connection:
                exists = connection.execute(
                    "SELECT 1 FROM products WHERE id = ?", (product_id,)
                ).fetchone()
                if not exists:
                    self.send_error_json(404, "Product not found.")
                    return
                connection.execute(
                    """
                    INSERT INTO product_reviews
                    (product_id, customer_id, rating, comment, created_at)
                    VALUES (?, ?, ?, ?, ?)
                    """,
                    (product_id, customer["id"], rating, comment, utc_now()),
                )
        except sqlite3.IntegrityError:
            self.send_error_json(409, "You have already reviewed this product.")
            return
        self.send_json(201, {"message": "Thanks for sharing your review."})

    def customer_login(self):
        data = self.read_json()
        email = data.get("email")
        password = data.get("password")
        if not isinstance(email, str) or not isinstance(password, str):
            raise ValueError("Enter your email address and password.")
        email = email.strip().lower()
        if len(email) > 254 or len(password) > 200:
            self.send_error_json(401, "Email or password is incorrect.")
            return

        address = f"customer:{self.client_address[0]}"
        failures, blocked_until = LOGIN_FAILURES.get(address, (0, 0))
        if blocked_until > datetime.now().timestamp():
            self.send_error_json(429, "Too many sign-in attempts. Try again in 15 minutes.")
            return

        with db_connect() as connection:
            customer = connection.execute(
                "SELECT id, name, email, salt, password_hash FROM customers WHERE email = ?",
                (email,),
            ).fetchone()
        valid = customer and password_matches(password, customer["salt"], customer["password_hash"])
        if not valid:
            failures += 1
            LOGIN_FAILURES[address] = (
                0 if failures >= 5 else failures,
                datetime.now().timestamp() + 900 if failures >= 5 else 0,
            )
            self.send_error_json(401, "Email or password is incorrect.")
            return

        LOGIN_FAILURES.pop(address, None)
        raw_token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
        expires = (datetime.now(timezone.utc) + timedelta(days=CUSTOMER_SESSION_DAYS)).isoformat(timespec="seconds")
        with db_connect() as connection:
            connection.execute(
                "INSERT INTO customer_sessions (token_hash, customer_id, expires_at) VALUES (?, ?, ?)",
                (token_hash, customer["id"], expires),
            )
        self.send_json(200, {
            "authenticated": True,
            "customer": {"name": customer["name"], "email": customer["email"]},
        }, {
            "Set-Cookie": (
                f"south_esquina_customer={raw_token}; HttpOnly; SameSite=Strict; "
                f"Path=/; Max-Age={CUSTOMER_SESSION_DAYS * 86400}"
            )
        })

    def customer_logout(self):
        cookie = SimpleCookie()
        cookie.load(self.headers.get("Cookie", ""))
        morsel = cookie.get("south_esquina_customer")
        if morsel:
            token_hash = hashlib.sha256(morsel.value.encode("utf-8")).hexdigest()
            with db_connect() as connection:
                connection.execute("DELETE FROM customer_sessions WHERE token_hash = ?", (token_hash,))
        self.send_json(200, {"authenticated": False}, {
            "Set-Cookie": "south_esquina_customer=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0"
        })

    def admin_login(self):
        data = self.read_json()
        address = self.client_address[0]
        failures, blocked_until = LOGIN_FAILURES.get(address, (0, 0))
        if blocked_until > datetime.now().timestamp():
            self.send_error_json(429, "Too many sign-in attempts. Try again in 15 minutes.")
            return
        username = data.get("username")
        password = data.get("password")
        if not isinstance(username, str) or not isinstance(password, str):
            self.send_error_json(400, "Enter your admin username and password.")
            return
        username = username.strip()
        with db_connect() as connection:
            row = connection.execute(
                "SELECT username, salt, password_hash FROM admins WHERE username = ?",
                (username,),
            ).fetchone()
        valid = row and len(password) <= 200 and password_matches(password, row["salt"], row["password_hash"])
        if not valid:
            failures += 1
            LOGIN_FAILURES[address] = (
                0 if failures >= 5 else failures,
                datetime.now().timestamp() + 900 if failures >= 5 else 0,
            )
            self.send_error_json(401, "Username or password is incorrect.")
            return
        LOGIN_FAILURES.pop(address, None)
        raw_token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
        expires = (datetime.now(timezone.utc) + timedelta(hours=ADMIN_SESSION_HOURS)).isoformat(timespec="seconds")
        with db_connect() as connection:
            connection.execute(
                "INSERT INTO admin_sessions (token_hash, username, expires_at) VALUES (?, ?, ?)",
                (token_hash, row["username"], expires),
            )
        self.send_json(200, {"authenticated": True, "username": row["username"]}, {
            "Set-Cookie": (
                f"south_esquina_admin={raw_token}; HttpOnly; SameSite=Strict; "
                f"Path=/; Max-Age={ADMIN_SESSION_HOURS * 3600}"
            )
        })

    def admin_logout(self):
        cookie = SimpleCookie()
        cookie.load(self.headers.get("Cookie", ""))
        morsel = cookie.get("south_esquina_admin")
        if morsel:
            token_hash = hashlib.sha256(morsel.value.encode("utf-8")).hexdigest()
            with db_connect() as connection:
                connection.execute("DELETE FROM admin_sessions WHERE token_hash = ?", (token_hash,))
        self.send_json(200, {"authenticated": False}, {
            "Set-Cookie": "south_esquina_admin=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0"
        })

    def save_product(self, product_id=None):
        fields, files = self.read_form_data()
        name = fields.get("name", "").strip()
        category = fields.get("category", "")
        description = fields.get("description", "").strip()
        try:
            price = float(fields.get("price", ""))
        except ValueError:
            raise ValueError("Enter a valid product price.")
        sizes = [size.strip() for size in fields.get("sizes", "").split(",") if size.strip()]
        if not name or len(name) > 120:
            raise ValueError("Enter a product name (up to 120 characters).")
        if category not in CATEGORIES:
            raise ValueError("Choose a valid product category.")
        if not 0 < price <= 10_000_000:
            raise ValueError("Price must be greater than zero and no more than 10,000,000.")
        if len(description) > 2000:
            raise ValueError("Description must be 2,000 characters or fewer.")
        if not sizes or len(sizes) > 20 or any(len(size) > 20 for size in sizes):
            raise ValueError("Enter between 1 and 20 sizes, separated by commas.")
        if len({size.casefold() for size in sizes}) != len(sizes):
            raise ValueError("Remove duplicate sizes.")
        stock = {}
        for item in fields.get("stock", "").split(","):
            if not item.strip():
                continue
            match = re.fullmatch(r"\s*(.+?)\s*:\s*(\d+)\s*", item)
            if not match:
                raise ValueError("Enter inventory as size: quantity, for example S: 5, M: 5.")
            stock_size, quantity = match.groups()
            if stock_size not in sizes or stock_size in stock:
                raise ValueError("Enter one quantity for each available size, using the exact size labels.")
            stock[stock_size] = int(quantity)
        if set(stock) != set(sizes):
            raise ValueError("Enter an inventory quantity for every available size.")
        if any(quantity > 100_000 for quantity in stock.values()):
            raise ValueError("A size can have up to 100,000 units in stock.")

        with db_connect() as connection:
            existing = None
            if product_id:
                existing = connection.execute(
                    "SELECT * FROM products WHERE id = ?", (product_id,)
                ).fetchone()
                if not existing:
                    raise LookupError("Product not found.")
            previous = {
                "front_image": existing["front_image"] if existing else "",
                "back_image": existing["back_image"] if existing else "",
                "size_chart_image": existing["size_chart_image"] if existing else "",
            }

        front_upload = files.get("frontImage")
        if not product_id and (not front_upload or not front_upload["data"]):
            raise ValueError("Add a front product image.")
        upload_fields = []
        new_paths = dict(previous)
        for field_name, column_name in (
            ("frontImage", "front_image"),
            ("backImage", "back_image"),
            ("sizeChartImage", "size_chart_image"),
        ):
            uploaded = files.get(field_name)
            if not uploaded or not uploaded["data"]:
                new_paths[column_name] = previous[column_name]
                continue
            file_type = uploaded["content_type"].lower()
            extension = Path(uploaded["filename"]).suffix.lower()
            allowed = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp"}
            if extension not in allowed or file_type != allowed[extension]:
                raise ValueError("Product images must be PNG, JPG, or WebP files.")
            upload_fields.append((column_name, extension, uploaded["data"]))

        try:
            for column_name, extension, data in upload_fields:
                UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
                safe_name = f"{uuid.uuid4().hex}{extension}"
                new_paths[column_name] = f"uploads/products/{safe_name}"
                (UPLOAD_DIR / safe_name).write_bytes(data)
        except OSError as error:
            for column_name, image_path in new_paths.items():
                if image_path != previous[column_name]:
                    self.delete_uploaded_file(image_path)
            raise ValueError("Unable to save the uploaded product images.") from error

        product_id = product_id or uuid.uuid4().hex
        now = utc_now()
        try:
            with db_connect() as connection:
                if product_id and existing:
                    connection.execute(
                        """
                        UPDATE products SET name=?, category=?, price=?, description=?, sizes=?, stock=?,
                            front_image=?, back_image=?, size_chart_image=?, is_new_release=?,
                            is_popular=?, updated_at=? WHERE id=?
                        """,
                        (
                            name, category, price, description, json.dumps(sizes), json.dumps(stock),
                            new_paths["front_image"], new_paths["back_image"], new_paths["size_chart_image"],
                            int(fields.get("isNewRelease") == "true"),
                            int(fields.get("isPopular") == "true"), now, product_id,
                        ),
                    )
                else:
                    connection.execute(
                        """
                        INSERT INTO products
                        (id, name, category, price, description, sizes, stock, front_image, back_image,
                         size_chart_image, is_new_release, is_popular, created_at, updated_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        """,
                        (
                            product_id, name, category, price, description, json.dumps(sizes), json.dumps(stock),
                            new_paths["front_image"], new_paths["back_image"], new_paths["size_chart_image"],
                            int(fields.get("isNewRelease") == "true"),
                            int(fields.get("isPopular") == "true"), now, now,
                        ),
                    )
                row = connection.execute(
                    "SELECT * FROM products WHERE id = ?", (product_id,)
                ).fetchone()
        except Exception:
            for column_name, image_path in new_paths.items():
                if image_path != previous[column_name]:
                    self.delete_uploaded_file(image_path)
            raise

        for column_name, old_path in previous.items():
            if old_path and old_path != new_paths[column_name]:
                self.delete_uploaded_file(old_path)
        self.send_json(201 if not existing else 200, public_product(row))

    @staticmethod
    def delete_uploaded_file(image_path):
        if not image_path.startswith("uploads/products/"):
            return
        candidate = (ROOT / image_path).resolve()
        try:
            candidate.relative_to(UPLOAD_DIR.resolve())
        except ValueError:
            return
        if candidate.is_file():
            candidate.unlink()


if __name__ == "__main__":
    initialize_database()
    bootstrap_admin()
    print(f"South Esquina local store running at http://{HOST}:{PORT}")
    print("Local only; this server is not configured for production hosting.")
    ThreadingHTTPServer((HOST, PORT), StoreHandler).serve_forever()
