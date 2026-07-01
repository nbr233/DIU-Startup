import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.shops.models import Shop
from apps.products.models import Category, Brand, Product, ProductImage
from apps.coupons.models import Coupon
from apps.banners.models import Banner

User = get_user_model()

def seed_db():
    print("Seeding database...")

    # 1. Users
    # Superadmin
    if not User.objects.filter(email='superadmin@diustartup.com').exists():
        super_user = User.objects.create_superuser(
            email='superadmin@diustartup.com',
            password='superadmin123',
            first_name='Super',
            last_name='Admin',
            phone='01700-000000'
        )
        super_user.role = 'superadmin'
        super_user.save()
        print("Created superadmin user")

    # Seller Owner
    seller_user, created = User.objects.get_or_create(
        email='seller@diustartup.com',
        defaults={
            'first_name': 'DIU',
            'last_name': 'Seller',
            'phone': '01900-000000',
            'role': 'seller'
        }
    )
    if created:
        seller_user.set_password('seller123')
        seller_user.save()
        print("Created seller user")

    # 2. Shop
    shop, created = Shop.objects.get_or_create(
        slug='diu-startup',
        defaults={
            'name': 'DIU Startup Store',
            'owner': seller_user,
            'description': 'Official Daffodil International University startup e-commerce store.',
            'category': 'Mixed',
            'contact_email': 'store@diustartup.com',
            'contact_phone': '01900-000000',
            'status': 'active',
            'commission_rate': 6.00
        }
    )
    if created:
        print("Created active shop: DIU Startup Store")

    # 3. Categories
    categories = [
        {'name': 'Electronics', 'icon': 'fas fa-mobile-alt'},
        {'name': 'Fashion', 'icon': 'fas fa-tshirt'},
        {'name': 'Beauty', 'icon': 'fas fa-magic'},
        {'name': 'Sports', 'icon': 'fas fa-running'},
        {'name': 'Home & Living', 'icon': 'fas fa-couch'},
    ]
    for cat in categories:
        Category.objects.get_or_create(
            name=cat['name'],
            defaults={'icon': cat['icon'], 'is_active': True}
        )
    print("Created categories")

    # 4. Brands
    brands = ['Samsung', 'Sony', 'Apple', 'Nike', 'Adidas', 'L\'Oreal']
    for b in brands:
        Brand.objects.get_or_create(name=b)
    print("Created brands")

    # 5. Products
    electronics = Category.objects.get(name='Electronics')
    samsung = Brand.objects.get(name='Samsung')
    
    prod1, created = Product.objects.get_or_create(
        slug='samsung-galaxy-s24-ultra',
        defaults={
            'shop': shop,
            'category': electronics,
            'brand': samsung,
            'name': 'Samsung Galaxy S24 Ultra',
            'description': 'Samsung Galaxy S24 Ultra smartphone, 12GB RAM, 256GB storage, Titanium Gray.',
            'sku': 'SM-S24U-256',
            'price': 149999.00,
            'discount_price': 139999.00,
            'cost_price': 110000.00,
            'stock': 15,
            'status': 'active',
            'is_featured': True,
            'is_flash_sale': True,
            'is_new_arrival': True,
        }
    )
    if created:
        print("Created Samsung Galaxy S24 Ultra")

    # 6. Coupons
    Coupon.objects.get_or_create(
        code='PLATFORM20',
        defaults={
            'discount_type': 'percent',
            'value': 20.00,
            'min_order': 1000.00,
            'expiry_date': '2026-12-31 23:59:59+06:00',
            'is_active': True
        }
    )
    print("Created platform coupon: PLATFORM20")

    print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed_db()
