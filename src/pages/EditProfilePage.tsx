import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';
import { useUploadImage } from '@/hooks/useUploadImage';
import { useRequiredUser } from '@/hooks/useRequiredUser';
import { getErrorMessage } from '@/lib/apiError';
import { isHttpUrl } from '@/lib/validators';

const BIO_MAX = 160;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

interface ImageField {
  url: string;
  error: string | null;
}

export function EditProfilePage() {
  const user = useRequiredUser();
  const navigate = useNavigate();
  const updateProfile = useUpdateProfile();
  const upload = useUploadImage();
  const avatarInput = useRef<HTMLInputElement>(null);
  const bannerInput = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState(user.display_name);
  const [bio, setBio] = useState(user.bio);
  const [location, setLocation] = useState(user.location);
  const [website, setWebsite] = useState(user.website_url);
  const [avatar, setAvatar] = useState<ImageField>({ url: user.avatar_url, error: null });
  const [banner, setBanner] = useState<ImageField>({ url: user.banner_url, error: null });
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched) return;
    setDisplayName(user.display_name);
    setBio(user.bio);
    setLocation(user.location);
    setWebsite(user.website_url);
    setAvatar({ url: user.avatar_url, error: null });
    setBanner({ url: user.banner_url, error: null });
  }, [user, touched]);

  const errors = {
    displayName: !displayName.trim()
      ? 'Display name is required.'
      : displayName.trim().length > 50
        ? 'Display name must be at most 50 characters.'
        : undefined,
    bio: bio.length > BIO_MAX ? `Bio must be at most ${BIO_MAX} characters.` : undefined,
    location: location.length > 30 ? 'Location must be at most 30 characters.' : undefined,
    website: website.trim() && !isHttpUrl(website) ? 'Enter a valid URL.' : undefined,
    avatar: avatar.url.trim() && !isHttpUrl(avatar.url) ? 'Enter a valid image URL.' : undefined,
    banner: banner.url.trim() && !isHttpUrl(banner.url) ? 'Enter a valid image URL.' : undefined,
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>, kind: 'avatar' | 'banner') => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const setField = kind === 'avatar' ? setAvatar : setBanner;
    setField((field) => ({ ...field, error: null }));

    if (!file.type.startsWith('image/')) {
      setField((field) => ({ ...field, error: 'Choose an image file.' }));
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setField((field) => ({ ...field, error: 'Image must be 5MB or smaller.' }));
      return;
    }

    upload.mutate(file, {
      onSuccess: ({ url }) => setField({ url, error: null }),
      onError: (error) => setField((field) => ({ ...field, error: getErrorMessage(error) })),
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (hasErrors || updateProfile.isPending || upload.isPending) return;

    updateProfile.mutate(
      {
        display_name: displayName.trim(),
        bio,
        location,
        website_url: website.trim(),
        avatar_url: avatar.url.trim(),
        banner_url: banner.url.trim(),
      },
      { onSuccess: () => navigate(`/${user.username}`) },
    );
  };

  return (
    <>
      <PageHeader title="Edit profile" showBack />

      <form onSubmit={handleSubmit} className="pb-8">
        <div className="relative">
          <div className="relative h-32 bg-field sm:h-48">
            {banner.url && (
              <img src={banner.url} alt="" className="size-full object-cover" />
            )}
            <input
              ref={bannerInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleUpload(event, 'banner')}
            />
            <button
              type="button"
              onClick={() => bannerInput.current?.click()}
              disabled={upload.isPending}
              className="absolute inset-0 flex items-center justify-center bg-black/40 text-white transition-opacity hover:bg-black/50 disabled:opacity-60"
              aria-label="Change banner image"
            >
              <Camera className="size-6" />
            </button>
          </div>

          <div className="px-4">
            <div className="relative -mt-12 w-fit sm:-mt-16">
              <Avatar src={avatar.url} name={displayName || user.display_name} size="xl" className="border-4 border-bg" />
              <input
                ref={avatarInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleUpload(event, 'avatar')}
              />
              <button
                type="button"
                onClick={() => avatarInput.current?.click()}
                disabled={upload.isPending}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white transition-opacity hover:bg-black/50 disabled:opacity-60"
                aria-label="Change profile photo"
              >
                <Camera className="size-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-4 pt-4">
          {(avatar.error || banner.error) && (
            <p role="alert" className="text-sm text-red-500">
              {avatar.error ?? banner.error}
            </p>
          )}

          <TextField
            label="Display name"
            value={displayName}
            maxLength={60}
            onChange={(event) => {
              setTouched(true);
              setDisplayName(event.target.value);
            }}
            error={errors.displayName}
          />

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="bio" className="text-sm text-muted">
                Bio
              </label>
              <span className={bio.length > BIO_MAX ? 'text-sm text-red-500' : 'text-sm text-muted'}>
                {bio.length}/{BIO_MAX}
              </span>
            </div>
            <textarea
              id="bio"
              value={bio}
              rows={3}
              onChange={(event) => {
                setTouched(true);
                setBio(event.target.value);
              }}
              className="w-full resize-none rounded-md border border-line bg-transparent px-3 py-2.5 outline-none transition-colors focus:border-brand"
            />
            {errors.bio && (
              <p role="alert" className="mt-1 text-sm text-red-500">
                {errors.bio}
              </p>
            )}
          </div>

          <TextField
            label="Location"
            value={location}
            maxLength={40}
            onChange={(event) => {
              setTouched(true);
              setLocation(event.target.value);
            }}
            error={errors.location}
          />

          <TextField
            label="Website"
            type="url"
            value={website}
            placeholder="https://example.com"
            onChange={(event) => {
              setTouched(true);
              setWebsite(event.target.value);
            }}
            error={errors.website}
          />

          <TextField
            label="Avatar image URL"
            type="url"
            value={avatar.url}
            placeholder="https://example.com/avatar.jpg"
            onChange={(event) => setAvatar({ url: event.target.value, error: null })}
            error={errors.avatar}
          />

          <TextField
            label="Banner image URL"
            type="url"
            value={banner.url}
            placeholder="https://example.com/banner.jpg"
            onChange={(event) => setBanner({ url: event.target.value, error: null })}
            error={errors.banner}
          />

          {updateProfile.error && (
            <p role="alert" className="text-sm text-red-500">
              {getErrorMessage(updateProfile.error)}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => navigate(`/${user.username}`)}>
              Cancel
            </Button>
            <Button type="submit" loading={updateProfile.isPending} disabled={upload.isPending || hasErrors}>
              Save
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
