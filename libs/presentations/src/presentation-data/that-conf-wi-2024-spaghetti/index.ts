import { Presentation } from '../../lib/presentations';

const presentation: Presentation = {
  title:
    "From Spaghetti to S'mores: Tasty Techniques for Code Compartmentalization",
  description: `Just as a camper carefully layers ingredients for the perfect s'more, a developer can construct code with precise structure and compartmentalization. Spaghetti code often results in a development experience that's as messy as an over-melted marshmallow, but with the right strategies, we can achieve clarity and maintainability in our projects.

  In this session, attendees will dive into the layers of code compartmentalization, from understanding the importance of clear modular boundaries to appreciating the advantages of single-responsibility components. Additionally, a subtle yet impactful touch to this organized approach is the integration of monorepo tooling, ensuring cohesion and simplicity in larger projects.
  
  By the end, participants will be equipped with a toolkit that ensures their code remains organized, adaptable, and streamlined. Whether seeking strategies to simplify legacy systems or contemplating the management of new projects, this talk offers insights and guidance to refine your development process, much like the art of crafting a perfectly layered s'more.
  `,
  presentedAt: 'THAT Conference WI',
  presentedOn: new Date(2024, 7, 1),
  mdUrl: 'slides',
  slug: 'that-conf-wi-2024-spaghetti',
  extraLinks: [
    {
      url: 'https://thatconference.com/activities/PalQD9RFAmU7lfbig47x',
      title: 'THAT link',
    },
  ],
};

export default presentation;
