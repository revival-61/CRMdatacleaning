import { groq } from "next-sanity";
import { Post, Author, Category, Tag, Settings } from "../types";

export const postFields = groq`
  _id,
  _type,
  title,
  slug,
  excerpt,
  body,
  coverImage,
  publishedAt,
  updatedAt,
  readTime,
  "category": category->{
    _id,
    _type,
    title,
    slug,
    description
  },
  "tags": tags[]->{
    _id,
    _type,
    title,
    slug
  },
  "author": author->{
    _id,
    _type,
    name,
    slug,
    bio,
    avatar,
    socialLinks
  },
  seo,
  "internalLinks": internalLinks[]->{
    _id,
    _type,
    title,
    slug,
    excerpt,
    coverImage,
    publishedAt,
    "category": category->{
      title,
      slug
    }
  }
`;

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  ${postFields}
}`;

export const allPostsQuery = groq`*[_type == "post" && defined(publishedAt)] | order(publishedAt desc){
  ${postFields}
}`;

export const postsByCategoryQuery = groq`*[_type == "post" && category->slug.current == $categorySlug && defined(publishedAt)] | order(publishedAt desc){
  ${postFields}
}`;

export const postsByTagQuery = groq`*[_type == "post" && $tagSlug in tags[]->slug.current && defined(publishedAt)] | order(publishedAt desc){
  ${postFields}
}`;

export const popularPostsQuery = groq`*[_type == "post" && defined(publishedAt)] | order(publishedAt desc)[0...10]{
  ${postFields}
}`;

export const relatedPostsQuery = groq`*[_type == "post" && _id != $postId && defined(publishedAt) && (
  category._ref == $categoryId || 
  count(tags[@._ref in $tagIds]) > 0
)] | order(publishedAt desc)[0...6]{
  ${postFields}
}`;

export const allCategoriesQuery = groq`*[_type == "category"] | order(title asc){
  _id,
  _type,
  title,
  slug,
  description
}`;

export const allTagsQuery = groq`*[_type == "tag"] | order(title asc){
  _id,
  _type,
  title,
  slug
}`;

export const settingsQuery = groq`*[_type == "settings"][0]{
  _id,
  _type,
  siteTitle,
  siteDescription,
  logo,
  footerLinks
}`;

export const searchPostsQuery = groq`*[_type == "post" && defined(publishedAt) && (
  title match $query ||
  excerpt match $query ||
  body[].children[].text match $query
)] | order(publishedAt desc){
  ${postFields}
}`;

