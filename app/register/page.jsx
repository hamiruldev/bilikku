'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import debounce from 'lodash.debounce';
import { userAPI } from '../../services/api';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    username: ''
  });

  // Validation states
  const [validationErrors, setValidationErrors] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  // Add these new states at the top of your component
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);

  // Debounced validation functions
  const debouncedUsernameCheck = useCallback(
    debounce(async (username) => {
      if (username.length < 3) {
        setIsUsernameAvailable(false);
        return;
      }

      setIsCheckingUsername(true);
      try {
        const isAvailable = await validateUsername(username);
        setIsUsernameAvailable(isAvailable);
        setValidationErrors(prev => ({
          ...prev,
          username: isAvailable ? '' : t('auth.errors.usernameExists')
        }));
      } catch (error) {
        console.error('Username validation error:', error);
        setIsUsernameAvailable(false);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 500),
    []
  );

  const debouncedEmailCheck = useCallback(
    debounce(async (email) => {
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setIsEmailAvailable(false);
        return;
      }

      setIsCheckingEmail(true);
      try {
        const isAvailable = await validateEmail(email);
        setIsEmailAvailable(isAvailable);
        setValidationErrors(prev => ({
          ...prev,
          email: isAvailable ? '' : t('auth.errors.emailExists')
        }));
      } catch (error) {
        console.error('Email validation error:', error);
        setIsEmailAvailable(false);
      } finally {
        setIsCheckingEmail(false);
      }
    }, 500),
    []
  );

  // Add this memoized value for form validity
  const isFormValid = useMemo(() => {
    const errors = {};
    let isValid = true;

    // Username validation
    if (formData.username.length < 3) {
      errors.username = t('auth.errors.usernameTooShort');
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = t('auth.errors.usernameInvalid');
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = t('auth.errors.emailInvalid');
      isValid = false;
    }

    // Password validation
    if (formData.password.length < 8) {
      errors.password = t('auth.errors.passwordTooShort');
      isValid = false;
    } else {

      if (!/[a-z]/.test(formData.password)) {
        errors.password = t('auth.errors.passwordNoLowercase');
        isValid = false;
      }
      if (!/[0-9]/.test(formData.password)) {
        errors.password = t('auth.errors.passwordNoNumber');
        isValid = false;
      }
    }

    // Password confirmation validation
    if (formData.password !== formData.passwordConfirm) {
      errors.passwordConfirm = t('auth.errors.passwordMismatch');
      isValid = false;
    }

    return isValid;
  }, [formData, t]); // Dependencies for useMemo

  // Update the validateForm function to use the memoized validation
  const validateForm = () => {
    const errors = {};

    // Username validation
    if (formData.username.length < 3) {
      errors.username = t('auth.errors.usernameTooShort');
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = t('auth.errors.usernameInvalid');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = t('auth.errors.emailInvalid');
    }

    // Password validation
    if (formData.password.length < 8) {
      errors.password = t('auth.errors.passwordTooShort');
    } else {
      // if (!/[A-Z]/.test(formData.password)) {
      //  errors.password = t('auth.errors.passwordNoUppercase');
      // }
      if (!/[a-z]/.test(formData.password)) {
        errors.password = t('auth.errors.passwordNoLowercase');
      }
      if (!/[0-9]/.test(formData.password)) {
        errors.password = t('auth.errors.passwordNoNumber');
      }
    }

    // Password confirmation validation
    if (formData.password !== formData.passwordConfirm) {
      errors.passwordConfirm = t('auth.errors.passwordMismatch');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!validateForm()) {
        return;
      }

      await userAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        name: formData.name,
      });

      router.push('/login?registered=true');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error?.data?.message || error?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error when user starts typing
    setValidationErrors(prev => ({
      ...prev,
      [name]: ''
    }));

    // Trigger real-time validation for username and email
    if (name === 'username') {
      if (value.length >= 3) {
        debouncedUsernameCheck(value);
      } else {
        setIsUsernameAvailable(false);
      }
    }

    if (name === 'email') {
      if (value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        debouncedEmailCheck(value);
      } else {
        setIsEmailAvailable(false);
      }
    }
  };

  // Clean up debounced functions
  useEffect(() => {
    return () => {
      debouncedUsernameCheck.cancel();
      debouncedEmailCheck.cancel();
    };
  }, []);

  // Function to determine if the button should be disabled
  const isButtonDisabled = () => {



    const state = isLoading ||
      !isUsernameAvailable ||
      !isEmailAvailable ||
      isCheckingUsername ||
      isCheckingEmail ||
      !formData.password ||
      !formData.username ||
      !formData.email ||
      !formData.name ||
      formData.password !== formData.passwordConfirm ||
      !isFormValid

    document.getElementById("register-button")?.disabled == state



    return (
      state
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">{t('auth.register')}</h2>
          <p className="mt-2 text-muted-foreground">
            {t('auth.registerSubtitle')}
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Username field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                {t('auth.username')}
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className={`input-field ${validationErrors.username
                    ? 'border-destructive'
                    : isUsernameAvailable && formData.username.length >= 3
                      ? 'border-green-500'
                      : ''
                    }`}
                  placeholder={t('auth.usernamePlaceholder')}
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {isCheckingUsername ? (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : isUsernameAvailable && formData.username.length >= 3 ? (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                    ✓
                  </div>
                ) : null}
              </div>
              {validationErrors.username ? (
                <p className="mt-1 text-sm text-destructive">
                  {validationErrors.username}
                </p>
              ) : isUsernameAvailable && formData.username.length >= 3 ? (
                <p className="mt-1 text-sm text-green-500">
                  {t('auth.usernameAvailable')}
                </p>
              ) : null}
            </div>

            {/* Name field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                {t('auth.name')}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input-field"
                placeholder={t('auth.namePlaceholder')}
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`input-field ${validationErrors.email
                    ? 'border-destructive'
                    : isEmailAvailable && formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
                      ? 'border-green-500'
                      : ''
                    }`}
                  placeholder={t('auth.emailPlaceholder')}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {isCheckingEmail ? (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : isEmailAvailable && formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ? (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                    ✓
                  </div>
                ) : null}
              </div>
              {validationErrors.email ? (
                <p className="mt-1 text-sm text-destructive">
                  {validationErrors.email}
                </p>
              ) : isEmailAvailable && formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ? (
                <p className="mt-1 text-sm text-green-500">
                  {t('auth.emailAvailable')}
                </p>
              ) : null}
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className={`input-field pr-10 ${validationErrors.password ? 'border-destructive' : ''}`}
                  placeholder={t('auth.passwordPlaceholder')}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-destructive">
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password field */}
            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium mb-2">
                {t('auth.confirmPassword')}
              </label>
              <div className="relative">
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type={showPassword ? "text" : "password"}
                  required
                  className={`input-field pr-10 ${validationErrors.passwordConfirm ? 'border-destructive' : ''}`}
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              {validationErrors.passwordConfirm && (
                <p className="mt-1 text-sm text-destructive">
                  {validationErrors.passwordConfirm}
                </p>
              )}
            </div>
          </div>


          <button
            id="register-button"
            type="submit"
            className="btn-primary w-full"
          >
            {isLoading ? t('common.loading') : t('auth.register')}
            {isButtonDisabled()}

          </button>

          <p className="text-center text-sm">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link href="/login" className="text-primary hover:underline">
              {t('auth.login')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
} 