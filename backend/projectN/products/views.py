from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializers import ProductSerializer


# Create your views here.

class ProductViewSet(viewsets.ModelViewSet):
  queryset = Product.objects.all()
  serializer_class = ProductSerializer

# def product_list(request):
#   products = list(Product.objects.values())
#   return JsonResponse(products, safe=False)


def get_queryset(self):
  queryset=Product.objects.all()
  search = self.request.query_params.get('search')
  category = self.request.query_params.get('category')
  sort = self.request.query_params.get('sort')
  
  if search:
    queryset = queryset.filter(name__icontains=search)
    
  if category:
    queryset = queryset.filter(category=category)
    
  if sort == 'price':
    queryset = queryset.order_by('price')
    
    return queryset
  