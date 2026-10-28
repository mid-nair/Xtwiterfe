import type { ComponentType } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { GuestRoute } from './GuestRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { RouteError } from './RouteError';

/** Code-splits a page: lazyPage(() => import('@/pages/X'), 'X'). */
const lazyPage =
  <K extends string>(load: () => Promise<Record<K, ComponentType>>, key: K) =>
    async () => ({ Component: (await load())[key] });

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', lazy: lazyPage(() => import('@/pages/LoginPage'), 'LoginPage') },
      { path: '/register', lazy: lazyPage(() => import('@/pages/RegisterPage'), 'RegisterPage') },
    ],
  },
  {
    element: <ProtectedRoute />,
    errorElement: <RouteError />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, lazy: lazyPage(() => import('@/pages/HomePage'), 'HomePage') },
          { path: 'explore', lazy: lazyPage(() => import('@/pages/ExplorePage'), 'ExplorePage') },
          { path: 'notifications', lazy: lazyPage(() => import('@/pages/NotificationsPage'), 'NotificationsPage') },
          { path: 'messages', lazy: lazyPage(() => import('@/pages/MessagesPage'), 'MessagesPage') },
          {
            path: 'messages/:conversationId',
            lazy: lazyPage(() => import('@/pages/ConversationPage'), 'ConversationPage'),
          },
          { path: 'bookmarks', lazy: lazyPage(() => import('@/pages/BookmarksPage'), 'BookmarksPage') },
          { path: 'memories', lazy: lazyPage(() => import('@/pages/MemoriesPage'), 'MemoriesPage') },
          { path: 'letters', lazy: lazyPage(() => import('@/pages/LettersPage'), 'LettersPage') },
          { path: 'tweet/:tweetId', lazy: lazyPage(() => import('@/pages/TweetDetailPage'), 'TweetDetailPage') },
          {
            path: 'settings/profile',
            lazy: lazyPage(() => import('@/pages/EditProfilePage'), 'EditProfilePage'),
          },
          {
            path: ':username/followers',
            lazy: lazyPage(() => import('@/pages/FollowListPage'), 'FollowListPage'),
          },
          {
            path: ':username/following',
            lazy: lazyPage(() => import('@/pages/FollowListPage'), 'FollowListPage'),
          },
          { path: ':username', lazy: lazyPage(() => import('@/pages/ProfilePage'), 'ProfilePage') },
        ],
      },
    ],
  },
  { path: '*', lazy: lazyPage(() => import('@/pages/NotFoundPage'), 'NotFoundPage') },
]);
