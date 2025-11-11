import { useForm } from 'react-hook-form';
import { useGetUserProfile, useUpdateUserProfile } from '../api/generated';
import type { UpdateUserProfileRequest } from '../api/model';
import type { AxiosError } from 'axios';

interface ModernFormProps {
  userId: string;
}

export function ModernForm({ userId }: ModernFormProps) {
  // React Query handles all loading/error/success states automatically
  const {
    data: user,
    isLoading,
    error: fetchError,
  } = useGetUserProfile(userId);

  // React Hook Form handles all form state
  const {
    register,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm<UpdateUserProfileRequest>({
    values: user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber || '',
          bio: user.bio || '',
        }
      : undefined,
  });

  // React Query mutation for updates
  const {
    mutate: updateProfile,
    isPending: isSaving,
    error: saveError,
    isSuccess,
  } = useUpdateUserProfile();

  // Single submit handler - React Hook Form handles validation and values
  const onSubmit = (data: UpdateUserProfileRequest) => {
    updateProfile(
      {
        userId,
        data: {
          ...data,
          phoneNumber: data.phoneNumber || null,
          bio: data.bio || null,
        },
      },
      {
        onSuccess: (updatedUser) => {
          // Reset form with new values to clear dirty state
          reset({
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            phoneNumber: updatedUser.phoneNumber || '',
            bio: updatedUser.bio || '',
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div>
        <h2>Modern Approach (React Hook Form + React Query)</h2>
        <p>Loading user data...</p>
      </div>
    );
  }

  if (fetchError) {
    const axiosError = fetchError as AxiosError<{ message: string }>;
    return (
      <div>
        <h2>Modern Approach (React Hook Form + React Query)</h2>
        <p style={{ color: 'red' }}>
          Error: {axiosError.response?.data?.message || 'Failed to load user data'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2>Modern Approach (React Hook Form + React Query)</h2>
      <p>
        <strong>Automatic state management with React Hook Form + React Query</strong>
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="modern-firstName">
            First Name <span style={{ color: 'red' }}>*</span>
          </label>
          <br />
          <input
            id="modern-firstName"
            type="text"
            {...register('firstName', { required: true })}
            disabled={isSaving}
          />
        </div>

        <div>
          <label htmlFor="modern-lastName">
            Last Name <span style={{ color: 'red' }}>*</span>
          </label>
          <br />
          <input
            id="modern-lastName"
            type="text"
            {...register('lastName', { required: true })}
            disabled={isSaving}
          />
        </div>

        <div>
          <label htmlFor="modern-email">
            Email <span style={{ color: 'red' }}>*</span>
          </label>
          <br />
          <input
            id="modern-email"
            type="email"
            {...register('email', { required: true })}
            disabled={isSaving}
          />
        </div>

        <div>
          <label htmlFor="modern-phoneNumber">Phone Number</label>
          <br />
          <input
            id="modern-phoneNumber"
            type="tel"
            {...register('phoneNumber')}
            disabled={isSaving}
          />
        </div>

        <div>
          <label htmlFor="modern-bio">Bio</label>
          <br />
          <textarea
            id="modern-bio"
            {...register('bio')}
            disabled={isSaving}
            rows={4}
            style={{ width: '300px' }}
          />
        </div>

        {saveError && (
          <div>
            <p style={{ color: 'red' }}>
              Error: {(saveError as AxiosError<{ message: string }>).response?.data?.message || 'Failed to update profile'}
            </p>
          </div>
        )}

        {isSuccess && (
          <div>
            <p style={{ color: 'green' }}>Profile updated successfully!</p>
          </div>
        )}

        <div>
          <button type="submit" disabled={!isDirty || isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => reset()} disabled={!isDirty || isSaving}>
            Reset
          </button>
        </div>
      </form>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>
          <strong>Lines of code:</strong> ~120 (less than half!)
        </p>
        <p>
          <strong>useState hooks:</strong> 0 (React Hook Form manages it all)
        </p>
        <p>
          <strong>useEffect hooks:</strong> 0 (React Query handles data fetching)
        </p>
        <p>
          <strong>Manual handlers:</strong> 1 (just onSubmit)
        </p>
      </div>
    </div>
  );
}
