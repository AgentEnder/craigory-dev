import { Presentation } from '../../lib/presentations';

const presentation: Presentation = {
  title: 'Full Stack Type Safety Across Languages',
  description: `Explore how type safety can transcend language barriers, and how you can combine your front-end and back-end code into a killer monorepo with Nx, .NET, and Angular. Using openapi extraction and code generation, we will explore how changing an interface in the backend can trigger build time failures for your front end, and exactly why that is a good thing anyways.\nThe driving example will utilize C# and ASP.NET Core, with Angular for the front end. Alternative commands will be provided for react, but both the front end and back end can be swapped out for nearly any tool that you may want to use`,
  presentedAt: 'dev up',
  presentedOn: new Date(2023, 7, 28),
  slug: 'devup-2023-full-stack-type-safety',
  mdUrl: 'slides',
  scssUrl: 'slides'
};
export default presentation;
