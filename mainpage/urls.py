from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.index),
    path('hello/', views.hello),
    path('ip_check/', views.ip_check),
    path('check_host/', views.request_to_checkhost),
    path('whois/', views.whois_def),  
]
