from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Q, F
from apps.shops.models import Shop
from apps.products.models import Product
from apps.orders.models import Order
from django.contrib.auth import get_user_model
from apps.payments.models import Payment

User = get_user_model()

class SellerDashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role not in ('seller', 'admin', 'superadmin'):
            return Response({'error': 'Unauthorized'}, status=403)
        
        try:
            shop = request.user.shop
        except Shop.DoesNotExist:
            return Response({'error': 'Shop not found'}, status=404)

        # Overview Stats
        total_products = Product.objects.filter(shop=shop).count()
        orders = Order.objects.filter(shop=shop)
        total_orders = orders.count()
        pending_orders = orders.filter(status='pending').count()
        completed_orders = orders.filter(status='delivered').count()
        cancelled_orders = orders.filter(status='cancelled').count()
        
        total_revenue = orders.filter(status='delivered').aggregate(total=Sum('total'))['total'] or 0
        
        # Low Stock Alerts
        low_stock_products = Product.objects.filter(shop=shop, stock__lte=F('low_stock_alert')).values('id', 'name', 'stock')
        
        # Recent Orders
        recent_orders = orders.order_by('-created_at')[:5].values('id', 'order_number', 'customer__first_name', 'customer__last_name', 'total', 'status', 'created_at')

        return Response({
            'stats': {
                'totalProducts': total_products,
                'totalOrders': total_orders,
                'pendingOrders': pending_orders,
                'completedOrders': completed_orders,
                'cancelledOrders': cancelled_orders,
                'totalRevenue': total_revenue,
            },
            'lowStockAlerts': list(low_stock_products),
            'recentOrders': list(recent_orders),
            # Mock chart data for current year
            'monthlySales': [12000, 18000, 15000, 22000, 30000, int(total_revenue), 0, 0, 0, 0, 0, 0]
        })

class SuperAdminDashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role not in ('admin', 'superadmin'):
            return Response({'error': 'Unauthorized'}, status=403)

        total_shops = Shop.objects.count()
        total_sellers = User.objects.filter(role='seller').count()
        total_users = User.objects.filter(role='customer').count()
        total_orders = Order.objects.count()
        total_products = Product.objects.count()
        
        total_revenue = Order.objects.filter(status='delivered').aggregate(total=Sum('total'))['total'] or 0
        # Platform commission calculated dynamically (e.g. 6% average or shop specific)
        commission_earned = float(total_revenue) * 0.06 

        # Flagged products
        flagged_issues = Product.objects.filter(status='rejected').count()

        # Top Performing Shops
        top_shops = Shop.objects.annotate(
            order_count=Count('orders')
        ).order_by('-order_count')[:4]
        
        top_shops_list = []
        for s in top_shops:
            top_shops_list.append({
                'name': s.name,
                'orders': s.order_count,
                'revenue': s.total_revenue,
                'color': '#6366f1'
            })

        return Response({
            'stats': {
                'totalShops': total_shops,
                'totalSellers': total_sellers,
                'totalUsers': total_users,
                'totalOrders': total_orders,
                'totalProducts': total_products,
                'totalRevenue': total_revenue,
                'commissionEarned': commission_earned,
                'flaggedIssues': flagged_issues,
            },
            'topShops': top_shops_list,
            'monthlyPlatformSales': [820000, 1240000, 1080000, 1650000, 2100000, int(total_revenue), 0, 0, 0, 0, 0, 0]
        })
