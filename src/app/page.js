'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, BookOpen, Crown, Palette, ShieldCheck } from 'lucide-react';
import dataStore, { ROLES } from '@/lib/data';
import styles from '@/styles/login.module.css';

const ROLE_OPTIONS = [
  { role: ROLES.STUDENT, icon: GraduationCap, label: 'Student', defaultEmail: 'student1' },
  { role: ROLES.CLASS_TEACHER, icon: BookOpen, label: 'Class Teacher', defaultEmail: 'teacher1' },
  { role: ROLES.HOD, icon: ShieldCheck, label: 'HOD', defaultEmail: 'hod_cse' },
  { role: ROLES.PRINCIPAL, icon: Crown, label: 'Principal', defaultEmail: 'principal' },
  { role: ROLES.CULTURAL_STAFF, icon: Palette, label: 'Cultural Dept', defaultEmail: 'cultural1' },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(ROLES.STUDENT);
  const [email, setEmail] = useState('student1');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    const option = ROLE_OPTIONS.find(r => r.role === role);
    if (option) setEmail(option.defaultEmail);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = dataStore.login(email, password);
      if (user) {
        localStorage.setItem('campusod_session', JSON.stringify(user));
        const routes = {
          [ROLES.STUDENT]: '/dashboard/student',
          [ROLES.CLASS_TEACHER]: '/dashboard/class-teacher',
          [ROLES.HOD]: '/dashboard/hod',
          [ROLES.PRINCIPAL]: '/dashboard/principal',
          [ROLES.CULTURAL_STAFF]: '/dashboard/cultural',
        };
        router.push(routes[user.role] || '/dashboard/student');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <GraduationCap size={32} />
          </div>
        </div>

        <h1 className={styles.title}>CampusOD</h1>
        <p className={styles.subtitle}>College On-Duty Management System</p>

        <div className={styles.roleSelector}>
          {ROLE_OPTIONS.map(({ role, icon: Icon, label }) => (
            <button
              key={role}
              className={`${styles.rolePill} ${selectedRole === role ? styles.active : ''}`}
              onClick={() => handleRoleSelect(role)}
              type="button"
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="login-email">Username</label>
            <input
              id="login-email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.demoCredentials}>
          <p><strong>Demo Credentials</strong></p>
          <p>Password for all: <code>demo123</code></p>
          {ROLE_OPTIONS.map(({ label, defaultEmail }) => (
            <p key={defaultEmail}>{label}: <code>{defaultEmail}</code></p>
          ))}
        </div>
      </div>
    </div>
  );
}
