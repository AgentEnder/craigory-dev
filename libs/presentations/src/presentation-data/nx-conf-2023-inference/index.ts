import { Presentation } from '../../lib/presentations';

const presentation: Presentation = {
  title: 'Redefining Projects with Nx: A Dive into the New Inference API',
  description: `In a continuous strive for improvement, we have revamped the project inference API, aiming to provide greater flexibility and power in defining and managing projects. This talk will walk through the evolution of the project inference API, highlighting the transition from a 1:1 file-to-project mapping to a more nuanced approach that handles complex project configurations. We'll explore the key advantages of the new API, including the ability to define multiple projects within a single file and set more comprehensive project properties. Join us to learn about these exciting changes and understand how they can enhance your work with Nx.`,
  presentedAt: 'Nx Conf 2023',
  presentedOn: new Date(2023, 10, 26),
  slug: 'nx-conf-2023-inference',
  mdUrl: 'slides',
  scssUrl: 'slides',
  recordingUrl: 'https://www.youtube.com/live/IQ5YyEYZw68?si=TQRfAG7CtNbd3Xu4&t=8514',
  extraLinks: [
    {
      title: 'Demo Repo',
      url: 'https://github.com/AgentEnder/inference-demo',
    },
    {
      title: 'Nx .NET plugin API v2 PR',
      url: 'https://github.com/nx-dotnet/nx-dotnet/pull/763'
    }
  ],
};

export default presentation;
