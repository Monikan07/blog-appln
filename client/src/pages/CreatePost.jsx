import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [files, setFiles] = useState([]); 
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  
  const [formData, setFormData] = useState({ imageUrls: [] });
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();

  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleUpdloadImage = async () => {
    if (files.length === 0) {
      setImageUploadError('Please select images to upload.');
      return;
    }
    setImageUploadError(null);
    setImageUploadProgress(0);

    try {
        const uploadPromises = Array.from(files).map(storeImage);

        const urls = await Promise.all(uploadPromises);

        setFormData((prevFormData) => ({
            ...prevFormData,
            imageUrls: [...prevFormData.imageUrls, ...urls],
        }));

        setImageUploadProgress(null);
        setFiles([]); 
    } catch (error) {
        setImageUploadError('Image upload failed (check file size limits)');
        setImageUploadProgress(null);
        console.log(error);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData({
        ...formData,
        imageUrls: formData.imageUrls.filter((_, index) => index !== indexToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bodyData = {
          ...formData,
          image: formData.imageUrls[0] || null, 
      };

      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value='uncategorized'>Select a catagory..</option>
            <option value='budget-travel'>Budget Travel</option>
            <option value='gourmet-recipes'>Gourmet Recipes</option>
            <option value='street-food'>Street Food Finds</option>
            <option value='destination-guides'>Destination Guides</option>
            <option value='travel-hacks'>Travel Hacks</option>
          </Select>
        </div>
        
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setFiles(Array.from(e.target.files))} 
            multiple 
          />
          <Button
            type='button'
            gradientDuoTone='tealToLime'
            size='sm'
            outline
            onClick={handleUpdloadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              'Upload Images'
            )}
          </Button>
        </div>
        
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        
        <div className='flex flex-wrap gap-4'>
            {formData.imageUrls.length > 0 &&
                formData.imageUrls.map((url, index) => (
                    <div key={index} className='relative w-32 h-32'>
                        <img
                            src={url}
                            alt={`Post image ${index + 1}`}
                            className='w-full h-full object-cover rounded-lg border-2 border-teal-500'
                        />
                        <Button
                            type='button'
                            color='failure'
                            size='xs'
                            className='absolute top-1 right-1 p-0.5 w-6 h-6 rounded-full flex items-center justify-center'
                            onClick={() => handleRemoveImage(index)}
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </Button>
                    </div>
                ))}
        </div>

        <ReactQuill
          theme='snow'
          placeholder='Write something...'
          className='h-80 mb-12 '
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type='submit' gradientDuoTone='tealToLime'>
          Publish
        </Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}