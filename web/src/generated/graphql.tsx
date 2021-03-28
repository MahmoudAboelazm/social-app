import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  posts: PaginatedPosts;
  post?: Maybe<Post>;
  users: Array<User>;
  sendCookie?: Maybe<Scalars['String']>;
  me?: Maybe<User>;
  userProfile: UserProfile;
};


export type QueryPostsArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryPostArgs = {
  id: Scalars['Int'];
};


export type QueryUserProfileArgs = {
  username: Scalars['String'];
};

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  posts: Array<Post>;
  hasMore: Scalars['Boolean'];
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['Float'];
  creatorId: Scalars['Float'];
  creator: User;
  voteStatus?: Maybe<Scalars['Int']>;
  title: Scalars['String'];
  text: Scalars['String'];
  points: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  textSnippet: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  EXTERNAL_ID?: Maybe<Scalars['String']>;
  EXTERNAL_TYPE?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type UserProfile = {
  __typename?: 'UserProfile';
  user?: Maybe<User>;
  posts?: Maybe<Array<Post>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: PostResponse;
  deletePost: Scalars['Boolean'];
  vote: Scalars['Boolean'];
  updatePost?: Maybe<Post>;
  forgotPassword: Scalars['Boolean'];
  resetPassord: UserResponse;
  register: UserResponse;
  login: UserResponse;
  loginByGoogle: UserResponse;
  logout: Scalars['Boolean'];
};


export type MutationCreatePostArgs = {
  input: PostInput;
};


export type MutationDeletePostArgs = {
  postId: Scalars['Int'];
};


export type MutationVoteArgs = {
  postId: Scalars['Int'];
  value: Scalars['Int'];
};


export type MutationUpdatePostArgs = {
  text: Scalars['String'];
  title: Scalars['String'];
  id: Scalars['Int'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationResetPassordArgs = {
  token: Scalars['String'];
  newPassword: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: UserInput;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationLoginByGoogleArgs = {
  clientId: Scalars['String'];
  tokenId: Scalars['String'];
  email: Scalars['String'];
};

export type PostResponse = {
  __typename?: 'PostResponse';
  error?: Maybe<Array<FieldPostError>>;
  post?: Maybe<Post>;
};

export type FieldPostError = {
  __typename?: 'FieldPostError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type PostInput = {
  title: Scalars['String'];
  text: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  error?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type UserInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type CreatePostMutationVariables = Exact<{
  input: PostInput;
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'PostResponse' }
    & { error?: Maybe<Array<(
      { __typename?: 'FieldPostError' }
      & Pick<FieldPostError, 'field' | 'message'>
    )>>, post?: Maybe<(
      { __typename?: 'Post' }
      & Pick<Post, 'title' | 'id' | 'text' | 'creatorId'>
    )> }
  ) }
);

export type DeletePostMutationVariables = Exact<{
  postId: Scalars['Int'];
}>;


export type DeletePostMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deletePost'>
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { error?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'username' | 'id'>
    )> }
  ) }
);

export type LoginByGoogleMutationVariables = Exact<{
  email: Scalars['String'];
  clientId: Scalars['String'];
  tokenId: Scalars['String'];
}>;


export type LoginByGoogleMutation = (
  { __typename?: 'Mutation' }
  & { loginByGoogle: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'username' | 'id'>
    )>, error?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  options: UserInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & { error?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    )> }
  ) }
);

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ResetPasswordMutation = (
  { __typename?: 'Mutation' }
  & { resetPassord: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'username' | 'id'>
    )>, error?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>> }
  ) }
);

export type UpdatePostMutationVariables = Exact<{
  id: Scalars['Int'];
  title: Scalars['String'];
  text: Scalars['String'];
}>;


export type UpdatePostMutation = (
  { __typename?: 'Mutation' }
  & { updatePost?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'creatorId' | 'id' | 'text' | 'textSnippet' | 'title' | 'createdAt' | 'updatedAt' | 'points' | 'voteStatus'>
  )> }
);

export type VoteMutationVariables = Exact<{
  postId: Scalars['Int'];
  value: Scalars['Int'];
}>;


export type VoteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'vote'>
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
  )> }
);

export type PostQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PostQuery = (
  { __typename?: 'Query' }
  & { post?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'creatorId' | 'id' | 'text' | 'textSnippet' | 'title' | 'createdAt' | 'updatedAt' | 'points' | 'voteStatus'>
  )> }
);

