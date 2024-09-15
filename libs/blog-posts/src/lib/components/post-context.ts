import { createContext } from 'react';
import { BlogPost } from '../blog-post';

export const PostContext = createContext<BlogPost | null>(null);
