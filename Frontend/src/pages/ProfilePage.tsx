import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar, Card, Loading, Alert, Button, Input } from '../components';
import type { User } from '../services/authService';
import { authService } from '../services/authService';

export const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setUsername(userData.username);
      setEmail(userData.email);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load profile'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const updatedUser = await authService.updateProfile(user.id, {
        username,
        email,
      });
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update profile'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {isLoading ? (
          <Loading />
        ) : user ? (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">{user.username}</h1>
              {!isEditing && (
                <Button
                  variant="secondary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <Input
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSaving}
                />

                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSaving}
                />

                <div className="flex space-x-4">
                  <Button
                    type="submit"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-gray-600 text-sm">Email</label>
                  <p className="text-gray-800">{user.email}</p>
                </div>
                <div>
                  <label className="text-gray-600 text-sm">Member Since</label>
                  <p className="text-gray-800">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </Card>
        ) : (
          <Alert type="error" message="User not found" />
        )}
      </div>
    </>
  );
};
