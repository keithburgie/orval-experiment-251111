import { useState, useEffect } from 'react';
import { AXIOS_INSTANCE } from '../api/custom-instance';
import type { UserProfile, UpdateUserProfileRequest } from '../api/model';

interface TraditionalFormProps {
  userId: string;
}

export function TraditionalForm({ userId }: TraditionalFormProps) {
  // All form fields need individual useState
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');

  // Need to track original values for reset functionality
  const [originalFirstName, setOriginalFirstName] = useState('');
  const [originalLastName, setOriginalLastName] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');
  const [originalPhoneNumber, setOriginalPhoneNumber] = useState('');
  const [originalBio, setOriginalBio] = useState('');

  // Manual state management for loading, errors, success
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Manual dirty tracking
  const [isDirty, setIsDirty] = useState(false);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoadingData(true);
        setFetchError(null);

        const response = await AXIOS_INSTANCE.get<UserProfile>(
          `/users/${userId}`
        );
        const user = response.data;

        // Set all form fields
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setPhoneNumber(user.phoneNumber || '');
        setBio(user.bio || '');

        // Set original values
        setOriginalFirstName(user.firstName);
        setOriginalLastName(user.lastName);
        setOriginalEmail(user.email);
        setOriginalPhoneNumber(user.phoneNumber || '');
        setOriginalBio(user.bio || '');
      } catch (err: any) {
        setFetchError(
          err.response?.data?.message || 'Failed to load user data'
        );
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Manual dirty checking whenever any field changes
  useEffect(() => {
    const hasChanges =
      firstName !== originalFirstName ||
      lastName !== originalLastName ||
      email !== originalEmail ||
      phoneNumber !== originalPhoneNumber ||
      bio !== originalBio;

    setIsDirty(hasChanges);
  }, [
    firstName,
    lastName,
    email,
    phoneNumber,
    bio,
    originalFirstName,
    originalLastName,
    originalEmail,
    originalPhoneNumber,
    originalBio,
  ]);

  // Manual onChange handlers for each field
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
    // Clear messages when user starts typing
    setSuccessMessage(null);
    setSaveError(null);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
    setSuccessMessage(null);
    setSaveError(null);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setSuccessMessage(null);
    setSaveError(null);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
    setSuccessMessage(null);
    setSaveError(null);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
    setSuccessMessage(null);
    setSaveError(null);
  };

  // Manual reset handler
  const handleReset = () => {
    setFirstName(originalFirstName);
    setLastName(originalLastName);
    setEmail(originalEmail);
    setPhoneNumber(originalPhoneNumber);
    setBio(originalBio);
    setSuccessMessage(null);
    setSaveError(null);
  };

  // Manual form submission with try/catch
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Manual validation
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setSaveError('First name, last name, and email are required');
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);
      setSuccessMessage(null);

      const updateData: UpdateUserProfileRequest = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim() || null,
        bio: bio.trim() || null,
      };

      const response = await AXIOS_INSTANCE.put<UserProfile>(
        `/users/${userId}`,
        updateData
      );

      const updatedUser = response.data;

      // Update original values after successful save
      setOriginalFirstName(updatedUser.firstName);
      setOriginalLastName(updatedUser.lastName);
      setOriginalEmail(updatedUser.email);
      setOriginalPhoneNumber(updatedUser.phoneNumber || '');
      setOriginalBio(updatedUser.bio || '');

      // Update form fields to match response
      setFirstName(updatedUser.firstName);
      setLastName(updatedUser.lastName);
      setEmail(updatedUser.email);
      setPhoneNumber(updatedUser.phoneNumber || '');
      setBio(updatedUser.bio || '');

      setSuccessMessage('Profile updated successfully!');
    } catch (err: any) {
      setSaveError(
        err.response?.data?.message || 'Failed to update profile'
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingData) {
    return (
      <div>
        <h2>Traditional Approach (useState)</h2>
        <p>Loading user data...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div>
        <h2>Traditional Approach (useState)</h2>
        <p style={{ color: 'red' }}>Error: {fetchError}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Traditional Approach (useState)</h2>
      <p>
        <strong>Manual state management with useState</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="trad-firstName">
            First Name <span style={{ color: 'red' }}>*</span>
          </label>
          <br />
          <input
            id="trad-firstName"
            type="text"
            value={firstName}
            onChange={handleFirstNameChange}
            disabled={isSaving}
            required
          />
        </div>

        <div>
          <label htmlFor="trad-lastName">
            Last Name <span style={{ color: 'red' }}>*</span>
          </label>
          <br />
          <input
            id="trad-lastName"
            type="text"
            value={lastName}
            onChange={handleLastNameChange}
            disabled={isSaving}
            required
          />
        </div>

        <div>
          <label htmlFor="trad-email">
            Email <span style={{ color: 'red' }}>*</span>
          </label>
          <br />
          <input
            id="trad-email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            disabled={isSaving}
            required
          />
        </div>

        <div>
          <label htmlFor="trad-phoneNumber">Phone Number</label>
          <br />
          <input
            id="trad-phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            disabled={isSaving}
          />
        </div>

        <div>
          <label htmlFor="trad-bio">Bio</label>
          <br />
          <textarea
            id="trad-bio"
            value={bio}
            onChange={handleBioChange}
            disabled={isSaving}
            rows={4}
            style={{ width: '300px' }}
          />
        </div>

        {saveError && (
          <div>
            <p style={{ color: 'red' }}>Error: {saveError}</p>
          </div>
        )}

        {successMessage && (
          <div>
            <p style={{ color: 'green' }}>{successMessage}</p>
          </div>
        )}

        <div>
          <button type="submit" disabled={!isDirty || isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={handleReset} disabled={!isDirty || isSaving}>
            Reset
          </button>
        </div>
      </form>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>
          <strong>Lines of code:</strong> ~250+ (with all the boilerplate)
        </p>
        <p>
          <strong>useState hooks:</strong> 13 separate state variables
        </p>
        <p>
          <strong>useEffect hooks:</strong> 2 (one for fetching, one for dirty
          tracking)
        </p>
        <p>
          <strong>Manual handlers:</strong> 7 separate functions
        </p>
      </div>
    </div>
  );
}
