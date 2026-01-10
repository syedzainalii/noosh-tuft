import cloudinary
import cloudinary.uploader
import cloudinary.api
from config import settings
import base64
import re
from typing import Optional

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)


def upload_image(image_data: str, folder: str = "ecommerce") -> str:
    """
    Upload an image to Cloudinary
    
    Args:
        image_data: Base64 encoded image string or image URL
        folder: Folder in Cloudinary to store the image
        
    Returns:
        Cloudinary URL of the uploaded image
    """
    try:
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            image_data,
            folder=folder,
            resource_type="auto",
            transformation=[
                {'quality': 'auto'},
                {'fetch_format': 'auto'}
            ]
        )
        
        return result['secure_url']
    except Exception as e:
        raise Exception(f"Failed to upload image to Cloudinary: {str(e)}")


def delete_image(image_url: str) -> bool:
    """
    Delete an image from Cloudinary
    
    Args:
        image_url: Cloudinary URL of the image to delete
        
    Returns:
        True if deletion was successful, False otherwise
    """
    try:
        # Extract public_id from Cloudinary URL
        public_id = extract_public_id(image_url)
        if not public_id:
            return False
            
        # Delete from Cloudinary
        result = cloudinary.uploader.destroy(public_id)
        return result.get('result') == 'ok'
    except Exception as e:
        print(f"Failed to delete image from Cloudinary: {str(e)}")
        return False


def extract_public_id(cloudinary_url: str) -> Optional[str]:
    """
    Extract public_id from Cloudinary URL
    
    Args:
        cloudinary_url: Full Cloudinary URL
        
    Returns:
        Public ID of the image
    """
    try:
        # Pattern to extract public_id from Cloudinary URL
        # Example: https://res.cloudinary.com/nooshdb/image/upload/v1234567890/ecommerce/image.jpg
        pattern = r'/upload/(?:v\d+/)?(.+)\.\w+$'
        match = re.search(pattern, cloudinary_url)
        if match:
            return match.group(1)
        return None
    except Exception:
        return None


def is_base64_image(data: str) -> bool:
    """
    Check if the string is a base64 encoded image
    
    Args:
        data: String to check
        
    Returns:
        True if it's a base64 image, False otherwise
    """
    return data.startswith('data:image/')


def is_cloudinary_url(url: str) -> bool:
    """
    Check if the URL is already a Cloudinary URL
    
    Args:
        url: URL to check
        
    Returns:
        True if it's a Cloudinary URL, False otherwise
    """
    return 'cloudinary.com' in url if url else False
