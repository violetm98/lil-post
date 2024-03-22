import { backendURL } from '../config';

export const environment = {
  production: false,
  BASE_URL: backendURL,
  POST: {
    POST_BASE_URL: `${backendURL}/post/`,
    ADD_NEW_POST: 'add',
    GET_ALL_POSTS: 'list',
    GET_A_POST: 'view',
    UPDATE_POST: 'update',
    DELETE_POST: 'delete',
    SEARCH_POST: 'search',
  },
  USER: {
    USER_BASE_URL: `${backendURL}/user/`,
    SIGN_UP_USER: 'signup',
    LOG_IN_USER: 'login',
    GET_USER: 'view/profile',
    GET_USER_POST: 'view/posts',
    GET_LIKED_POST: 'likes',
    GET_BOOKMARKED_POST: 'bookmarks',
    UPDATE_USER: 'update',
    DELETE_USER: 'delete',
    LOGOUT_USER: 'logout',
  },
  LIKE: {
    LIKE_BASE_URL: `${backendURL}/like/`,
    LIKE_COUNT: 'count',
    LIKE_STATUS: 'status',
    ADD_LIKE: 'add',
    DELETE_LIKE: 'delete',
  },
};
