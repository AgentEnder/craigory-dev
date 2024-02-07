import { BlogPost } from '../../blog-post';
import mdx from './contents.mdx';

export const nxConfigurationHistory: BlogPost = {
  mdx,
  publishDate: new Date(2024, 1, 5),
  slug: 'nx-configuration-history',
  title: 'Nx Configuration History',
  description: `Nx's configuration has changed dramatically over the years, and it's been a long journey to get to where we are today. I joined the Nx team in June 2021, right before we split up \`workspace.json\` into \`workspace.json\` and \`project.json\`. Since joining the team, I've had a pretty direct hand in many of these changes, and have worked closely on others.`
};
