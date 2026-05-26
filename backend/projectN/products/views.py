from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
  queryset = Product.objects.all()
  serializer_class = ProductSerializer

  def get_queryset(self):
    data = Product.objects.all()
    search = self.request.query_params.get('search')
    category = self.request.query_params.get('category')
    sort = self.request.query_params.get('sort')

    if search:
      data = data.filter(name__icontains=search)
    if category:
      data = data.filter(category=category)
      
    if sort == 'price_asc':
      data = data.order_by('price')
      
    elif sort == 'price_desc':
      data = data.order_by('-price')
    return data