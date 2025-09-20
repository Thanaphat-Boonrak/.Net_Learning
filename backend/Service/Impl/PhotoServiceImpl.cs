using API.Helps;
using API.Repository;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.CodeAnalysis.Options;
using Microsoft.Extensions.Options;

namespace API.Service.Impl;

public class PhotoServiceImpl : PhotoService

{
    private readonly Cloudinary _cloudinary;

    public PhotoServiceImpl(IOptions<CloudinarySettings> cloudinary)
    {
        var account = new Account(cloudinary.Value.CloudName, cloudinary.Value.ApiKey, cloudinary.Value.ApiSecret);
        _cloudinary = new Cloudinary(account);
    }

    public async Task<ImageUploadResult> UploadPhotoSync(IFormFile file)
    {
        var uploadResult = new ImageUploadResult();
        if (file.Length > 0)
        {
            await using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(file.FileName, stream),
                Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face"),
                Folder = "da-ang20"
            };
            uploadResult = await _cloudinary.UploadAsync(uploadParams);
        }

        return uploadResult;
    }

    public async Task<DeletionResult> DeletePhotoSync(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);
        return await _cloudinary.DestroyAsync(deleteParams);
    }
}