import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase'; 
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from '../redux/user/userSlice'; 
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

const Alert = ({ color, children, className = '' }) => {
  const baseClasses = 'p-3 text-sm rounded-lg';
  const colorClasses = {
    failure: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    success: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  }[color] || '';
  return <div className={`${baseClasses} ${colorClasses} ${className}`}>{children}</div>;
};

const CustomModal = ({ show, children }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        {children}
      </div>
    </div>
  );
};

const ExclamationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.174 3.35 1.944 3.35h14.717c1.77 0 2.81-1.85 1.943-3.35L13.732 4.71a1.991 1.991 0 0 0-3.464 0L3.303 16.126Z" />
    </svg>
);


export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  
  const [imageFiles, setImageFiles] = useState([]); 
  const [imageFileUrls, setImageFileUrls] = useState([]);
  
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  
  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const validFiles = Array.from(files).filter(file => file.size / 1024 / 1024 < 2);
      
      if (validFiles.length !== files.length) {
          setImageFileUploadError('Some files were skipped (Max 2MB per file)');
      } else {
          setImageFileUploadError(null);
      }

      setImageFiles(validFiles);
      
      const urls = validFiles.map(file => URL.createObjectURL(file));
      setImageFileUrls(urls);
    }
  };
  
  useEffect(() => {
    if (imageFiles.length > 0) {
      uploadImages(imageFiles); 
    }
  }, [imageFiles]);

  const uploadImages = async (files) => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    setImageFileUploadProgress(0); 

    const storage = getStorage(app);
    const uploadedUrls = [];
    let totalBytesTransferred = 0;
    let totalBytes = files.reduce((sum, file) => sum + file.size, 0);

    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        let fileTransferred = 0;

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const currentFileProgress = snapshot.bytesTransferred;
            const delta = currentFileProgress - fileTransferred;
            fileTransferred = currentFileProgress;
            totalBytesTransferred += delta;
            
            const overallProgress = (totalBytesTransferred / totalBytes) * 100;
            setImageFileUploadProgress(overallProgress.toFixed(0));
          },
          (error) => {
            let errorMessage = `Could not upload image ${file.name}`;
            if (error.code === 'storage/unauthorized') {
                errorMessage = 'Access denied. Check Firebase Storage rules.';
            } else if (error.code === 'storage/quota-exceeded') {
                errorMessage = 'Upload quota exceeded. Try again later.';
            }
            reject(errorMessage);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              uploadedUrls.push(downloadURL);
              resolve();
            }).catch(reject);
          }
        );
      });
    });

    try {
      await Promise.all(uploadPromises);
      
      const profilePictureUrl = uploadedUrls[0]; 
      
     setFormData(prevFormData => ({ 
    ...prevFormData, 
    images: uploadedUrls 
}));
      
      setImageFileUploading(false);
      setImageFileUploadError(null); 
      setImageFileUploadProgress(100);

    } catch (error) {
      console.error(error);
      setImageFileUploadError(`Error uploading files: ${error.toString()}`);
      setImageFileUploading(false);
      setImageFileUploadProgress(null);
      setImageFiles([]); 
      setImageFileUrls([]); 
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError('Please wait for images to finish uploading');
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const currentProfilePicture = imageFileUrls[0] || formData.profilePicture || currentUser.profilePicture;

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
          multiple 
        />
        <div
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress !== null && imageFileUploadProgress < 100 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white font-bold text-xl">
              <div className='w-24 h-24 flex items-center justify-center border-4 border-dashed border-white rounded-full'>
                {imageFileUploadProgress}%
              </div>
            </div>
          )}
          <img
            src={currentProfilePicture}
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[#bae7ff] ${
              imageFileUploadProgress !== null &&
              imageFileUploadProgress < 100 &&
              'opacity-60'
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color='failure'>{imageFileUploadError}</Alert>
        )}
<input 
  type='text'
  id='username'
  placeholder='username'
  className='p-3 rounded-lg bg-gray-100 text-black placeholder-gray-500 border border-gray-300 
             focus:outline-none focus:ring-2 focus:ring-teal-400 
             dark:bg-[#1b2135] dark:text-white dark:border-gray-600 dark:placeholder-gray-400 transition-colors duration-300'
  defaultValue={currentUser.username}
  onChange={handleChange}
/>

<input 
  type='email'
  id='email'
  placeholder='email'
  className='p-3 rounded-lg bg-gray-100 text-black placeholder-gray-500 border border-gray-300 
             focus:outline-none focus:ring-2 focus:ring-teal-400 
             dark:bg-[#1b2135] dark:text-white dark:border-gray-600 dark:placeholder-gray-400 transition-colors duration-300'
  defaultValue={currentUser.email}
  onChange={handleChange}
/>

<input 
  type='password'
  id='password'
  placeholder='password'
  className='p-3 rounded-lg bg-gray-100 text-black placeholder-gray-500 border border-gray-300 
             focus:outline-none focus:ring-2 focus:ring-teal-400 
             dark:bg-[#1b2135] dark:text-white dark:border-gray-600 dark:placeholder-gray-400 transition-colors duration-300'
  onChange={handleChange}
/>
        <button 
          type='submit'
          className='p-3 text-white rounded-lg font-medium border border-transparent bg-gradient-to-r from-teal-400 to-lime-400 hover:opacity-90 transition-opacity disabled:opacity-50'
          disabled={loading || imageFileUploading}
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
        {currentUser.isAdmin && (
            <Link to={'/create-post'} className="mt-2 w-full">
                {/* <button 
                    type='button' 
                    className='p-3 w-full text-white rounded-lg font-medium border border-transparent bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition-opacity'
                >
                    Create a post
                </button> */}
            </Link>
        )}
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span onClick={() => setShowModal(true)} className='cursor-pointer'>
          Delete Account
        </span>
        <span onClick={handleSignout} className='cursor-pointer'>
          Sign Out
        </span>
      </div>
      {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
      )}
      <CustomModal
        show={showModal}
        onClose={() => setShowModal(false)}
      >
          <div className='text-center'>
            <ExclamationIcon />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete your account?
            </h3>
            <div className='flex justify-center gap-4'>
              <button 
                className='p-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors'
                onClick={handleDeleteUser}
              >
                Yes, I'm sure
              </button>
              <button 
                className='p-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors'
                onClick={() => setShowModal(false)}
              >
                No, cancel
              </button>
            </div>
          </div>
      </CustomModal>
    </div>
  );
}



















{/* {currentUser.isAdmin && (
            <Link to={'/create-post'} className="mt-2">
                <TailwindButton
                    type='button' 
                    gradientDuoTone='purpleToBlue'
                    className='w-full'
                >
                    Create a post
                </TailwindButton>
            </Link>
        )} */}