export type PostsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type PostsQuery = (
  { __typename?: 'Query' }
  & { posts: (
    { __typename?: 'PaginatedPosts' }
    & Pick<PaginatedPosts, 'hasMore'>
    & { posts: Array<(
      { __typename?: 'Post' }
      & Pick<Post, 'creatorId' | 'id' | 'text' | 'textSnippet' | 'title' | 'createdAt' | 'updatedAt' | 'points' | 'voteStatus'>
      & { creator: (
        { __typename?: 'User' }
        & Pick<User, 'email' | 'username' | 'id'>
      ) }
    )> }
  ) }
);

export type SendCookieQueryVariables = Exact<{ [key: string]: never; }>;


export type SendCookieQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'sendCookie'>
);

export type UserProfileQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type UserProfileQuery = (
  { __typename?: 'Query' }
  & { userProfile: (
    { __typename?: 'UserProfile' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'email'>
    )>, posts?: Maybe<Array<(
      { __typename?: 'Post' }
      & Pick<Post, 'creatorId' | 'id' | 'text' | 'textSnippet' | 'title' | 'createdAt' | 'updatedAt' | 'points' | 'voteStatus'>
      & { creator: (
        { __typename?: 'User' }
        & Pick<User, 'email' | 'username' | 'id'>
      ) }
    )>> }
  ) }
);


export const CreatePostDocument = gql`
    mutation CreatePost($input: PostInput!) {
  createPost(input: $input) {
    error {
      field
      message
    }
    post {
      title
      id
      text
      creatorId
    }
  }
}
    `;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const DeletePostDocument = gql`
    mutation DeletePost($postId: Int!) {
  deletePost(postId: $postId)
}
    `;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    error {
      field
      message
    }
    user {
      username
      id
    }
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LoginByGoogleDocument = gql`
    mutation LoginByGoogle($email: String!, $clientId: String!, $tokenId: String!) {
  loginByGoogle(email: $email, clientId: $clientId, tokenId: $tokenId) {
    user {
      username
      id
    }
    error {
      field
      message
    }
  }
}
    `;

export function useLoginByGoogleMutation() {
  return Urql.useMutation<LoginByGoogleMutation, LoginByGoogleMutationVariables>(LoginByGoogleDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($options: userInput!) {
  register(options: $options) {
    error {
      field
      message
    }
    user {
      id
      username
    }
  }
}
    `;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const ResetPasswordDocument = gql`
    mutation ResetPassword($token: String!, $newPassword: String!) {
  resetPassord(token: $token, newPassword: $newPassword) {
    user {
      username
      id
    }
    error {
      field
      message
    }
  }
}
    `;

export function useResetPasswordMutation() {
  return Urql.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument);
};
export const UpdatePostDocument = gql`
    mutation UpdatePost($id: Int!, $title: String!, $text: String!) {
  updatePost(id: $id, title: $title, text: $text) {
    creatorId
    id
    text
    textSnippet
    title
    createdAt
    updatedAt
    points
    voteStatus
  }
}
    `;

export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument);
};
export const VoteDocument = gql`
    mutation Vote($postId: Int!, $value: Int!) {
  vote(postId: $postId, value: $value)
}
    `;

export function useVoteMutation() {
  return Urql.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    id
    username
  }
}
    `;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const PostDocument = gql`
    query Post($id: Int!) {
  post(id: $id) {
    creatorId
    id
    text
    textSnippet
    title
    createdAt
    updatedAt
    points
    voteStatus
  }
}
    `;

export function usePostQuery(options: Omit<Urql.UseQueryArgs<PostQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostQuery>({ query: PostDocument, ...options });
};
export const PostsDocument = gql`
    query Posts($limit: Int!, $cursor: String) {
  posts(limit: $limit, cursor: $cursor) {
    hasMore
    posts {
      creatorId
      id
      text
      textSnippet
      title
      createdAt
      updatedAt
      points
      voteStatus
      creator {
        email
        username
        id
      }
    }
  }
}
    `;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};
export const SendCookieDocument = gql`
    query sendCookie {
  sendCookie
}
    `;

export function useSendCookieQuery(options: Omit<Urql.UseQueryArgs<SendCookieQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SendCookieQuery>({ query: SendCookieDocument, ...options });
};
export const UserProfileDocument = gql`
    query UserProfile($username: String!) {
  userProfile(username: $username) {
    user {
      id
      username
      email
    }
    posts {
      creatorId
      id
      text
      textSnippet
      title
      createdAt
      updatedAt
      points
      voteStatus
      creator {
        email
        username
        id
      }
    }
  }
}
    `;

export function useUserProfileQuery(options: Omit<Urql.UseQueryArgs<UserProfileQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserProfileQuery>({ query: UserProfileDocument, ...options });
};