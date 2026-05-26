from django.db import models

# Create your models here.
class Product(models.Model):
  name = models.CharField(max_length=100)
  code = models.CharField(max_length=100)
  category = models.CharField(max_length=100)
  price = models.FloatField()
  quantity = models.IntegerField()
  description = models.TextField()
  image = models.ImageField(upload_to='product_images/', null=True, blank=True)
  
def __str__(self):
    return self.name