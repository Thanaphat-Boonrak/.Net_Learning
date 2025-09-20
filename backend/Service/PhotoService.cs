using CloudinaryDotNet.Actions;

namespace API.Service;

public interface PhotoService
{

        Task<ImageUploadResult> UploadPhotoSync(IFormFile file);
        Task<DeletionResult> DeletePhotoSync(string publicId);
}