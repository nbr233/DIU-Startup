from django.urls import path
from .dashboard_views import SellerDashboardStatsView, SuperAdminDashboardStatsView

urlpatterns = [
    path('seller/', SellerDashboardStatsView.as_view(), name='dashboard-seller-stats'),
    path('admin/', SuperAdminDashboardStatsView.as_view(), name='dashboard-admin-stats'),
]
