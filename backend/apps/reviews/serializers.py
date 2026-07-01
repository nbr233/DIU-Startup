from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.get_full_name')

    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['user', 'reply', 'is_hidden', 'created_at', 'updated_at']
