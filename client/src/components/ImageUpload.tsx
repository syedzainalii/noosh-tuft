'use client';

import { useState, useEffect } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'nooshdb';
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'nooshdb';

export default function ImageUpload({ value, onChange, label = "Image", required = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Update preview when value changes (e.g., when editing existing items)
  useEffect(() => {
    setPreview(value);
  }, [value]);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB for Cloudinary)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create local preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      setUploadProgress(50);
      const cloudinaryUrl = await uploadToCloudinary(file);
      
      setUploadProgress(100);
      setPreview(cloudinaryUrl);
      onChange(cloudinaryUrl);
      
      console.log('✅ Image uploaded to Cloudinary:', cloudinaryUrl);
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setPreview('');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = () => {
    setPreview('');
    onChange('');
  };

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {preview ? (
        <div className="relative border-2 border-primary-100 rounded-2xl p-4 bg-primary-50/30">
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
          <div className="relative h-64 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl overflow-hidden">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <p className=\"text-xs text-gray-500 mt-2 text-center\">
            ✨ {preview.includes('cloudinary.com') ? 'Image stored in Cloudinary' : 'Image ready for upload'}
          </p>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
            disabled={uploading}
          />
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-primary-200 rounded-2xl cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-all duration-300"
          >
            <PhotoIcon className="h-16 w-16 text-primary-300 mb-3" />
            <p className="text-gray-600 font-medium mb-1">
              {uploading ? `Uploading to Cloudinary... ${uploadProgress}%` : 'Click to upload image'}
            </p>
            <p className="text-xs text-gray-400">PNG, JPG up to 10MB • Direct upload to Cloudinary</p>
          </label>
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-2">
        💡 Tip: Upload a high-quality photo that showcases your handcraft
      </p>
    </div>
  );
}
