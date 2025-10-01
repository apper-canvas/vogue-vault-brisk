import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { useAuth } from "@/hooks/useAuth";
import userService from "@/services/api/userService";

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
const userProfile = await userService.getProfile();
      setProfile(userProfile);
      setFormData({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        email: userProfile.email || "",
        phone: userProfile.phone || ""
      });
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);

    try {
const updatedProfile = await userService.updateProfile(formData);
      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
setFormData({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      email: profile.email || "",
      phone: profile.phone || ""
    });
    setIsEditing(false);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-display font-bold text-primary">
            My Profile
          </h1>
          {!isEditing && (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              <ApperIcon name="Edit" size={16} />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="bg-white rounded-lg p-8">
          {!isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-primary/60 block mb-2">
                    First Name
                  </label>
<p className="text-lg font-medium text-primary">
                    {profile.firstName}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-primary/60 block mb-2">
                    Last Name
                  </label>
                  <p className="text-lg font-medium text-primary">
{profile.lastName}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm text-primary/60 block mb-2">
                  Email
                </label>
<p className="text-lg font-medium text-primary">
                  {profile.email}
                </p>
              </div>

              <div>
                <label className="text-sm text-primary/60 block mb-2">
                  Phone
                </label>
<p className="text-lg font-medium text-primary">
                  {profile.phone || "Not provided"}
                </p>
              </div>

{profile.addresses && profile.addresses.length > 0 && (
                <div>
                  <label className="text-sm text-primary/60 block mb-3">
                    Saved Addresses
                  </label>
                  <div className="space-y-3">
                    {profile.addresses.map((address) => (
                      <div
                        key={address.Id}
                        className="border border-secondary rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-primary">
                            {address.firstName} {address.lastName}
                          </p>
                          {address.isDefault && (
                            <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-primary/60 text-sm">
                          <p>{address.address}</p>
                          <p>
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p>{address.country}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-secondary">
                <p className="text-sm text-primary/60">
Member since{" "}
                  {new Date(profile.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  type="text"
                  name="firstName"
value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Last Name"
                  type="text"
                  name="lastName"
value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <Input
                label="Email"
                type="email"
name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled
                required
              />

              <Input
                label="Phone"
                type="tel"
name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <ApperIcon name="Loader2" size={20} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Save" size={20} />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;